/* eslint-disable max-lines-per-function */
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import { CheckCircle, AlertCircle, ExternalLink, Code, Trophy, Clock } from 'lucide-react';

interface ProjectTask {
  id: string;
  description: string;
  validation?: {
    type: 'url' | 'file' | 'command' | 'manual';
    expected?: string;
  };
}

interface WeekProject {
  id: string;
  weekNumber: number;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  xp: number;
  tasks: ProjectTask[];
  resources: string[];
  deliverables: string[];
}

const weekProjects: Record<number, WeekProject> = {
  1: {
    id: 'week1-linux-setup',
    weekNumber: 1,
    title: 'Linux Environment Setup & Scripting',
    description: 'Set up a Linux environment and create automation scripts',
    difficulty: 'beginner',
    estimatedTime: 90,
    xp: 200,
    tasks: [
      {
        id: 'task1',
        description: 'Install and configure a Linux distribution (Ubuntu or similar)',
        validation: { type: 'manual' }
      },
      {
        id: 'task2',
        description: 'Create a bash script that displays system information (CPU, memory, disk usage)',
        validation: { type: 'file', expected: 'system-info.sh' }
      },
      {
        id: 'task3',
        description: 'Schedule the script to run daily using cron',
        validation: { type: 'manual' }
      }
    ],
    resources: [
      'Linux commands cheat sheet',
      'Bash scripting tutorial',
      'Cron job examples'
    ],
    deliverables: [
      'Screenshot of Linux system running',
      'system-info.sh bash script',
      'Screenshot of crontab configuration'
    ]
  },
  2: {
    id: 'week2-git-workflow',
    weekNumber: 2,
    title: 'Git Workflow & Collaboration',
    description: 'Create a project using Git best practices',
    difficulty: 'beginner',
    estimatedTime: 120,
    xp: 250,
    tasks: [
      {
        id: 'task1',
        description: 'Create a new GitHub repository with a README and .gitignore',
        validation: { type: 'url' }
      },
      {
        id: 'task2',
        description: 'Create at least 3 feature branches and merge them using pull requests',
        validation: { type: 'manual' }
      },
      {
        id: 'task3',
        description: 'Add meaningful commit messages following conventional commits',
        validation: { type: 'manual' }
      }
    ],
    resources: [
      'GitHub flow documentation',
      'Conventional commits guide',
      'Git branching strategies'
    ],
    deliverables: [
      'GitHub repository URL',
      'Screenshot showing branch history',
      'At least 3 merged pull requests'
    ]
  },
  3: {
    id: 'week3-aws-static-site',
    weekNumber: 3,
    title: 'Deploy Static Website to AWS S3',
    description: 'Host a static website using AWS S3 and CloudFront',
    difficulty: 'intermediate',
    estimatedTime: 150,
    xp: 300,
    tasks: [
      {
        id: 'task1',
        description: 'Create an S3 bucket and configure it for static website hosting',
        validation: { type: 'url' }
      },
      {
        id: 'task2',
        description: 'Upload HTML, CSS, and JavaScript files to the bucket',
        validation: { type: 'manual' }
      },
      {
        id: 'task3',
        description: '(Optional) Set up CloudFront distribution for CDN',
        validation: { type: 'url' }
      }
    ],
    resources: [
      'AWS S3 static hosting guide',
      'CloudFront documentation',
      'Sample website templates'
    ],
    deliverables: [
      'Live website URL (S3 or CloudFront)',
      'Screenshot of S3 bucket configuration',
      'Project repository with source code'
    ]
  },
  4: {
    id: 'week4-docker-app',
    weekNumber: 4,
    title: 'Containerize a Multi-Service Application',
    description: 'Create a Dockerized application with multiple containers',
    difficulty: 'intermediate',
    estimatedTime: 180,
    xp: 350,
    tasks: [
      {
        id: 'task1',
        description: 'Create Dockerfiles for frontend and backend services',
        validation: { type: 'file', expected: 'Dockerfile' }
      },
      {
        id: 'task2',
        description: 'Write a docker-compose.yml file to orchestrate the services',
        validation: { type: 'file', expected: 'docker-compose.yml' }
      },
      {
        id: 'task3',
        description: 'Test the application runs successfully with docker-compose up',
        validation: { type: 'manual' }
      }
    ],
    resources: [
      'Dockerfile best practices',
      'Docker Compose tutorial',
      'Multi-stage build examples'
    ],
    deliverables: [
      'GitHub repository with Dockerfiles',
      'docker-compose.yml file',
      'Screenshot of running containers'
    ]
  },
  5: {
    id: 'week5-k8s-deploy',
    weekNumber: 5,
    title: 'Deploy Application to Kubernetes',
    description: 'Deploy a containerized app to a Kubernetes cluster',
    difficulty: 'advanced',
    estimatedTime: 240,
    xp: 400,
    tasks: [
      {
        id: 'task1',
        description: 'Set up a local Kubernetes cluster (minikube or kind)',
        validation: { type: 'command', expected: 'kubectl get nodes' }
      },
      {
        id: 'task2',
        description: 'Create deployment and service YAML manifests',
        validation: { type: 'file', expected: 'deployment.yaml' }
      },
      {
        id: 'task3',
        description: 'Deploy the application and expose it via a service',
        validation: { type: 'manual' }
      }
    ],
    resources: [
      'Kubernetes basics tutorial',
      'kubectl cheat sheet',
      'Sample K8s manifests'
    ],
    deliverables: [
      'Kubernetes manifest files',
      'Screenshot of running pods',
      'Access URL or port-forward screenshot'
    ]
  }
};

export default function WeekProject() {
  const { weekNumber } = useParams<{ weekNumber: string }>();
  const { user } = useAuthStore();
  
  const [project, setProject] = useState<WeekProject | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [projectCompleted, setProjectCompleted] = useState(false);

  const loadProgress = useCallback(async () => {
    if (!user || !weekNumber) return;

    try {
      const progressDoc = await getDoc(
        doc(db, 'projectProgress', `${user.uid}_week${weekNumber}`)
      );

      if (progressDoc.exists()) {
        const data = progressDoc.data();
        setCompletedTasks(new Set(data.completedTasks || []));
        setSubmissionUrl(data.submissionUrl || '');
        setNotes(data.notes || '');
        setProjectCompleted(data.completed || false);
      }
    } catch (error) {
      console.error('Error loading project progress:', error);
    }
  }, [user, weekNumber]);

  useEffect(() => {
    const week = parseInt(weekNumber || '1');
    const weekProject = weekProjects[week];
    
    if (weekProject) {
      setProject(weekProject);
      loadProgress();
    }
  }, [weekNumber, loadProgress]);

  const toggleTask = (taskId: string) => {
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
    }
    setCompletedTasks(newCompleted);
  };

  const handleSubmit = async () => {
    if (!user || !project) return;

    setSubmitting(true);

    try {
      const allTasksCompleted = project.tasks.every(task => 
        completedTasks.has(task.id)
      );

      await setDoc(doc(db, 'projectProgress', `${user.uid}_week${project.weekNumber}`), {
        userId: user.uid,
        weekNumber: project.weekNumber,
        projectId: project.id,
        completedTasks: Array.from(completedTasks),
        submissionUrl,
        notes,
        completed: allTasksCompleted,
        xpEarned: allTasksCompleted ? project.xp : 0,
        submittedAt: new Date()
      });

      if (allTasksCompleted) {
        setProjectCompleted(true);
        // Award XP (would integrate with user progress system)
      }

      alert(allTasksCompleted ? 
        '🎉 Project completed! You earned ' + project.xp + ' XP!' : 
        'Progress saved successfully!'
      );
    } catch (error) {
      console.error('Error submitting project:', error);
      alert('Error saving project. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-900 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-slate-400">
          No project available for this week.
        </div>
      </div>
    );
  }

  const completionPercentage = (completedTasks.size / project.tasks.length) * 100;

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Code className="w-8 h-8 text-indigo-400" />
                <h1 className="text-3xl font-bold text-white">{project.title}</h1>
              </div>
              <p className="text-lg text-slate-300">{project.description}</p>
            </div>
            {projectCompleted && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-600/20 border border-green-600 rounded-lg">
                <Trophy className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-semibold">Completed!</span>
              </div>
            )}
          </div>

          {/* Project Info */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full">
              <span className="text-slate-400 text-sm">Difficulty:</span>
              <span className={`font-semibold text-sm ${
                project.difficulty === 'beginner' ? 'text-green-400' :
                project.difficulty === 'intermediate' ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {project.difficulty.charAt(0).toUpperCase() + project.difficulty.slice(1)}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300 text-sm">{project.estimatedTime} minutes</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full">
              <Trophy className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-semibold">{project.xp} XP</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-semibold">Progress</span>
            <span className="text-slate-400">{completionPercentage.toFixed(0)}% Complete</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tasks */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4">Project Tasks</h2>
              <div className="space-y-3">
                {project.tasks.map((task, index) => {
                  const isCompleted = completedTasks.has(task.id);
                  
                  return (
                    <div
                      key={task.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isCompleted
                          ? 'border-green-600 bg-green-600/10'
                          : 'border-slate-700 bg-slate-900'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleTask(task.id)}
                          className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            isCompleted
                              ? 'border-green-500 bg-green-600'
                              : 'border-slate-600 hover:border-slate-500'
                          }`}
                        >
                          {isCompleted && <CheckCircle className="w-4 h-4 text-white" />}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <span className={`font-medium ${isCompleted ? 'text-green-400' : 'text-white'}`}>
                              Task {index + 1}
                            </span>
                            {task.validation && (
                              <span className="px-2 py-0.5 bg-indigo-600/20 text-indigo-400 text-xs rounded">
                                {task.validation.type}
                              </span>
                            )}
                          </div>
                          <p className={isCompleted ? 'text-slate-400' : 'text-slate-300'}>
                            {task.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submission Form */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4">Submit Your Work</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Project URL (GitHub, live demo, etc.)
                  </label>
                  <input
                    type="url"
                    value={submissionUrl}
                    onChange={(e) => setSubmissionUrl(e.target.value)}
                    placeholder="https://github.com/yourusername/project"
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    placeholder="Any challenges faced? What did you learn?"
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={submitting || completedTasks.size === 0}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      {projectCompleted ? 'Update Submission' : 'Submit Project'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Deliverables */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Deliverables</h3>
              <ul className="space-y-2">
                {project.deliverables.map((deliverable) => (
                  <li key={deliverable} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                    <span>{deliverable}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Helpful Resources</h3>
              <ul className="space-y-2">
                {project.resources.map((resource) => (
                  <li key={resource} className="flex items-start gap-2 text-sm text-slate-300">
                    <ExternalLink className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                    <span>{resource}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tips */}
            <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
              <div className="flex items-start gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <h3 className="text-blue-400 font-semibold">Tips</h3>
              </div>
              <ul className="text-sm text-slate-300 space-y-1 ml-7">
                <li>• Document your work as you go</li>
                <li>• Test everything before submitting</li>
                <li>• Ask for help if you're stuck</li>
                <li>• Share your project with peers for feedback</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
