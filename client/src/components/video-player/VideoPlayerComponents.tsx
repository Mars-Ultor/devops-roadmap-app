/**
 * Video Player Sub-Components
 * Extracted from VideoPlayer.tsx for ESLint compliance
 */

import React from 'react';
import { Play, CheckCircle2 } from 'lucide-react';

// Header with completion status
interface VideoHeaderProps {
  title: string;
  xpReward: number;
  isWatched: boolean;
}

export function VideoHeader({ title, xpReward, isWatched }: VideoHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="text-slate-400 text-sm mt-1">{isWatched ? 'Completed' : `Watch to earn ${xpReward} XP`}</p>
      </div>
      {isWatched && (
        <div className="flex items-center gap-2 bg-green-900/30 text-green-400 px-3 py-1 rounded-full">
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-sm font-medium">Watched</span>
        </div>
      )}
    </div>
  );
}

// Play Button Placeholder
interface PlayButtonProps {
  onClick: () => void;
}

export function PlayButton({ onClick }: PlayButtonProps) {
  return (
    <button onClick={onClick} className="w-full aspect-video bg-slate-900 rounded-lg flex items-center justify-center border-2 border-slate-700 hover:border-indigo-500 transition-colors group">
      <div className="text-center">
        <Play className="w-16 h-16 text-indigo-400 mx-auto mb-2 group-hover:text-indigo-300" />
        <p className="text-slate-300 font-medium">Click to watch video</p>
      </div>
    </button>
  );
}

// YouTube Embed
interface YouTubeEmbedProps {
  videoId: string;
  title: string;
}

export function YouTubeEmbed({ videoId, title }: YouTubeEmbedProps) {
  return (
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
  );
}

// Mark as Watched Button
interface MarkWatchedButtonProps {
  xpReward: number;
  awarding: boolean;
  onClick: () => void;
}

export function MarkWatchedButton({ xpReward, awarding, onClick }: MarkWatchedButtonProps) {
  return (
    <button onClick={onClick} disabled={awarding}
      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
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
  );
}
