/**
 * AAR History Component
 * Searchable database of past After Action Reviews
 */

import { useState, useEffect, useMemo } from 'react';
import { aarService } from '../../services/aarService';
import { useAuthStore } from '../../store/authStore';
import type { AfterActionReview } from '../../types/aar';
import { 
  AARSearchBar, AARFilterControls, AAREmptyState, AARCard 
} from './AARHistoryComponents';

type LevelFilter = 'all' | 'crawl' | 'walk' | 'run-guided' | 'run-independent';
type SortOption = 'newest' | 'oldest' | 'lesson' | 'level';

const sortAARs = (aars: AfterActionReview[], sortBy: SortOption): AfterActionReview[] => {
  const levelOrder: Record<string, number> = { crawl: 1, walk: 2, 'run-guided': 3, 'run-independent': 4 };
  return [...aars].sort((a, b) => {
    switch (sortBy) {
      case 'newest': return b.createdAt.getTime() - a.createdAt.getTime();
      case 'oldest': return a.createdAt.getTime() - b.createdAt.getTime();
      case 'lesson': return a.lessonId.localeCompare(b.lessonId);
      case 'level': return levelOrder[a.level] - levelOrder[b.level];
      default: return 0;
    }
  });
};

export default function AARHistory() {
  const { user } = useAuthStore();
  const [aars, setAars] = useState<AfterActionReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<LevelFilter>('all');
  const [selectedLesson, setSelectedLesson] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  useEffect(() => {
    const loadAARData = async () => {
      if (!user?.uid) return;
      try {
        setAars(await aarService.getUserAARs(user.uid));
      } catch (error) {
        console.error('Failed to load AARs:', error);
      } finally {
        setLoading(false);
      }
    };
    loadAARData();
  }, [user?.uid]);

  const uniqueLessons = useMemo(() => 
    [...new Set(aars.map(aar => aar.lessonId))].sort(), [aars]);

  const filteredAars = useMemo(() => {
    let filtered = aars;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(aar =>
        aar.whatWasAccomplished.toLowerCase().includes(term) ||
        aar.whyDidNotWork.toLowerCase().includes(term) ||
        aar.whatDidILearn.toLowerCase().includes(term) ||
        aar.lessonId.toLowerCase().includes(term)
      );
    }
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(aar => aar.level === selectedLevel);
    }
    if (selectedLesson !== 'all') {
      filtered = filtered.filter(aar => aar.lessonId === selectedLesson);
    }
    return sortAARs(filtered, sortBy);
  }, [aars, searchTerm, selectedLevel, selectedLesson, sortBy]);

  const hasFilters = searchTerm || selectedLevel !== 'all' || selectedLesson !== 'all';

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">AAR History</h1>
        <p className="text-gray-400">Review your past reflections and identify patterns in your learning journey.</p>
      </div>

      <div className="bg-slate-800 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <AARSearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
          <AARFilterControls
            selectedLevel={selectedLevel} selectedLesson={selectedLesson} sortBy={sortBy}
            lessons={uniqueLessons} filteredCount={filteredAars.length} totalCount={aars.length}
            onLevelChange={setSelectedLevel} onLessonChange={setSelectedLesson} onSortChange={setSortBy}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredAars.length === 0 
          ? <AAREmptyState hasFilters={!!hasFilters} />
          : filteredAars.map(aar => <AARCard key={aar.id} aar={aar} />)
        }
      </div>
    </div>
  );
}
