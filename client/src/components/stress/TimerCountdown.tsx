/**
 * TimerCountdown Component - Progressive Stress System
 * Displays countdown timer with military-style urgency indicators
 */

import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, Zap } from 'lucide-react';

interface TimerCountdownProps {
  initialTimeSeconds: number;
  onTimeUp?: () => void;
  onWarning?: (percentage: number) => void;
  className?: string;
}

export const TimerCountdown: React.FC<TimerCountdownProps> = ({
  initialTimeSeconds,
  onTimeUp,
  onWarning,
  className = ''
}) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTimeSeconds);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1;

        if (newTime <= 0) {
          setIsActive(false);
          onTimeUp?.();
          return 0;
        }

        // Trigger warnings at specific thresholds
        const percentage = (newTime / initialTimeSeconds) * 100;
        if (percentage <= 75 && percentage > 74) onWarning?.(75);
        if (percentage <= 50 && percentage > 49) onWarning?.(50);
        if (percentage <= 25 && percentage > 24) onWarning?.(25);

        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeRemaining, initialTimeSeconds, onTimeUp, onWarning]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getUrgencyLevel = (): 'normal' | 'warning' | 'critical' | 'expired' => {
    if (timeRemaining <= 0) return 'expired';
    const percentage = (timeRemaining / initialTimeSeconds) * 100;
    if (percentage <= 25) return 'critical';
    if (percentage <= 50) return 'warning';
    return 'normal';
  };

  const getUrgencyStyles = () => {
    const level = getUrgencyLevel();
    switch (level) {
      case 'critical':
        return 'bg-red-900 border-red-500 text-red-100 animate-pulse';
      case 'warning':
        return 'bg-yellow-900 border-yellow-500 text-yellow-100';
      case 'expired':
        return 'bg-gray-900 border-gray-500 text-gray-400';
      default:
        return 'bg-blue-900 border-blue-500 text-blue-100';
    }
  };

  const getUrgencyIcon = () => {
    const level = getUrgencyLevel();
    switch (level) {
      case 'critical':
        return <Zap className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      default:
        return <Clock className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border-2 font-mono font-bold text-lg ${getUrgencyStyles()} ${className}`}>
      {getUrgencyIcon()}
      <span className="select-none">
        {timeRemaining <= 0 ? 'TIME EXPIRED' : formatTime(timeRemaining)}
      </span>
      {timeRemaining > 0 && (
        <span className="text-xs opacity-75">
          ({Math.round((timeRemaining / initialTimeSeconds) * 100)}%)
        </span>
      )}
    </div>
  );
};

export default TimerCountdown;