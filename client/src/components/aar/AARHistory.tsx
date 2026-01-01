/**
 * AAR History Component
 * Searchable database of past After Action Reviews
 */

import { useState, useEffect } from 'react';
import { Search, Filter, Calendar, BookOpen, TrendingUp, AlertCircle, CheckCircle, Lightbulb, Target } from 'lucide-react';
import { aarService } from '../../services/aarService';
import { useAuthStore } from '../../store/authStore';
import type { AfterActionReview, AARPattern } from '../../types/aar';

export default function AARHistory() {
  const { user } = useAuthStore();
  const [aars, setAars] = useState<AfterActionReview[]>([]);
  const [filteredAars, setFilteredAars] = useState<AfterActionReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'crawl' | 'walk' | 'run-guided' | 'run-independent'>('all');
  const [selectedLesson, setSelectedLesson] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'lesson' | 'level'>('newest');

  useEffect(() => {
    loadAARs();
  }, [user?.uid, loadAARs]);

  useEffect(() => {
    filterAARs();
  }, [aars, searchTerm, selectedLevel, selectedLesson, sortBy, filterAARs]);

  const loadAARs = async () => {
    if (!user?.uid) return;

    try {
      const userAars = await aarService.getUserAARs(user.uid);
      setAars(userAars);
    } catch (error) {
      console.error('Failed to load AARs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAARs = () => {
    let filtered = [...aars];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(aar =>
        aar.whatWasAccomplished.toLowerCase().includes(term) ||
        aar.whyDidNotWork.toLowerCase().includes(term) ||
        aar.whatDidILearn.toLowerCase().includes(term) ||
        aar.lessonId.toLowerCase().includes(term)
      );
    }

    // Level filter
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(aar => aar.level === selectedLevel);
    }

    // Lesson filter
    if (selectedLesson !== 'all') {
      filtered = filtered.filter(aar => aar.lessonId === selectedLesson);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'oldest':
          return a.createdAt.getTime() - b.createdAt.getTime();
        case 'lesson':
          return a.lessonId.localeCompare(b.lessonId);
        case 'level': {
          const levelOrder: Record<string, number> = { crawl: 1, walk: 2, 'run-guided': 3, 'run-independent': 4 };
          return levelOrder[a.level] - levelOrder[b.level];
        }
        default:
          return 0;
      }
    });

    setFilteredAars(filtered);
  };

  const getUniqueLessons = () => {
    return [...new Set(aars.map(aar => aar.lessonId))].sort();
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'crawl': return 'bg-blue-900/50 text-blue-300 border-blue-700';
      case 'walk': return 'bg-green-900/50 text-green-300 border-green-700';
      case 'run-guided': return 'bg-yellow-900/50 text-yellow-300 border-yellow-700';
      case 'run-independent': return 'bg-purple-900/50 text-purple-300 border-purple-700';
      default: return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const renderPatterns = (patterns: AARPattern[]) => {
    if (!patterns || patterns.length === 0) return null;

    return (
      <div className="mt-4 p-3 bg-slate-700/50 rounded-md">
        <h4 className="text-sm font-medium text-indigo-400 mb-2 flex items-center">
          <TrendingUp className="w-4 h-4 mr-1" />
          Identified Patterns
        </h4>
        <div className="space-y-2">
          {patterns.map((pattern, index) => (
            <div key={index} className="text-sm">
              <div className="flex items-start justify-between">
                <span className="text-gray-300">{pattern.description}</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  pattern.type === 'strength' ? 'bg-green-900/50 text-green-300' :
                  pattern.type === 'weakness' ? 'bg-red-900/50 text-red-300' :
                  'bg-blue-900/50 text-blue-300'
                }`}>
                  {pattern.type.replace('-', ' ')}
                </span>
              </div>
              <p className="text-gray-400 text-xs mt-1">{pattern.recommendation}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">AAR History</h1>
        <p className="text-gray-400">
          Review your past reflections and identify patterns in your learning journey.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search AARs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Level Filter */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value as 'all' | 'crawl' | 'walk' | 'run-guided' | 'run-independent')}
            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Levels</option>
            <option value="crawl">Crawl</option>
            <option value="walk">Walk</option>
            <option value="run-guided">Run-Guided</option>
            <option value="run-independent">Run-Independent</option>
          </select>

          {/* Lesson Filter */}
          <select
            value={selectedLesson}
            onChange={(e) => setSelectedLesson(e.target.value)}
            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Lessons</option>
            {getUniqueLessons().map(lesson => (
              <option key={lesson} value={lesson}>{lesson}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'lesson' | 'level')}
            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="lesson">By Lesson</option>
            <option value="level">By Level</option>
          </select>

          {/* Results count */}
          <div className="flex items-center text-gray-400 text-sm">
            <Filter className="w-4 h-4 mr-1" />
            {filteredAars.length} of {aars.length} AARs
          </div>
        </div>
      </div>

      {/* AAR List */}
      <div className="space-y-4">
        {filteredAars.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">No AARs found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedLevel !== 'all' || selectedLesson !== 'all'
                ? 'Try adjusting your filters'
                : 'Complete your first lab to create an AAR'}
            </p>
          </div>
        ) : (
          filteredAars.map((aar) => (
            <div key={aar.id} className="bg-slate-800 rounded-lg p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getLevelColor(aar.level)}`}>
                    {aar.level.replace('-', ' ').toUpperCase()}
                  </span>
                  <span className="text-gray-300 font-medium">{aar.lessonId}</span>
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(aar.createdAt)}
                </div>
              </div>

              {/* Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-indigo-400 mb-2 flex items-center">
                      <Target className="w-4 h-4 mr-1" />
                      What was accomplished
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{aar.whatWasAccomplished}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-green-400 mb-2 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      What worked well
                    </h3>
                    <ul className="text-gray-300 text-sm space-y-1">
                      {aar.whatWorkedWell.map((item: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-400 mr-2">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-red-400 mb-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      What didn't work
                    </h3>
                    <ul className="text-gray-300 text-sm space-y-1">
                      {aar.whatDidNotWork.map((item: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="text-red-400 mr-2">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-orange-400 mb-2">Why didn't it work?</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{aar.whyDidNotWork}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-blue-400 mb-2">What would I do differently?</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{aar.whatWouldIDoDifferently}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-purple-400 mb-2 flex items-center">
                      <Lightbulb className="w-4 h-4 mr-1" />
                      What did I learn?
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{aar.whatDidILearn}</p>
                  </div>
                </div>
              </div>

              {/* AI Analysis */}
              {aar.aiReview && (
                <div className="mt-6 p-4 bg-slate-700/50 rounded-md">
                  <h4 className="text-sm font-medium text-indigo-400 mb-2">AI Analysis</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-gray-400">Quality Score</span>
                      <div className="text-lg font-bold text-white">{aar.aiReview.score}/10</div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400">Feedback</span>
                      <p className="text-sm text-gray-300">{aar.aiReview.feedback}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Patterns */}
              {renderPatterns(aar.patterns || [])}
            </div>
          ))
        )}
      </div>
    </div>
  );
}