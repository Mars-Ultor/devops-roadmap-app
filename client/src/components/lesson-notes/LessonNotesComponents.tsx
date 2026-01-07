/**
 * Lesson Notes Sub-Components
 * Extracted from LessonNotes.tsx for ESLint compliance
 */

import React from 'react';
import { FileDown, Save, Tag, Eye, Edit3 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Notes Header Component
interface NotesHeaderProps {
  saving: boolean;
  lastSaved: Date | null;
  previewMode: boolean;
  onTogglePreview: () => void;
  onSave: () => void;
  onExport: () => void;
}

export function NotesHeader({ saving, lastSaved, previewMode, onTogglePreview, onSave, onExport }: NotesHeaderProps) {
  const previewBtnClass = previewMode 
    ? 'bg-purple-600 hover:bg-purple-500' 
    : 'bg-slate-700 hover:bg-slate-600';
  
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <h3 className="text-lg font-semibold text-white">📝 My Notes</h3>
        {saving && <span className="text-xs text-yellow-400">Saving...</span>}
        {!saving && lastSaved && (
          <span className="text-xs text-green-400">Saved {lastSaved.toLocaleTimeString()}</span>
        )}
      </div>
      <div className="flex gap-2">
        <button onClick={onTogglePreview}
          className={`flex items-center gap-2 px-3 py-1.5 text-white text-sm rounded transition ${previewBtnClass}`}>
          {previewMode ? <><Edit3 className="w-4 h-4" />Edit</> : <><Eye className="w-4 h-4" />Preview</>}
        </button>
        <button onClick={onSave} disabled={saving}
          className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded transition disabled:opacity-50">
          <Save className="w-4 h-4" />Save
        </button>
        <button onClick={onExport}
          className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-sm rounded transition">
          <FileDown className="w-4 h-4" />Export MD
        </button>
      </div>
    </div>
  );
}

// Tags Section Component
interface TagsSectionProps {
  tags: string[];
  tagInput: string;
  onTagInputChange: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
}

export function TagsSection({ tags, tagInput, onTagInputChange, onAddTag, onRemoveTag }: TagsSectionProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <Tag className="w-4 h-4 text-purple-400" />
        <span className="text-sm text-slate-300">Tags</span>
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map(tag => (
          <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full border border-purple-500/30">
            {tag}
            <button onClick={() => onRemoveTag(tag)} className="hover:text-purple-100">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input type="text" value={tagInput} onChange={(e) => onTagInputChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onAddTag()}
          placeholder="Add a tag (e.g., important, review, docker)"
          className="flex-1 px-3 py-1.5 bg-slate-900 text-white text-sm rounded border border-slate-600 focus:border-purple-500 focus:outline-none" />
        <button onClick={onAddTag}
          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded transition">Add</button>
      </div>
    </div>
  );
}

// Markdown Preview Component
interface MarkdownPreviewProps {
  content: string;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <div className="min-h-[12rem] max-h-[32rem] overflow-y-auto px-4 py-3 bg-slate-900 text-white rounded border border-slate-600">
      <ReactMarkdown
        components={{
          h1: (props) => <h1 className="text-3xl font-bold text-white mb-4 mt-6 first:mt-0" {...props} />,
          h2: (props) => <h2 className="text-2xl font-bold text-white mb-3 mt-5" {...props} />,
          h3: (props) => <h3 className="text-xl font-semibold text-white mb-2 mt-4" {...props} />,
          h4: (props) => <h4 className="text-lg font-semibold text-white mb-2 mt-3" {...props} />,
          h5: (props) => <h5 className="text-base font-semibold text-white mb-1 mt-2" {...props} />,
          h6: (props) => <h6 className="text-sm font-semibold text-white mb-1 mt-2" {...props} />,
          p: (props) => <p className="text-slate-300 leading-relaxed my-3" {...props} />,
          strong: (props) => <strong className="text-white font-semibold" {...props} />,
          em: (props) => <em className="text-slate-300 italic" {...props} />,
          code: ({ className, children, ...props }: React.HTMLAttributes<HTMLElement> & { className?: string; children?: React.ReactNode }) => {
            const isInline = !className || !className.includes('language-');
            return isInline 
              ? <code className="text-indigo-300 bg-slate-800 px-2 py-1 rounded text-sm font-mono" {...props}>{children}</code>
              : <code className="block text-indigo-300 bg-slate-800 p-4 rounded text-sm font-mono overflow-x-auto my-4" {...props}>{children}</code>;
          },
          ul: (props) => <ul className="my-3 list-disc pl-6 space-y-1" {...props} />,
          ol: (props) => <ol className="my-3 list-decimal pl-6 space-y-1" {...props} />,
          li: (props) => <li className="text-slate-300" {...props} />,
          a: (props) => <a className="text-indigo-400 underline hover:text-indigo-300" {...props} />,
          blockquote: (props) => <blockquote className="border-l-4 border-indigo-500 pl-4 italic text-slate-400 my-4" {...props} />,
          hr: (props) => <hr className="border-slate-700 my-6" {...props} />,
        }}
      >
        {content || '*No content to preview. Switch to Edit mode to write notes.*'}
      </ReactMarkdown>
    </div>
  );
}

// Notes Editor Component
interface NotesEditorProps {
  notes: string;
  onChange: (value: string) => void;
}

export function NotesEditor({ notes, onChange }: NotesEditorProps) {
  return (
    <textarea value={notes} onChange={(e) => onChange(e.target.value)}
      placeholder="Write your learnings, questions, or insights here...&#10;&#10;💡 Tip: Document 'aha moments' and key takeaways to boost retention!"
      className="w-full h-48 px-4 py-3 bg-slate-900 text-white rounded border border-slate-600 focus:border-indigo-500 focus:outline-none resize-y font-mono text-sm" />
  );
}

// Footer Component
export function NotesFooter() {
  return (
    <div className="mt-3 text-xs text-slate-400">
      💾 Auto-saves every 2 seconds | 📝 Use Markdown syntax for formatting | 👁️ Toggle preview to see rendered markdown | 📥 Export to share or blog
    </div>
  );
}
