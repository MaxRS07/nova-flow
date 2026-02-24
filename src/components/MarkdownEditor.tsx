'use client';

import { useState, useRef } from 'react';

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
    className?: string;
}

export default function MarkdownEditor({
    value,
    onChange,
    placeholder = "Add content...",
    rows = 8,
    className = ''
}: MarkdownEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const insertMarkdown = (before: string, after: string = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);
        const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);

        onChange(newText);

        // Restore cursor position
        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + before.length + selectedText.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    const inputClass = 'w-full px-4 py-3 text-sm font-mono rounded-lg bg-[var(--muted-bg)] text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 transition-all';

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const textarea = e.currentTarget;

        // Handle Tab key - insert actual tab character
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newText = value.substring(0, start) + '\t' + value.substring(end);
            onChange(newText);

            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + 1, start + 1);
            }, 0);
        }

        // Handle Enter key - continue bullet list
        if (e.key === 'Enter') {
            const start = textarea.selectionStart;
            const lineStart = value.lastIndexOf('\n', start - 1) + 1;
            const lineText = value.substring(lineStart, start);

            // Check if current line is a bullet point
            const bulletMatch = lineText.match(/^(\s*)-\s/);
            if (bulletMatch) {
                e.preventDefault();
                const indent = bulletMatch[1];
                const newText = value.substring(0, start) + '\n' + indent + '- ' + value.substring(start);
                onChange(newText);

                setTimeout(() => {
                    textarea.focus();
                    const newCursorPos = start + indent.length + 3; // \n + indent + "- "
                    textarea.setSelectionRange(newCursorPos, newCursorPos);
                }, 0);
            }
        }
    };

    return (
        <div>
            <div className="flex gap-2 mb-3 flex-wrap">
                <button
                    type="button"
                    onClick={() => insertMarkdown('**', '**')}
                    className="px-3 py-1.5 text-xs font-mono bg-[var(--muted-bg)] text-[var(--foreground-soft)] hover:bg-[var(--border)] rounded transition-colors"
                    title="Bold"
                >
                    <strong>B</strong>
                </button>
                <button
                    type="button"
                    onClick={() => insertMarkdown('*', '*')}
                    className="px-3 py-1.5 text-xs font-mono bg-[var(--muted-bg)] text-[var(--foreground-soft)] hover:bg-[var(--border)] rounded transition-colors italic"
                    title="Italic"
                >
                    I
                </button>
                <button
                    type="button"
                    onClick={() => insertMarkdown('`', '`')}
                    className="px-3 py-1.5 text-xs font-mono bg-[var(--muted-bg)] text-[var(--foreground-soft)] hover:bg-[var(--border)] rounded transition-colors"
                    title="Code"
                >
                    {'<>'}
                </button>
                <div className="w-px bg-[var(--border)]" />
                <button
                    type="button"
                    onClick={() => insertMarkdown('# ', '')}
                    className="px-3 py-1.5 text-xs font-mono bg-[var(--muted-bg)] text-[var(--foreground-soft)] hover:bg-[var(--border)] rounded transition-colors"
                    title="Heading 1"
                >
                    H1
                </button>
                <button
                    type="button"
                    onClick={() => insertMarkdown('## ', '')}
                    className="px-3 py-1.5 text-xs font-mono bg-[var(--muted-bg)] text-[var(--foreground-soft)] hover:bg-[var(--border)] rounded transition-colors"
                    title="Heading 2"
                >
                    H2
                </button>
                <div className="w-px bg-[var(--border)]" />
                <button
                    type="button"
                    onClick={() => insertMarkdown('- ', '')}
                    className="px-3 py-1.5 text-xs font-mono bg-[var(--muted-bg)] text-[var(--foreground-soft)] hover:bg-[var(--border)] rounded transition-colors"
                    title="List"
                >
                    • List
                </button>
                <button
                    type="button"
                    onClick={() => insertMarkdown('> ', '')}
                    className="px-3 py-1.5 text-xs font-mono bg-[var(--muted-bg)] text-[var(--foreground-soft)] hover:bg-[var(--border)] rounded transition-colors"
                    title="Quote"
                >
                    " Quote
                </button>
                <button
                    type="button"
                    onClick={() => insertMarkdown('[', '](url)')}
                    className="px-3 py-1.5 text-xs font-mono bg-[var(--muted-bg)] text-[var(--foreground-soft)] hover:bg-[var(--border)] rounded transition-colors"
                    title="Link"
                >
                    🔗 Link
                </button>
            </div>
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                rows={rows}
                className={`${inputClass} resize-none leading-relaxed ${className}`}
            />
        </div>
    );
}
