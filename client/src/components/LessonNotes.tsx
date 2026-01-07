/**
 * Lesson Notes Component
 * User note-taking for lessons with tags and markdown support
 */

import { useState, useEffect, useCallback } from 'react';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import { NotesHeader, TagsSection, MarkdownPreview, NotesEditor, NotesFooter } from './lesson-notes/LessonNotesComponents';

interface LessonNotesProps {
  lessonId: string;
  lessonTitle: string;
}

export default function LessonNotes({ lessonId, lessonTitle }: LessonNotesProps) {
  const { user } = useAuthStore();
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveTimer, setAutoSaveTimer] = useState<number | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const saveNotes = useCallback(async () => {
    if (!user) return;
    try {
      setSaving(true);
      await setDoc(doc(db, 'notes', `${user.uid}_${lessonId}`), {
        userId: user.uid, lessonId, lessonTitle, content: notes, tags, lastUpdated: serverTimestamp()
      });
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving notes:', error);
    } finally {
      setSaving(false);
    }
  }, [user, lessonId, lessonTitle, notes, tags]);

  useEffect(() => {
    async function loadNotes() {
      if (!user) return;
      try {
        const noteDoc = await getDoc(doc(db, 'notes', `${user.uid}_${lessonId}`));
        if (noteDoc.exists()) {
          const data = noteDoc.data();
          setNotes(data.content || '');
          setTags(data.tags || []);
          setLastSaved(data.lastUpdated?.toDate() || null);
        }
      } catch (error) {
        console.error('Error loading notes:', error);
      }
    }
    loadNotes();
  }, [user, lessonId]);

  useEffect(() => {
    if (autoSaveTimer) clearTimeout(autoSaveTimer);
    if (notes.trim() || tags.length > 0) {
      const timer = setTimeout(() => saveNotes(), 2000);
      setAutoSaveTimer(timer);
    }
    return () => { if (autoSaveTimer) clearTimeout(autoSaveTimer); };
  }, [notes, tags, autoSaveTimer, saveNotes]);

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const exportToMarkdown = () => {
    const markdown = `# ${lessonTitle}\n\n${notes}\n\n---\n**Tags:** ${tags.join(', ')}\n**Last Updated:** ${lastSaved?.toLocaleString()}`;
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lessonId}-notes.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <NotesHeader saving={saving} lastSaved={lastSaved} previewMode={previewMode}
        onTogglePreview={() => setPreviewMode(!previewMode)} onSave={saveNotes} onExport={exportToMarkdown} />
      <TagsSection tags={tags} tagInput={tagInput} onTagInputChange={setTagInput}
        onAddTag={addTag} onRemoveTag={(t) => setTags(tags.filter(tag => tag !== t))} />
      {previewMode ? <MarkdownPreview content={notes} /> : <NotesEditor notes={notes} onChange={setNotes} />}
      <NotesFooter />
    </div>
  );
}
