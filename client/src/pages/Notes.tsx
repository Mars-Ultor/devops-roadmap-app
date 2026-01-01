import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, Tag, Search, FileDown, Trash2 } from 'lucide-react';
import { doc, deleteDoc } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';

interface Note {
  id: string;
  lessonId: string;
  lessonTitle: string;
  content: string;
  tags: string[];
  lastUpdated: Date;
}

export default function Notes() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    loadNotes();
  }, [user]);

  const loadNotes = async () => {
    if (!user) return;

    try {
      const notesQuery = query(
        collection(db, 'notes'),
        where('userId', '==', user.uid)
      );
      const snapshot = await getDocs(notesQuery);

      const loadedNotes: Note[] = [];
      const tagsSet = new Set<string>();

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        loadedNotes.push({
          id: doc.id,
          lessonId: data.lessonId,
          lessonTitle: data.lessonTitle,
          content: data.content || '',
          tags: data.tags || [],
          lastUpdated: data.lastUpdated?.toDate() || new Date()
        });

        // Collect all unique tags
        (data.tags || []).forEach((tag: string) => tagsSet.add(tag));
      });

      // Sort by last updated (most recent first)
      loadedNotes.sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());

      setNotes(loadedNotes);
      setAllTags(Array.from(tagsSet).sort());
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      await deleteDoc(doc(db, 'notes', noteId));
      setNotes(notes.filter(n => n.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const exportNote = (note: Note) => {
    const markdown = `# ${note.lessonTitle}\n\n${note.content}\n\n---\n**Tags:** ${note.tags.join(', ')}\n**Last Updated:** ${note.lastUpdated.toLocaleString()}`;
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.lessonId}-notes.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAllNotes = () => {
    const markdown = filteredNotes.map(note => 
      `# ${note.lessonTitle}\n\n${note.content}\n\n**Tags:** ${note.tags.join(', ')}\n**Last Updated:** ${note.lastUpdated.toLocaleString()}\n\n---\n\n`
    ).join('\n');

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all-notes-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = !searchTerm || 
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.lessonTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = !selectedTag || note.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-slate-400">Loading notes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">📚 My Notes Library</h1>
              <p className="text-slate-400">
                All your lesson notes in one place. {notes.length} total notes.
              </p>
            </div>
            {filteredNotes.length > 0 && (
              <button
                onClick={exportAllNotes}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition"
              >
                <FileDown className="w-4 h-4" />
                Export All
              </button>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search notes by content or lesson title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-slate-400">Filter by tag:</span>
              <button
                onClick={() => setSelectedTag('')}
                className={`px-3 py-1 text-sm rounded-full transition ${
                  selectedTag === '' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                All
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 text-sm rounded-full transition ${
                    selectedTag === tag 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notes Grid */}
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-400 mb-2">
              {searchTerm || selectedTag ? 'No notes found' : 'No notes yet'}
            </h3>
            <p className="text-slate-500 mb-6">
              {searchTerm || selectedTag 
                ? 'Try adjusting your search or filters' 
                : 'Start taking notes on lessons to see them here'}
            </p>
            {!searchTerm && !selectedTag && (
              <button
                onClick={() => navigate('/curriculum')}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition"
              >
                Browse Curriculum
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map(note => (
              <div
                key={note.id}
                className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-indigo-500 transition"
              >
                {/* Note Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">
                      {note.lessonTitle}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Calendar className="w-3 h-3" />
                      {note.lastUpdated.toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Note Content Preview */}
                <div className="mb-4 max-h-24 overflow-hidden relative">
                  <ReactMarkdown
                    components={{
                      h1: (props) => <h1 className="text-lg font-bold text-white my-1" {...props} />,
                      h2: (props) => <h2 className="text-base font-bold text-white my-1" {...props} />,
                      h3: (props) => <h3 className="text-sm font-semibold text-white my-0.5" {...props} />,
                      h4: (props) => <h4 className="text-sm font-semibold text-white my-0.5" {...props} />,
                      p: (props) => <p className="text-slate-300 text-sm leading-relaxed my-0.5" {...props} />,
                      strong: (props) => <strong className="text-white font-semibold" {...props} />,
                      em: (props) => <em className="text-slate-300 italic" {...props} />,
                      code: (props: React.HTMLAttributes<HTMLElement>) => <code className="text-indigo-300 bg-slate-900 px-1 py-0.5 rounded text-xs font-mono" {...props} />,
                      ul: (props) => <ul className="my-0.5 pl-4 list-disc" {...props} />,
                      ol: (props) => <ol className="my-0.5 pl-4 list-decimal" {...props} />,
                      li: (props) => <li className="text-slate-300 text-sm" {...props} />,
                      a: (props) => <a className="text-indigo-400" {...props} />,
                      blockquote: (props) => <blockquote className="text-slate-400 border-l-2 border-indigo-500 pl-2" {...props} />,
                    }}
                  >
                    {note.content || 'No content'}
                  </ReactMarkdown>
                  <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-slate-800 to-transparent pointer-events-none"></div>
                </div>

                {/* Tags */}
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {note.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-purple-600/20 text-purple-300 text-xs rounded-full border border-purple-500/30"
                      >
                        {tag}
                      </span>
                    ))}
                    {note.tags.length > 3 && (
                      <span className="px-2 py-0.5 text-purple-400 text-xs">
                        +{note.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-slate-700">
                  <button
                    onClick={() => navigate(`/lesson/${note.lessonId}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded transition"
                  >
                    <BookOpen className="w-4 h-4" />
                    Open Lesson
                  </button>
                  <button
                    onClick={() => exportNote(note)}
                    className="px-3 py-2 bg-green-600 hover:bg-green-500 text-white rounded transition"
                    title="Export to Markdown"
                  >
                    <FileDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded transition"
                    title="Delete note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Footer */}
        {filteredNotes.length > 0 && (
          <div className="mt-8 text-center text-sm text-slate-400">
            Showing {filteredNotes.length} of {notes.length} notes
            {selectedTag && ` with tag "${selectedTag}"`}
            {searchTerm && ` matching "${searchTerm}"`}
          </div>
        )}
      </div>
    </div>
  );
}
