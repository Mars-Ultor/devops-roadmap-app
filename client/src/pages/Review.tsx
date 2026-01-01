import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Brain, Filter, Sparkles } from 'lucide-react';
import FlashCard, { type FlashCardData } from '../components/FlashCard';
import ReviewSchedulePanel from '../components/training/ReviewSchedulePanel';

export default function Review() {
  const { user } = useAuthStore();
  const [flashCards, setFlashCards] = useState<FlashCardData[]>([]);
  const [filteredCards, setFilteredCards] = useState<FlashCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    async function loadFlashCards() {
      if (!user) return;

      try {
        // Get all completed lessons
        const progressQuery = query(
          collection(db, 'progress'),
          where('userId', '==', user.uid),
          where('type', '==', 'lesson')
        );
        const progressSnapshot = await getDocs(progressQuery);
        
        // Generate flash cards from lessons
        const cards: FlashCardData[] = [];
        const uniqueCategories = new Set<string>();

        // Sample flash cards for completed lessons
        // In production, these would be generated from lesson content or stored in Firestore
        progressSnapshot.docs.forEach((doc, index) => {
          const data = doc.data();
          const lessonId = data.lessonId;
          const category = lessonId.includes('w1') ? 'Linux & DevOps' :
                          lessonId.includes('w2') ? 'Git & GitHub' :
                          lessonId.includes('w3') ? 'AWS Cloud' :
                          lessonId.includes('w4') ? 'Networking' :
                          lessonId.includes('w5') ? 'Python' :
                          lessonId.includes('w6') ? 'Serverless' : 'General';

          uniqueCategories.add(category);

          // Add sample cards based on lesson topic
          if (lessonId === 'w1-l1') {
            cards.push({
              id: `card-${index}-1`,
              lessonId,
              lessonTitle: 'What is DevOps?',
              category,
              question: 'What are the three main pillars of DevOps culture?',
              answer: '1. Collaboration: Breaking down silos between Dev and Ops\n2. Automation: Automating repetitive tasks and deployments\n3. Continuous Improvement: Iterating based on metrics and feedback'
            });
            cards.push({
              id: `card-${index}-2`,
              lessonId,
              lessonTitle: 'What is DevOps?',
              category,
              question: 'What is the primary goal of DevOps?',
              answer: 'To shorten the development lifecycle and deliver features, fixes, and updates frequently while maintaining high quality and reliability.'
            });
          }

          if (lessonId === 'w1-l2') {
            cards.push({
              id: `card-${index}-3`,
              lessonId,
              lessonTitle: 'Linux Basics',
              category,
              question: 'What command shows your current directory?',
              answer: 'pwd (print working directory)\n\nExample:\n$ pwd\n/home/user/projects'
            });
            cards.push({
              id: `card-${index}-4`,
              lessonId,
              lessonTitle: 'Linux Basics',
              category,
              question: 'What does the chmod command do?',
              answer: 'chmod (change mode) modifies file permissions\n\nExample:\nchmod 755 script.sh\n- Owner: read, write, execute (7)\n- Group: read, execute (5)\n- Others: read, execute (5)'
            });
          }

          if (lessonId === 'w2-l1') {
            cards.push({
              id: `card-${index}-5`,
              lessonId,
              lessonTitle: 'Git Fundamentals',
              category,
              question: 'What is the difference between git pull and git fetch?',
              answer: 'git fetch: Downloads changes from remote but doesn\'t merge them\ngit pull: Downloads AND merges changes (fetch + merge)\n\nUse fetch when you want to review changes before merging.'
            });
          }

          if (lessonId === 'w3-l1') {
            cards.push({
              id: `card-${index}-6`,
              lessonId,
              lessonTitle: 'AWS Fundamentals',
              category,
              question: 'What are the 3 main AWS compute services?',
              answer: '1. EC2: Virtual servers (full control, pay per hour)\n2. Lambda: Serverless functions (pay per execution)\n3. ECS/EKS: Container services (Docker/Kubernetes)'
            });
          }
        });

        setFlashCards(cards);
        setFilteredCards(cards);
        setCategories(['all', ...Array.from(uniqueCategories)]);
      } catch (error) {
        console.error('Error loading flash cards:', error);
      } finally {
        setLoading(false);
      }
    }

    loadFlashCards();
  }, [user]);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredCards(flashCards);
    } else {
      setFilteredCards(flashCards.filter(card => card.category === selectedCategory));
    }
  }, [selectedCategory, flashCards]);

  const handleReviewComplete = async (results: { cardId: string; quality: number }[]) => {
    console.log('Review session complete:', results);
    // Update SM-2 algorithm for reviewed lessons
    // Group results by lesson and update progress
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-400">Loading review cards...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">Spaced Repetition Review</h1>
          </div>
          <p className="text-lg text-slate-300">
            Review lessons at optimal intervals using the SM-2 algorithm. Science-backed retention!
          </p>
        </div>

        {/* Review Schedule */}
        <div className="mb-8">
          <ReviewSchedulePanel />
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 my-8"></div>

        {/* Flash Cards Section Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Active Recall Practice</h2>
          </div>
          <p className="text-slate-400">
            Flash cards from completed lessons for additional practice
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg p-4">
            <div className="text-white text-2xl font-bold">{flashCards.length}</div>
            <div className="text-purple-100 text-sm">Total Cards</div>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg p-4">
            <div className="text-white text-2xl font-bold">{categories.length - 1}</div>
            <div className="text-blue-100 text-sm">Categories</div>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg p-4">
            <div className="text-white text-2xl font-bold">{filteredCards.length}</div>
            <div className="text-green-100 text-sm">In Current Session</div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Filter className="w-5 h-5 text-indigo-400" />
            <span className="text-white font-semibold">Filter by Category</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {category === 'all' ? 'All Cards' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Flash Cards */}
        {filteredCards.length > 0 ? (
          <FlashCard cards={filteredCards} onComplete={handleReviewComplete} />
        ) : (
          <div className="bg-slate-800 rounded-lg p-12 border border-slate-700 text-center">
            <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Flash Cards Available</h3>
            <p className="text-slate-400 mb-4">
              Complete lessons to generate flash cards for review practice.
            </p>
            <button
              onClick={() => window.location.href = '/curriculum'}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-500 hover:to-purple-500 transition-all"
            >
              Start Learning
            </button>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 bg-blue-900/20 border border-blue-600/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-400 mb-3">💡 Active Recall Tips</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span><strong>Try to answer before revealing:</strong> Actively recalling strengthens memory</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span><strong>Be honest with ratings:</strong> Accurate self-assessment optimizes review scheduling</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span><strong>Review regularly:</strong> Short daily sessions beat long cramming</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span><strong>Mix topics:</strong> Interleaved practice improves long-term retention</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
