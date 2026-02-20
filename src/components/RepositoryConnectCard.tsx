'use client';

import { useState, useMemo } from 'react';

interface Repository {
    id: number;
    name: string;
    url: string;
    visibility: 'public' | 'private';
    description?: string;
    language?: string;
    stars: number;
}

interface RepositoryConnectCardProps {
    isOpen: boolean;
    onClose: () => void;
    onConnect?: (repo: Repository) => void;
}

export default function RepositoryConnectCard({ isOpen, onClose, onConnect }: RepositoryConnectCardProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [visibility, setVisibility] = useState<'all' | 'public' | 'private'>('all');

    const mockRepositories: Repository[] = [
        { id: 1, name: 'web-app', url: 'github.com/example/web-app', visibility: 'public', description: 'Main web application', language: 'TypeScript', stars: 245 },
        { id: 2, name: 'api-service', url: 'github.com/example/api-service', visibility: 'private', description: 'Backend API service', language: 'Python', stars: 89 },
        { id: 3, name: 'mobile-app', url: 'github.com/example/mobile-app', visibility: 'public', description: 'React Native mobile app', language: 'JavaScript', stars: 156 },
        { id: 4, name: 'dashboard', url: 'github.com/example/dashboard', visibility: 'private', description: 'Admin dashboard', language: 'React', stars: 42 },
        { id: 5, name: 'core-lib', url: 'github.com/example/core-lib', visibility: 'public', description: 'Shared utilities library', language: 'TypeScript', stars: 512 },
        { id: 6, name: 'cli-tools', url: 'github.com/example/cli-tools', visibility: 'public', description: 'Command line tools', language: 'Go', stars: 178 },
        { id: 7, name: 'documentation', url: 'github.com/example/documentation', visibility: 'public', description: 'Project documentation', language: 'Markdown', stars: 98 },
        { id: 8, name: 'internal-configs', url: 'github.com/example/internal-configs', visibility: 'private', description: 'Internal configurations', language: 'YAML', stars: 5 },
    ];

    const filteredRepositories = useMemo(() => {
        return mockRepositories.filter((repo) => {
            const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                repo.description?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesVisibility = visibility === 'all' || repo.visibility === visibility;
            return matchesSearch && matchesVisibility;
        });
    }, [searchQuery, visibility]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col" style={{ border: '1px solid var(--border-subtle)' }}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                    <div>
                        <h2 className="text-lg font-semibold text-foreground">Connect Repository</h2>
                        <p className="text-xs text-[var(--muted)] font-mono mt-1">Select a repository to connect</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="hover:bg-(--muted-bg) text-lg px-2.5 py-0.5 rounded-lg transition-colors hover:text-red-500"
                    >
                        x
                    </button>
                </div>

                {/* Filters */}
                <div className="px-6 py-4 border-b flex items-center gap-3" style={{ borderColor: 'var(--border-subtle)' }}>
                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search repositories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 px-3 py-2 bg-[var(--muted-bg)] border rounded-lg text-sm font-mono placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent)]"
                    />

                    {/* Visibility Switcher */}
                    <div
                        className="flex items-center gap-2 bg-transparent"
                    >
                        {(['all', 'public', 'private'] as const).map((vis, idx) => (
                            <div key={vis} className="flex items-center gap-2">
                                <button
                                    onClick={() => setVisibility(vis)}
                                    className={`px-3 py-2 text-xs font-mono transition-colors capitalize rounded-lg ${visibility === vis
                                        ? 'bg-gray-600 text-white'
                                        : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                                        }`}
                                >
                                    {vis}
                                </button>
                                {idx < 2 && <div className="h-4 w-px bg-[var(--muted)]" />}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Repository List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredRepositories.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <p className="text-[var(--muted)] font-mono text-sm">No repositories found</p>
                        </div>
                    ) : (
                        <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
                            {filteredRepositories.map((repo) => (
                                <div
                                    key={repo.id}
                                    className="px-6 py-4 hover:bg-[var(--muted-bg)] transition-colors group cursor-pointer"
                                    onClick={() => onConnect?.(repo)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-mono font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                                                    {repo.name}
                                                </span>
                                                <span className={`text-xs font-mono px-2 py-0.5 rounded ${repo.visibility === 'public'
                                                    ? 'bg-blue-500/20 text-blue-400'
                                                    : 'bg-amber-500/20 text-amber-400'
                                                    }`}>
                                                    {repo.visibility}
                                                </span>
                                            </div>
                                            {repo.description && (
                                                <p className="text-xs text-[var(--muted)] font-mono mb-2">{repo.description}</p>
                                            )}
                                            <div className="flex items-center gap-3 text-xs font-mono text-[var(--muted)]">
                                                {repo.language && <span>{repo.language}</span>}
                                                <span>⭐ {repo.stars}</span>
                                            </div>
                                        </div>
                                        <button
                                            className="ml-4 px-3 py-1.5 text-xs font-mono bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onConnect?.(repo);
                                            }}
                                        >
                                            Connect
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
