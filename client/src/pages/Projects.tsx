/* eslint-disable max-lines-per-function */
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Trophy, ExternalLink, Github, CheckCircle, Circle, Play } from 'lucide-react';

export default function Projects() {
  const [cloudResumeChallenge, setCloudResumeChallenge] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCloudResumeChallenge() {
      try {
        const docRef = doc(db, 'curriculum', 'cloud-resume-challenge');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setCloudResumeChallenge(docSnap.data());
        }
      } catch (error) {
        console.error('Error fetching Cloud Resume Challenge:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCloudResumeChallenge();
  }, []);

  const otherProjects = [
    {
      id: 1,
      title: 'Linux System Administration',
      description: 'User management, cron jobs, and system monitoring scripts',
      status: 'in-progress',
      week: 1,
      xp: 200,
    },
    {
      id: 2,
      title: 'Git Workflow Automation',
      description: 'Automated git hooks and branching strategy implementation',
      status: 'not-started',
      week: 2,
      xp: 150,
    },
    {
      id: 3,
      title: 'Dockerized Microservices',
      description: 'Multi-container application with Docker Compose',
      status: 'not-started',
      week: 4,
      xp: 400,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading projects...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Portfolio Projects 💼</h1>
          <p className="text-xl text-gray-300">Build real-world projects that demonstrate your DevOps expertise to employers</p>
        </div>

        {/* Cloud Resume Challenge - Featured */}
        {cloudResumeChallenge && (
          <div className="mb-12 bg-gradient-to-br from-indigo-900/50 via-purple-900/50 to-pink-900/50 rounded-2xl p-8 border-2 border-indigo-500/50 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 opacity-5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400 opacity-5 rounded-full -ml-24 -mb-24"></div>
            
            <div className="relative">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-yellow-400 rounded-xl p-4 shadow-lg">
                    <Trophy className="w-10 h-10 text-indigo-900" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">{cloudResumeChallenge.title}</h2>
                    <p className="text-indigo-300 font-medium">⭐ Capstone Project • Weeks 7-9</p>
                  </div>
                </div>
                <div className="text-right bg-indigo-900/50 px-6 py-4 rounded-xl border border-indigo-500">
                  <div className="text-4xl font-bold text-yellow-400">{cloudResumeChallenge.totalXP}</div>
                  <div className="text-sm text-indigo-200 font-medium">Total XP</div>
                </div>
              </div>

              <p className="text-gray-200 text-lg mb-8 leading-relaxed">{cloudResumeChallenge.description}</p>

              {/* Phases */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {cloudResumeChallenge.phases?.map((phase: unknown) => (
                  <div key={`phase-${(phase as { phase: number }).phase}`} className="bg-slate-800/80 rounded-xl p-6 border border-slate-600 hover:border-indigo-400 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="bg-indigo-600 text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold">
                            {(phase as { phase: number }).phase}
                          </div>
                          <span className="text-xs text-gray-400 font-medium">Week {(phase as { week: number }).week}</span>
                        </div>
                        <h4 className="text-lg font-bold text-white">{(phase as { title: string }).title}</h4>
                      </div>
                      <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {(phase as { xp: number }).xp} XP
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {(phase as { tasks: string[] }).tasks.slice(0, 3).map((task: string) => (
                        <div key={task} className="text-sm text-gray-300 flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{task}</span>
                        </div>
                      ))}
                      {phase.tasks.length > 3 && (
                        <div className="text-sm text-indigo-300 italic font-medium">
                          +{phase.tasks.length - 3} more tasks...
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div className="mb-8">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                    🎯
                  </span>
                  Skills You'll Master
                </h4>
                <div className="flex flex-wrap gap-3">
                  {cloudResumeChallenge.skills?.map((skill: string) => (
                    <span key={skill} className="bg-gradient-to-r from-indigo-600/40 to-purple-600/40 text-indigo-200 px-4 py-2 rounded-lg text-sm border border-indigo-500/50 font-medium hover:border-indigo-400 transition">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div className="mb-8">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                  <span className="bg-gradient-to-r from-green-600 to-teal-600 text-white w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                    📚
                  </span>
                  Resources
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {cloudResumeChallenge.resources?.map((resource: unknown) => (
                    <a 
                      key={(resource as { title: string }).title}
                      href={(resource as { url: string }).url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-sm text-indigo-300 hover:text-white transition bg-slate-800/50 p-4 rounded-lg border border-slate-600 hover:border-indigo-400"
                    >
                      <ExternalLink className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium">{(resource as { title: string }).title}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                  <Play className="w-5 h-5" />
                  <span>Start Challenge</span>
                </button>
                <a 
                  href="https://github.com/topics/cloud-resume-challenge" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-slate-700 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-600 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <Github className="w-5 h-5" />
                  <span>View Examples</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Other Projects */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="bg-gradient-to-r from-green-600 to-teal-600 text-white w-10 h-10 rounded-lg flex items-center justify-center mr-3">
              🚀
            </span>
            Practice Projects
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherProjects.map((project) => (
              <div key={project.id} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 hover:border-green-500 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10 hover:scale-105">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400 font-medium bg-slate-700 px-2 py-1 rounded">Week {project.week}</span>
                      {project.status === 'in-progress' ? (
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-yellow-400 font-medium">In Progress</span>
                        </div>
                      ) : (
                        <Circle className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">{project.title}</h4>
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm mb-6 leading-relaxed">{project.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {project.xp} XP
                  </span>
                  <button className="text-sm text-green-400 hover:text-green-300 transition font-medium">
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Export Section */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-600 shadow-xl">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white w-12 h-12 rounded-xl flex items-center justify-center text-2xl">
                  💼
                </div>
                <h3 className="text-2xl font-bold text-white">Export Your Portfolio</h3>
              </div>
              <p className="text-gray-300 mb-6 text-lg">
                Generate resume bullets, LinkedIn summary, and portfolio website content from your completed projects.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">ATS-optimized resume bullets tailored to DevOps roles</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">LinkedIn profile sections highlighting your projects</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Portfolio website generator with deployment guide</span>
                </li>
              </ul>
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:scale-105">
                Export Portfolio (Coming Soon)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

