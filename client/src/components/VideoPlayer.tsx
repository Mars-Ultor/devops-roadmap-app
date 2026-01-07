import { useState, useEffect } from 'react';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import { useProgress } from '../hooks/useProgress';
import { VideoHeader, PlayButton, YouTubeEmbed, MarkWatchedButton } from './video-player/VideoPlayerComponents';

interface VideoPlayerProps {
  videoId: string;
  lessonId: string;
  title: string;
  xpReward?: number;
}

export default function VideoPlayer({ videoId, lessonId, title, xpReward = 50 }: VideoPlayerProps) {
  const { user } = useAuthStore();
  const { completeLesson, getLessonProgress } = useProgress();
  const [isWatched, setIsWatched] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [awarding, setAwarding] = useState(false);

  useEffect(() => {
    const checkWatchStatus = async () => {
      if (!user) return;
      try { const progress = await getLessonProgress(lessonId); setIsWatched(!!progress); }
      catch (error) { console.error('Error checking watch status:', error); }
    };
    checkWatchStatus();
  }, [user, lessonId, getLessonProgress]);

  const handleMarkAsWatched = async () => {
    if (!user || isWatched || awarding) return;
    setAwarding(true);
    try {
      await completeLesson(lessonId, xpReward, 5);
      await updateDoc(doc(db, 'users', user.uid), { watchedVideos: arrayUnion(lessonId) });
      setIsWatched(true);
      window.location.reload();
    } catch (error) { console.error('Error marking video as watched:', error); alert('Failed to award XP. Please try again.'); }
    finally { setAwarding(false); }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <VideoHeader title={title} xpReward={xpReward} isWatched={isWatched} />
      {!showVideo ? (
        <PlayButton onClick={() => setShowVideo(true)} />
      ) : (
        <div className="space-y-4">
          <YouTubeEmbed videoId={videoId} title={title} />
          {!isWatched && <MarkWatchedButton xpReward={xpReward} awarding={awarding} onClick={handleMarkAsWatched} />}
        </div>
      )}
    </div>
  );
}
