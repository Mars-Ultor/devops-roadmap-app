import { useState, useEffect } from 'react';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import { useProgress } from '../hooks/useProgress';
import { Play, CheckCircle2 } from 'lucide-react';

interface VideoPlayerProps {
  videoId: string; // YouTube video ID
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
    // Check if user has already watched this video (check progress collection)
    const checkWatchStatus = async () => {
      if (!user) return;
      
      try {
        const progress = await getLessonProgress(lessonId);
        setIsWatched(!!progress);
      } catch (error) {
        console.error('Error checking watch status:', error);
      }
    };

    checkWatchStatus();
  }, [user, lessonId, getLessonProgress]);

  const handleMarkAsWatched = async () => {
    if (!user || isWatched || awarding) return;

    setAwarding(true);
    try {
      // Mark lesson as completed in progress collection (awards XP automatically)
      await completeLesson(lessonId, xpReward, 5);

      // Mark video as watched (for legacy tracking)
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        watchedVideos: arrayUnion(lessonId)
      });

      setIsWatched(true);
      
      // Refresh user data
      window.location.reload();
    } catch (error) {
      console.error('Error marking video as watched:', error);
      alert('Failed to award XP. Please try again.');
    } finally {
      setAwarding(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <p className="text-slate-400 text-sm mt-1">
            {isWatched ? 'Completed' : `Watch to earn ${xpReward} XP`}
          </p>
        </div>
        
        {isWatched && (
          <div className="flex items-center gap-2 bg-green-900/30 text-green-400 px-3 py-1 rounded-full">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm font-medium">Watched</span>
          </div>
        )}
      </div>

      {!showVideo ? (
        <button
          onClick={() => setShowVideo(true)}
          className="w-full aspect-video bg-slate-900 rounded-lg flex items-center justify-center border-2 border-slate-700 hover:border-indigo-500 transition-colors group"
        >
          <div className="text-center">
            <Play className="w-16 h-16 text-indigo-400 mx-auto mb-2 group-hover:text-indigo-300" />
            <p className="text-slate-300 font-medium">Click to watch video</p>
          </div>
        </button>
      ) : (
        <div className="space-y-4">
          <div className="aspect-video rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?rel=0`}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          {!isWatched && (
            <button
              onClick={handleMarkAsWatched}
              disabled={awarding}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {awarding ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Awarding XP...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Mark as Watched (+{xpReward} XP)</span>
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
