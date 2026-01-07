/**
 * AAR History Sub-Components
 * Extracted from AARHistory.tsx for ESLint compliance
 */

import React from 'react';
import { Search, Filter, Calendar, BookOpen, TrendingUp, AlertCircle, CheckCircle, Lightbulb, Target } from 'lucide-react';
import type { AfterActionReview, AARPattern } from '../../types/aar';
import { getLevelColor, formatDate, getPatternTypeClass } from './aarHistoryUtils';

// Props interfaces
interface SearchBarProps {
  searchTerm: string;
  onSearch: (term: string) => void;
}

interface FilterControlsProps {
  selectedLevel: 'all' | 'crawl' | 'walk' | 'run-guided' | 'run-independent';
  selectedLesson: string;
  sortBy: 'newest' | 'oldest' | 'lesson' | 'level';
  lessons: string[];
  filteredCount: number;
  totalCount: number;
  onLevelChange: (level: 'all' | 'crawl' | 'walk' | 'run-guided' | 'run-independent') => void;
  onLessonChange: (lesson: string) => void;
  onSortChange: (sort: 'newest' | 'oldest' | 'lesson' | 'level') => void;
}

interface AARCardProps {
  aar: AfterActionReview;
}

interface AARPatternsProps {
  patterns: AARPattern[];
}

// Search Bar Component
export function AARSearchBar({ searchTerm, onSearch }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type="text"
        placeholder="Search AARs..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}

// Filter Controls Component
export function AARFilterControls({
  selectedLevel, selectedLesson, sortBy, lessons,
  filteredCount, totalCount,
  onLevelChange, onLessonChange, onSortChange
}: FilterControlsProps) {
  return (
    <>
      <select
        value={selectedLevel}
        onChange={(e) => onLevelChange(e.target.value as 'all' | 'crawl' | 'walk' | 'run-guided' | 'run-independent')}
        className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="all">All Levels</option>
        <option value="crawl">Crawl</option>
        <option value="walk">Walk</option>
        <option value="run-guided">Run-Guided</option>
        <option value="run-independent">Run-Independent</option>
      </select>

      <select
        value={selectedLesson}
        onChange={(e) => onLessonChange(e.target.value)}
        className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="all">All Lessons</option>
        {lessons.map(lesson => (
          <option key={lesson} value={lesson}>{lesson}</option>
        ))}
      </select>

      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as 'newest' | 'oldest' | 'lesson' | 'level')}
        className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="lesson">By Lesson</option>
        <option value="level">By Level</option>
      </select>

      <div className="flex items-center text-gray-400 text-sm">
        <Filter className="w-4 h-4 mr-1" />
        {filteredCount} of {totalCount} AARs
      </div>
    </>
  );
}

// Empty State Component
export function AAREmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="text-center py-12">
      <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-400 mb-2">No AARs found</h3>
      <p className="text-gray-500">
        {hasFilters ? 'Try adjusting your filters' : 'Complete your first lab to create an AAR'}
      </p>
    </div>
  );
}

// AAR Patterns Display
export function AARPatternsDisplay({ patterns }: AARPatternsProps) {
  if (!patterns || patterns.length === 0) return null;

  return (
    <div className="mt-4 p-3 bg-slate-700/50 rounded-md">
      <h4 className="text-sm font-medium text-indigo-400 mb-2 flex items-center">
        <TrendingUp className="w-4 h-4 mr-1" />
        Identified Patterns
      </h4>
      <div className="space-y-2">
        {patterns.map((pattern, index) => {
          const typeClass = getPatternTypeClass(pattern.type);
          return (
            <div key={index} className="text-sm">
              <div className="flex items-start justify-between">
                <span className="text-gray-300">{pattern.description}</span>
                <span className={`px-2 py-1 rounded text-xs ${typeClass}`}>
                  {pattern.type.replace('-', ' ')}
                </span>
              </div>
              <p className="text-gray-400 text-xs mt-1">{pattern.recommendation}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// AAR Card Header
export function AARCardHeader({ aar }: AARCardProps) {
  return (
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
  );
}

// AAR Card Left Content Column
export function AARLeftColumn({ aar }: AARCardProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-indigo-400 mb-2 flex items-center">
          <Target className="w-4 h-4 mr-1" />What was accomplished
        </h3>
        <p className="text-gray-300 text-sm leading-relaxed">{aar.whatWasAccomplished}</p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-green-400 mb-2 flex items-center">
          <CheckCircle className="w-4 h-4 mr-1" />What worked well
        </h3>
        <ul className="text-gray-300 text-sm space-y-1">
          {aar.whatWorkedWell.map((item: string, index: number) => (
            <li key={index} className="flex items-start">
              <span className="text-green-400 mr-2">•</span>{item}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-sm font-medium text-red-400 mb-2 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />What didn't work
        </h3>
        <ul className="text-gray-300 text-sm space-y-1">
          {aar.whatDidNotWork.map((item: string, index: number) => (
            <li key={index} className="flex items-start">
              <span className="text-red-400 mr-2">•</span>{item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// AAR Card Right Content Column
export function AARRightColumn({ aar }: AARCardProps) {
  return (
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
          <Lightbulb className="w-4 h-4 mr-1" />What did I learn?
        </h3>
        <p className="text-gray-300 text-sm leading-relaxed">{aar.whatDidILearn}</p>
      </div>
    </div>
  );
}

// AAR AI Review Section
export function AARAIReview({ aar }: AARCardProps) {
  if (!aar.aiReview) return null;
  
  return (
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
  );
}

// Complete AAR Card
export function AARCard({ aar }: AARCardProps) {
  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <AARCardHeader aar={aar} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AARLeftColumn aar={aar} />
        <AARRightColumn aar={aar} />
      </div>
      <AARAIReview aar={aar} />
      <AARPatternsDisplay patterns={aar.patterns || []} />
    </div>
  );
}
