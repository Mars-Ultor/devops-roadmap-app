/**
 * ReviewSchedulePanel - Daily review schedule with priority-based organization
 * Integrates SM-2 spaced repetition with mastery levels
 */

import { useNavigate } from 'react-router-dom';
import { useReviewSchedule } from './useReviewSchedule';
import {
  LoadingState,
  DailyLoadSummary,
  ReviewsDueToday,
  UpcomingWeek,
  AllCaughtUp
} from './ReviewSchedulePanelComponents';

export default function ReviewSchedulePanel() {
  const navigate = useNavigate();
  const { reviews, dueToday, dailyLoad, loading } = useReviewSchedule();

  const handleReviewClick = (contentId: string) => {
    navigate(`/lesson/${contentId}`);
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-4">
      {dailyLoad && (
        <DailyLoadSummary dailyLoad={dailyLoad} dueCount={dueToday.length} />
      )}

      <ReviewsDueToday reviews={dueToday} onReviewClick={handleReviewClick} />

      <UpcomingWeek reviews={reviews} />

      {dueToday.length === 0 && <AllCaughtUp />}
    </div>
  );
}
