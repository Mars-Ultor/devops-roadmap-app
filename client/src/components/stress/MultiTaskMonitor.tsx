/* eslint-disable max-lines-per-function */
/**
 * MultiTaskMonitor Component - Progressive Stress System
 * Monitors and displays multiple simultaneous tasks during high-stress training
 */

import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Clock, AlertTriangle, Layers } from 'lucide-react';
import { ProgressiveStressService } from '../../services/progressiveStress';
import { STRESS_CONFIG } from '../../types/stress';

interface Task {
  id: string;
  description: string;
  status: 'pending' | 'active' | 'completed';
  startedAt?: Date;
  completedAt?: Date;
  priority: 'low' | 'medium' | 'high';
}

interface MultiTaskMonitorProps {
  sessionId: string;
  onTaskCompleted?: (taskId: string) => void;
  onAllTasksCompleted?: () => void;
  className?: string;
}

export const MultiTaskMonitor: React.FC<MultiTaskMonitorProps> = ({
  sessionId,
  onTaskCompleted,
  onAllTasksCompleted,
  className = ''
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTaskCount, setActiveTaskCount] = useState(0);
  const [isEnabled, setIsEnabled] = useState(false);

  const stressService = ProgressiveStressService.getInstance();

  useEffect(() => {
    const session = stressService.getSessionStatus(sessionId);
    if (session && session.simultaneousTasks > 1) {
      setIsEnabled(true);
      initializeTasks(session.simultaneousTasks);
    } else {
      setIsEnabled(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const initializeTasks = (taskCount: number) => {
    const newTasks: Task[] = [];
    for (let i = 0; i < taskCount; i++) {
      const scenario = STRESS_CONFIG.multiTaskScenarios[
        Math.floor(Math.random() * STRESS_CONFIG.multiTaskScenarios.length)
      ];

      newTasks.push({
        id: `task_${i + 1}`,
        description: scenario,
        status: i === 0 ? 'active' : 'pending',
        priority: i === 0 ? 'high' : 'medium',
        startedAt: i === 0 ? new Date() : undefined
      });
    }
    setTasks(newTasks);
    setActiveTaskCount(1);
  };

  const completeTask = (taskId: string) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            status: 'completed' as const,
            completedAt: new Date()
          };
        }
        return task;
      });

      // Activate next pending task
      const nextPendingTask = updatedTasks.find(task => task.status === 'pending');
      if (nextPendingTask) {
        nextPendingTask.status = 'active';
        nextPendingTask.startedAt = new Date();
        setActiveTaskCount(prev => prev + 1);
      }

      // Check if all tasks are completed
      const allCompleted = updatedTasks.every(task => task.status === 'completed');
      if (allCompleted) {
        onAllTasksCompleted?.();
      }

      return updatedTasks;
    });

    onTaskCompleted?.(taskId);
  };

  const getTaskIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'active':
        return <Clock className="w-4 h-4 text-blue-400 animate-pulse" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTaskColor = (status: Task['status'], priority: Task['priority']) => {
    if (status === 'completed') return 'border-green-500 bg-green-900/20';
    if (status === 'active') {
      return priority === 'high' ? 'border-red-500 bg-red-900/20' : 'border-blue-500 bg-blue-900/20';
    }
    return 'border-gray-600 bg-gray-900/20';
  };

  const getCompletionStats = () => {
    const completed = tasks.filter(task => task.status === 'completed').length;
    const total = tasks.length;
    return { completed, total, percentage: Math.round((completed / total) * 100) };
  };

  if (!isEnabled) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-green-900/20 border border-green-500 text-green-400 ${className}`}>
        <Layers className="w-4 h-4" />
        <span className="text-sm">Multi-task: Single focus mode</span>
      </div>
    );
  }

  const stats = getCompletionStats();

  return (
    <div className={`p-4 rounded-lg border-2 border-orange-500 bg-orange-900/20 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Layers className="w-5 h-5 text-orange-400" />
        <span className="font-semibold text-orange-400">
          MULTI-TASK MODE: {activeTaskCount} Active Tasks
        </span>
        <span className="text-sm text-orange-300">
          ({stats.completed}/{stats.total} completed - {stats.percentage}%)
        </span>
      </div>

      <div className="space-y-3">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className={`p-3 rounded-lg border-2 ${getTaskColor(task.status, task.priority)}`}
          >
            <div className="flex items-start gap-3">
              {getTaskIcon(task.status)}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">
                    Task {index + 1}: {task.priority.toUpperCase()} Priority
                  </span>
                  {task.status === 'active' && (
                    <span className="px-2 py-1 bg-red-900/50 text-red-300 text-xs rounded">
                      ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-300">{task.description}</p>

                {task.status === 'active' && (
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => completeTask(task.id)}
                      className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white text-sm rounded transition-colors"
                    >
                      Mark Complete
                    </button>
                    <span className="text-xs text-gray-400">
                      Started: {task.startedAt?.toLocaleTimeString()}
                    </span>
                  </div>
                )}

                {task.status === 'completed' && task.completedAt && (
                  <div className="mt-1 text-xs text-green-400">
                    Completed at {task.completedAt.toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-gray-800/50 rounded border border-gray-600">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-orange-400" />
          <span className="text-sm font-medium text-orange-300">Multi-Task Training</span>
        </div>
        <p className="text-xs text-gray-400">
          Complete tasks in priority order. High-priority tasks take precedence.
          This simulates real-world DevOps scenarios where multiple issues require attention simultaneously.
        </p>
      </div>
    </div>
  );
};

export default MultiTaskMonitor;