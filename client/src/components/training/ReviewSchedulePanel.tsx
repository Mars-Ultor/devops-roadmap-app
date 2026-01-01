/**
 * ReviewSchedulePanel - Daily review schedule with priority-based organization
 * Integrates SM-2 spaced repetition with mastery levels
 */

import { useState, useEffect } from 'react';
import { Calendar, Clock, Target, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../../hooks/useProgress';
import { 
  generateReviewSchedule, 
  getReviewsDueToday, 
  calculateDailyReviewLoad,
  predictRetention,
  type ReviewSchedule 
} from '../../services/spacedRepetition';

export default function ReviewSchedulePanel() {
  const navigate = useNavigate();
  const { getAllLessonProgress } = useProgress();
  const [reviews, setReviews] = useState<ReviewSchedule[]>([]);
  const [dueToday, setDueToday] = useState<ReviewSchedule[]>([]);
  const [dailyLoad, setDailyLoad] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviewSchedule();
  }, []);

  const loadReviewSchedule = async () => {
    try {
      // Get all lesson progress with SM-2 data
      const allProgress = await getAllLessonProgress();
      
      // Get mastery data for each lesson
      const masteryData = new Map();
      const lessonTitles = new Map();
      
      // For now, use lesson IDs as titles (would need to fetch actual titles)
      allProgress.forEach(p => {
        lessonTitles.set(p.lessonId, `Lesson ${p.lessonId.substring(0, 8)}`);
      });
      
      // Generate review schedule
      const schedule = generateReviewSchedule(allProgress, masteryData, lessonTitles);
      const todayReviews = getReviewsDueToday(schedule);
      
      // Calculate mastery distribution (mock for now)
      const masteryDist = {
        'crawl': 0,
        'walk': 0,
        'run-guided': 0,
        'run-independent': 0
      };
      
      const load = calculateDailyReviewLoad(
        todayReviews.length,
        masteryDist
      );
      
      setReviews(schedule);
      setDueToday(todayReviews);
      setDailyLoad(load);
    } catch (error) {
      console.error('Error loading review schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-900/20';
      case 'high': return 'border-orange-500 bg-orange-900/20';
      case 'medium': return 'border-yellow-500 bg-yellow-900/20';
      case 'low': return 'border-green-500 bg-green-900/20';
      default: return 'border-slate-700';
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      critical: 'bg-red-900/30 text-red-400',
      high: 'bg-orange-900/30 text-orange-400',
      medium: 'bg-yellow-900/30 text-yellow-400',
      low: 'bg-green-900/30 text-green-400'
    };
    return colors[priority as keyof typeof colors] || '';
  };

  const getMasteryColor = (level?: string) => {
    switch (level) {
      case 'run-independent': return 'text-purple-400';
      case 'run-guided': return 'text-indigo-400';
      case 'walk': return 'text-blue-400';
      case 'crawl': return 'text-green-400';
      default: return 'text-slate-400';
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="text-center text-slate-400">Loading review schedule...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Daily Load Summary */}
      {dailyLoad && (
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
              <div className="text-3xl font-bold text-indigo-400">
                {dueToday.length}
              </div>
              <div className="text-sm text-slate-400">Due Today</div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-3 text-center">
              <div className="text-lg font-semibold text-yellow-400">
                {dailyLoad.minimum}
              </div>
              <div className="text-xs text-slate-400">Minimum</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 text-center border-2 border-indigo-500/50">
              <div className="text-lg font-semibold text-indigo-400">
                {dailyLoad.recommended}
              </div>
              <div className="text-xs text-slate-400">Recommended</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 text-center">
              <div className="text-lg font-semibold text-purple-400">
                {dailyLoad.maximum}
              </div>
              <div className="text-xs text-slate-400">Maximum</div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Due Today */}
      {dueToday.length > 0 && (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-yellow-400" />
            Reviews Due Today ({dueToday.length})
          </h3>
          
          <div className="space-y-2">
            {dueToday.map((review, index) => {
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
                  onClick={() => navigate(`/lesson/${review.contentId}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
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
                      
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        {review.masteryLevel && (
                          <span className={getMasteryColor(review.masteryLevel)}>
                            {review.masteryLevel === 'run-independent' ? '🎯 Run-Independent' :
                             review.masteryLevel === 'run-guided' ? '🏃 Run-Guided' :
                             review.masteryLevel === 'walk' ? '🚶 Walk' : '🐾 Crawl'}
                          </span>
                        )}
                        <span>Rep: {review.sm2Data.repetitions}</span>
                        <span>Interval: {review.sm2Data.interval}d</span>
                        <span>EF: {review.sm2Data.easinessFactor.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${
                        retention >= 0.8 ? 'text-green-400' :
                        retention >= 0.6 ? 'text-yellow-400' :
                        retention >= 0.4 ? 'text-orange-400' : 'text-red-400'
                      }`}>
                        {(retention * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-slate-400">Retention</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upcoming Reviews */}
      {reviews.filter(r => r.daysUntilReview > 0 && r.daysUntilReview <= 7).length > 0 && (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-400" />
            Upcoming This Week
          </h3>
          
          <div className="grid grid-cols-7 gap-2">
            {[0, 1, 2, 3, 4, 5, 6].map(day => {
              const date = new Date();
              date.setDate(date.getDate() + day + 1);
              const dayReviews = reviews.filter(r => {
                const reviewDate = new Date(r.nextReviewDate);
                reviewDate.setHours(0, 0, 0, 0);
                date.setHours(0, 0, 0, 0);
                return reviewDate.getTime() === date.getTime();
              });
              
              return (
                <div
                  key={day}
                  className={`bg-slate-900/50 rounded-lg p-3 text-center ${
                    dayReviews.length > 0 ? 'border-2 border-indigo-500/50' : 'border border-slate-700'
                  }`}
                >
                  <div className="text-xs text-slate-400 mb-1">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className={`text-lg font-bold ${
                    dayReviews.length === 0 ? 'text-slate-600' :
                    dayReviews.length <= 3 ? 'text-green-400' :
                    dayReviews.length <= 7 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {dayReviews.length}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No Reviews */}
      {dueToday.length === 0 && (
        <div className="bg-slate-800 rounded-lg p-12 border border-slate-700 text-center">
          <Target className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">All Caught Up!</h3>
          <p className="text-slate-400">
            No reviews due today. Great job staying current with your studies!
          </p>
        </div>
      )}
    </div>
  );
}
