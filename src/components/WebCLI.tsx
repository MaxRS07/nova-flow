'use client';

import { useEffect, useState } from 'react';

interface WebCLIProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function WebCLI({ isOpen, onClose }: WebCLIProps) {
    const [input, setInput] = useState('');
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [history, setHistory] = useState<string[]>([]);

    const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && input.trim()) {
            setHistory([...history, `$ ${input}`]);
            setInput('');
            setHistoryIndex(-1);

            // Simulate command execution
            if (input.toLowerCase() === 'clear') {
                setHistory([]);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const commands = history
                .filter(line => line.startsWith('$ '))
                .map(line => line.replace('$ ', ''));

            if (commands.length === 0) return;

            const newIndex = historyIndex + 1;
            if (newIndex < commands.length) {
                setHistoryIndex(newIndex);
                setInput(commands[commands.length - 1 - newIndex]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const commands = history
                .filter(line => line.startsWith('$ '))
                .map(line => line.replace('$ ', ''));

            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setInput(commands[commands.length - 1 - newIndex]);
            } else if (historyIndex === 0) {
                setHistoryIndex(-1);
                setInput('');
            }
        }
    };

    // Close on Escape key
    useEffect(() => {
        const handleKeysDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setHistory([]);
                setHistoryIndex(-1);
            }
        };

        window.addEventListener('keydown', handleKeysDown);
        return () => window.removeEventListener('keydown', handleKeysDown);
    }, [isOpen, onClose]);

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-40"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed right-0 top-0 h-screen w-96 bg-[var(--surface)] shadow-xl transition-transform duration-300 ease-in-out z-50 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                style={{ borderLeft: '1px solid var(--border)' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                    <h2 className="font-mono text-sm font-semibold text-[var(--foreground)]">Web CLI</h2>
                    <button
                        onClick={onClose}
                        className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto px-6 py-4 font-mono text-xs text-[var(--foreground-soft)]">
                    {history.length === 0 ? (
                        <div className="text-[var(--muted)]">
                            <p>Welcome to Web CLI</p>
                            <p className="mt-2 text-[var(--muted-soft)]">Type commands here...</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {history.map((line, i) => (
                                <div key={i}>{line}</div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="px-6 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-2">
                        <span className="text-[var(--muted)]">$</span>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleCommand}
                            placeholder="Enter command..."
                            className="flex-1 bg-transparent text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none font-mono text-xs"
                            autoFocus={isOpen}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
