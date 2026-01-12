/**
 * ReviewSchedulePanel - UI Components
 */

import { Calendar, Clock, Target, Brain } from 'lucide-react';
import { type ReviewSchedule, predictRetention } from '../../services/spacedRepetition';
import {
  getPriorityColor,
  getPriorityBadge,
  getMasteryColor,
  getMasteryLabel,
  getRetentionColor,
  getDayCountColor,
  type DailyLoadData
} from './ReviewSchedulePanelUtils';

// Loading State
export function LoadingState() {
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <div className="text-center text-slate-400">Loading review schedule...</div>
    </div>
  );
}

// Daily Load Summary
interface DailyLoadSummaryProps {
  dailyLoad: DailyLoadData;
  dueCount: number;
}

export function DailyLoadSummary({ dailyLoad, dueCount }: DailyLoadSummaryProps) {
  return (
    <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 rounded-lg p-6 border border-indigo-500/30">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
            <Brain className="w-6 h-6 text-indigo-400" />
            Daily Review Load
          </h3>
          <p className="text-slate-300 text-sm">{dailyLoad.reasoning}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-indigo-400">{dueCount}</div>
          <div className="text-sm text-slate-400">Due Today</div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <LoadStatCard value={dailyLoad.minimum} label="Minimum" color="text-yellow-400" />
        <LoadStatCard 
          value={dailyLoad.recommended} 
          label="Recommended" 
          color="text-indigo-400" 
          highlighted 
        />
        <LoadStatCard value={dailyLoad.maximum} label="Maximum" color="text-purple-400" />
      </div>
    </div>
  );
}

// Load Stat Card
interface LoadStatCardProps {
  value: number;
  label: string;
  color: string;
  highlighted?: boolean;
}

function LoadStatCard({ value, label, color, highlighted }: LoadStatCardProps) {
  return (
    <div className={`bg-slate-800/50 rounded-lg p-3 text-center ${
      highlighted ? 'border-2 border-indigo-500/50' : ''
    }`}>
      <div className={`text-lg font-semibold ${color}`}>{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}

// Review Item
interface ReviewItemProps {
  review: ReviewSchedule;
  index: number;
  onClick: () => void;
}

export function ReviewItem({ review, index, onClick }: ReviewItemProps) {
  const daysSinceReview = -review.daysUntilReview;
  const retention = predictRetention(
    review.sm2Data.easinessFactor,
    review.sm2Data.repetitions,
    daysSinceReview
  );

  return (
    <div
      key={`${review.contentId}-${index}`}
      className={`rounded-lg p-4 border-2 transition-all hover:bg-slate-700/50 cursor-pointer ${getPriorityColor(review.priority)}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <ReviewItemHeader review={review} />
          <ReviewItemStats review={review} />
        </div>
        
        <div className="text-right">
          <div className={`text-2xl font-bold ${getRetentionColor(retention)}`}>
            {(retention * 100).toFixed(0)}%
          </div>
          <div className="text-xs text-slate-400">Retention</div>
        </div>
      </div>
    </div>
  );
}

function ReviewItemHeader({ review }: { review: ReviewSchedule }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <h4 className="font-semibold text-white">{review.contentTitle}</h4>
      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getPriorityBadge(review.priority)}`}>
        {review.priority.toUpperCase()}
      </span>
      {review.daysUntilReview < 0 && (
        <span className="px-2 py-0.5 bg-red-900/50 text-red-400 rounded text-xs font-semibold">
          {Math.abs(review.daysUntilReview)}d OVERDUE
        </span>
      )}
    </div>
  );
}

function ReviewItemStats({ review }: { review: ReviewSchedule }) {
  return (
    <div className="flex items-center gap-4 text-sm text-slate-400">
      {review.masteryLevel && (
        <span className={getMasteryColor(review.masteryLevel)}>
          {getMasteryLabel(review.masteryLevel)}
        </span>
      )}
      <span>Rep: {review.sm2Data.repetitions}</span>
      <span>Interval: {review.sm2Data.interval}d</span>
      <span>EF: {review.sm2Data.easinessFactor.toFixed(2)}</span>
    </div>
  );
}

// Reviews Due Today Section
interface ReviewsDueTodayProps {
  reviews: ReviewSchedule[];
  onReviewClick: (contentId: string) => void;
}

export function ReviewsDueToday({ reviews, onReviewClick }: ReviewsDueTodayProps) {
  if (reviews.length === 0) return null;

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Calendar className="w-6 h-6 text-yellow-400" />
        Reviews Due Today ({reviews.length})
      </h3>
      
      <div className="space-y-2">
        {reviews.map((review, index) => (
          <ReviewItem
            key={review.contentId}
            review={review}
            index={index}
            onClick={() => onReviewClick(review.contentId)}
          />
        ))}
      </div>
    </div>
  );
}

// Upcoming Week Section
interface UpcomingWeekProps {
  reviews: ReviewSchedule[];
}

export function UpcomingWeek({ reviews }: UpcomingWeekProps) {
  const upcomingReviews = reviews.filter(r => r.daysUntilReview > 0 && r.daysUntilReview <= 7);
  if (upcomingReviews.length === 0) return null;

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Clock className="w-6 h-6 text-blue-400" />
        Upcoming This Week
      </h3>
      
      <div className="grid grid-cols-7 gap-2">
        {[0, 1, 2, 3, 4, 5, 6].map(day => (
          <DayColumn key={day} day={day} reviews={reviews} />
        ))}
      </div>
    </div>
  );
}

interface DayColumnProps {
  day: number;
  reviews: ReviewSchedule[];
}

function DayColumn({ day, reviews }: DayColumnProps) {
  const date = new Date();
  date.setDate(date.getDate() + day + 1);
  
  const dayReviews = reviews.filter(r => {
    const reviewDate = new Date(r.nextReviewDate);
    reviewDate.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return reviewDate.getTime() === compareDate.getTime();
  });

  return (
    <div className={`bg-slate-900/50 rounded-lg p-3 text-center ${
      dayReviews.length > 0 ? 'border-2 border-indigo-500/50' : 'border border-slate-700'
    }`}>
      <div className="text-xs text-slate-400 mb-1">
        {date.toLocaleDateString('en-US', { weekday: 'short' })}
      </div>
      <div className={`text-lg font-bold ${getDayCountColor(dayReviews.length)}`}>
        {dayReviews.length}
      </div>
    </div>
  );
}

// Empty State
export function AllCaughtUp() {
  return (
    <div className="bg-slate-800 rounded-lg p-12 border border-slate-700 text-center">
      <Target className="w-16 h-16 text-green-400 mx-auto mb-4" />
      <h3 className="text-2xl font-bold text-white mb-2">All Caught Up!</h3>
      <p className="text-slate-400">
        No reviews due today. Great job staying current with your studies!
      </p>
    </div>
  );
}
