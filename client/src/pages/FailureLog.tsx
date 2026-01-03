import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import { AlertCircle, Search, FileDown, Trash2, Plus, BookOpen, TrendingUp, Clock } from 'lucide-react';
import { PersonalRunbook } from '../components/runbook/PersonalRunbook';

interface FailureEntry {
  id: string;
  entryNumber: number;
  task: string;
  whatBroke: string;
  whatTried: string[];
  rootCause: string;
  solution: string;
  timeWasted: number; // minutes
  keyLesson: string;
  prevention: string;
  quickCheck: string;
  category: string;
  createdAt: Date;
}

interface Pattern {
  category: string;
  count: number;
  commonSolutions: string[];
}

export default function FailureLog() {
  const { user } = useAuthStore();
  const [entries, setEntries] = useState<FailureEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [activeTab, setActiveTab] = useState<'log' | 'runbook'>('log');

  // Form state
  const [formData, setFormData] = useState({
    task: '',
    whatBroke: '',
    whatTried: ['', '', ''],
    rootCause: '',
    solution: '',
    timeWasted: 0,
    keyLesson: '',
    prevention: '',
    quickCheck: '',
    category: 'docker'
  });

  const categories = ['docker', 'kubernetes', 'cicd', 'networking', 'security', 'deployment', 'other'];

  const loadEntries = useCallback(async () => {
    if (!user) return;

    try {
      const entriesQuery = query(
        collection(db, 'failureLog'),
        where('userId', '==', user.uid)
      );
      const snapshot = await getDocs(entriesQuery);

      const loadedEntries: FailureEntry[] = [];
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        loadedEntries.push({
          id: doc.id,
          entryNumber: data.entryNumber,
          task: data.task,
          whatBroke: data.whatBroke,
          whatTried: data.whatTried || [],
          rootCause: data.rootCause,
          solution: data.solution,
          timeWasted: data.timeWasted,
          keyLesson: data.keyLesson,
          prevention: data.prevention,
          quickCheck: data.quickCheck,
          category: data.category,
          createdAt: data.createdAt?.toDate() || new Date()
        });
      });

      loadedEntries.sort((a, b) => b.entryNumber - a.entryNumber);
      setEntries(loadedEntries);
    } catch (error) {
      console.error('Error loading failure log:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const analyzePatterns = useCallback(() => {
    const categoryMap = new Map<string, { count: number; solutions: Set<string> }>();

    entries.forEach(entry => {
      const existing = categoryMap.get(entry.category) || { count: 0, solutions: new Set() };
      existing.count++;
      existing.solutions.add(entry.solution);
      categoryMap.set(entry.category, existing);
    });

    const detectedPatterns: Pattern[] = [];
    categoryMap.forEach((value, category) => {
      if (value.count >= 3) { // Pattern detected if 3+ failures in same category
        detectedPatterns.push({
          category,
          count: value.count,
          commonSolutions: Array.from(value.solutions).slice(0, 3)
        });
      }
    });

    detectedPatterns.sort((a, b) => b.count - a.count);
    setPatterns(detectedPatterns);
  }, [entries]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  useEffect(() => {
    if (entries.length > 0) {
      analyzePatterns();
    }
  }, [entries, analyzePatterns]);

  const addEntry = async () => {
    if (!user) return;

    // Validation
    if (!formData.task || !formData.whatBroke || !formData.rootCause || !formData.solution || !formData.keyLesson) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.whatTried.filter(t => t.trim()).length < 3) {
      alert('Please list at least 3 things you tried');
      return;
    }

    try {
      const nextEntryNumber = entries.length > 0 ? Math.max(...entries.map(e => e.entryNumber)) + 1 : 1;

      const newEntry = {
        userId: user.uid,
        entryNumber: nextEntryNumber,
        ...formData,
        whatTried: formData.whatTried.filter(t => t.trim()),
        createdAt: Timestamp.now()
      };

      await addDoc(collection(db, 'failureLog'), newEntry);

      // Reset form
      setFormData({
        task: '',
        whatBroke: '',
        whatTried: ['', '', ''],
        rootCause: '',
        solution: '',
        timeWasted: 0,
        keyLesson: '',
        prevention: '',
        quickCheck: '',
        category: 'docker'
      });

      setShowAddForm(false);
      loadEntries();
    } catch (error) {
      console.error('Error adding entry:', error);
    }
  };

  const deleteEntry = async (id: string) => {
    if (!confirm('Delete this failure log entry?')) return;

    try {
      await deleteDoc(doc(db, 'failureLog', id));
      setEntries(entries.filter(e => e.id !== id));
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const exportRunbook = () => {
    const markdown = `# Personal DevOps Runbook\n\nGenerated: ${new Date().toLocaleDateString()}\n\n---\n\n` +
      categories.map(cat => {
        const catEntries = entries.filter(e => e.category === cat);
        if (catEntries.length === 0) return '';

        return `## ${cat.toUpperCase()}\n\n` +
          catEntries.map(entry => 
            `### Entry #${entry.entryNumber}: ${entry.task}\n\n` +
            `**Problem:** ${entry.whatBroke}\n\n` +
            `**Root Cause:** ${entry.rootCause}\n\n` +
            `**Solution:** ${entry.solution}\n\n` +
            `**Quick Check:** \`${entry.quickCheck}\`\n\n` +
            `**Prevention:** ${entry.prevention}\n\n---\n\n`
          ).join('');
      }).join('\n');

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'devops-runbook.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.whatBroke.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.solution.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || entry.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalTimeWasted = entries.reduce((sum, e) => sum + e.timeWasted, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading failure log...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center">
            <AlertCircle className="w-8 h-8 mr-3 text-red-400" />
            Failure Log & Personal Runbook
          </h1>
          <p className="text-slate-400 mt-2">
            Document every mistake. Build your personal troubleshooting runbook.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('log')}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'log'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Failure Log ({entries.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('runbook')}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'runbook'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Personal Runbook
            </div>
          </button>
        </div>

        {/* Runbook Tab */}
        {activeTab === 'runbook' && <PersonalRunbook entries={entries} />}

        {/* Failure Log Tab */}
        {activeTab === 'log' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
                <div className="text-sm text-slate-400 mb-1">Total Failures</div>
                <div className="text-3xl font-bold text-white">{entries.length}</div>
              </div>
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
                <div className="text-sm text-slate-400 mb-1">Time Wasted</div>
                <div className="text-3xl font-bold text-orange-400">{Math.round(totalTimeWasted / 60)}h</div>
              </div>
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
                <div className="text-sm text-slate-400 mb-1">Patterns Found</div>
                <div className="text-3xl font-bold text-yellow-400">{patterns.length}</div>
              </div>
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
                <div className="text-sm text-slate-400 mb-1">Categories</div>
                <div className="text-3xl font-bold text-blue-400">{new Set(entries.map(e => e.category)).size}</div>
              </div>
            </div>

            {/* Pattern Alerts */}
            {patterns.length > 0 && (
              <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4 mb-8">
                <h2 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Detected Patterns
                </h2>
                <div className="space-y-2">
                  {patterns.map(pattern => (
                    <div key={pattern.category} className="text-slate-300">
                      <strong className="text-yellow-400">{pattern.category.toUpperCase()}:</strong> {pattern.count} failures detected.
                      Common solution: {pattern.commonSolutions[0]}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search failures..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={exportRunbook}
                  className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  Export Runbook
                </button>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Entry
                </button>
              </div>
            </div>

            {/* Add Entry Form */}
            {showAddForm && (
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-6">
                <h2 className="text-xl font-semibold text-white mb-4">New Failure Entry</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Task/Lab</label>
                    <input
                      type="text"
                      value={formData.task}
                      onChange={(e) => setFormData({...formData, task: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      placeholder="e.g., Deploy Docker container to production"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">What Broke</label>
                    <textarea
                      value={formData.whatBroke}
                      onChange={(e) => setFormData({...formData, whatBroke: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      rows={3}
                      placeholder="Specific error or problem"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">What I Tried (minimum 3)</label>
                    {[0, 1, 2].map(idx => (
                      <input
                        key={idx}
                        type="text"
                        value={formData.whatTried[idx]}
                        onChange={(e) => {
                          const newTried = [...formData.whatTried];
                          newTried[idx] = e.target.value;
                          setFormData({...formData, whatTried: newTried});
                        }}
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white mb-2"
                        placeholder={`Attempt ${idx + 1}`}
                      />
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Root Cause</label>
                    <textarea
                      value={formData.rootCause}
                      onChange={(e) => setFormData({...formData, rootCause: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      rows={2}
                      placeholder="Actual reason for failure"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Solution</label>
                    <textarea
                      value={formData.solution}
                      onChange={(e) => setFormData({...formData, solution: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      rows={2}
                      placeholder="What finally worked"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Time Wasted (minutes)</label>
                      <input
                        type="number"
                        value={formData.timeWasted}
                        onChange={(e) => setFormData({...formData, timeWasted: parseInt(e.target.value) || 0})}
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Key Lesson</label>
                    <textarea
                      value={formData.keyLesson}
                      onChange={(e) => setFormData({...formData, keyLesson: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      rows={2}
                      placeholder="What to remember for next time"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Prevention Strategy</label>
                    <textarea
                      value={formData.prevention}
                      onChange={(e) => setFormData({...formData, prevention: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      rows={2}
                      placeholder="How to avoid in future"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Quick Check Command</label>
                    <input
                      type="text"
                      value={formData.quickCheck}
                      onChange={(e) => setFormData({...formData, quickCheck: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white font-mono"
                      placeholder="e.g., docker ps -a | grep myapp"
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={addEntry}
                      className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                    >
                      Save Entry
                    </button>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Entries List */}
            <div className="space-y-4">
              {filteredEntries.length === 0 ? (
                <div className="bg-slate-800 rounded-lg border border-slate-700 p-12 text-center">
                  <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-400 mb-2">No failures logged yet</h3>
                  <p className="text-slate-500">Start documenting your mistakes to build your personal runbook</p>
                </div>
              ) : (
                filteredEntries.map(entry => (
                  <div key={entry.id} className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-2xl font-bold text-red-400">#{entry.entryNumber}</span>
                          <span className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300 uppercase">
                            {entry.category}
                          </span>
                          <div className="flex items-center text-sm text-slate-400">
                            <Clock className="w-4 h-4 mr-1" />
                            {entry.timeWasted} min wasted
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">{entry.task}</h3>
                      </div>
                      <button
                        onClick={() => deleteEntry(entry.id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-semibold text-red-400">Problem:</span>
                        <p className="text-slate-300 mt-1">{entry.whatBroke}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-orange-400">Root Cause:</span>
                        <p className="text-slate-300 mt-1">{entry.rootCause}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-green-400">Solution:</span>
                        <p className="text-slate-300 mt-1">{entry.solution}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-blue-400">Key Lesson:</span>
                        <p className="text-slate-300 mt-1">{entry.keyLesson}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-purple-400">Prevention:</span>
                        <p className="text-slate-300 mt-1">{entry.prevention}</p>
                      </div>
                      {entry.quickCheck && (
                        <div>
                          <span className="font-semibold text-cyan-400">Quick Check:</span>
                          <code className="block bg-slate-900 px-3 py-2 rounded mt-1 text-slate-300">
                            {entry.quickCheck}
                          </code>
                        </div>
                      )}
                      <div className="text-xs text-slate-500 mt-2">
                        Logged: {entry.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
