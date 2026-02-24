'use client';

import { getUserRepositories } from '@/lib/auth';
import { Repository } from '@/types/gh_user';
import { useState, useEffect } from 'react';

interface RepositoryConnectCardProps {
    isOpen: boolean;
    onClose: () => void;
    onConnect?: (repo: Repository) => void;
}

export default function RepositoryConnectCard({ isOpen, onClose, onConnect }: RepositoryConnectCardProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [visibility, setVisibility] = useState<'all' | 'public' | 'private'>('all');
    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const itemsPerPage = 100;

    // Fetch all repositories from the API
    const fetchAllRepositories = async () => {
        setIsLoading(true);
        try {
            let allRepos: Repository[] = [];
            const seenIds = new Set<number>();
            let page = 1;
            let hasMore = true;

            // Fetch all pages
            while (hasMore) {

                const data = await getUserRepositories(page, itemsPerPage);
                // Deduplicate by repo ID
                for (const repo of data.repositories) {
                    if (!seenIds.has(repo.id)) {
                        seenIds.add(repo.id);
                        allRepos.push(repo);
                    }
                }
                hasMore = data.has_next_page;
                page++;
            }
            setRepositories(allRepos.sort((a, b) => {
                if (a.pushed_at && b.pushed_at) {
                    return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
                }
                return 0;
            }));
        } catch (err) {
            console.error("Failed to fetch repositories:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        if (isOpen) {
            fetchAllRepositories();
        }
    }, [isOpen]);

    // Filter repositories based on search and visibility
    const filteredRepositories = repositories.filter((repo) => {
        const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            repo.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesVisibility = visibility === 'all' || repo.visibility === visibility;
        return matchesSearch && matchesVisibility;
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col" style={{ border: '1px solid var(--muted)' }}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--muted)' }}>
                    <div>
                        <h2 className="text-lg font-semibold text-foreground">Connect Repository</h2>
                        <p className="text-xs text-[var(--muted)] font-mono mt-1">Select a repository to connect</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="hover:bg-[var(--muted-bg)] text-lg px-2.5 py-0.5 rounded-lg transition-colors hover:text-red-500"
                    >
                        x
                    </button>
                </div>

                {/* Filters */}
                <div className="px-6 py-4 border-b flex items-center gap-3" style={{ borderColor: 'var(--muted)' }}>
                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search repositories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 px-3 py-2 bg-[var(--muted-bg)] border border-[var(--muted)] rounded-lg text-sm font-mono placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent)]"
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
                    {repositories.length === 0 && !isLoading ? (
                        <div className="px-6 py-12 text-center">
                            <p className="text-[var(--muted)] font-mono text-sm">No repositories found</p>
                        </div>
                    ) : isLoading ? (
                        <div className="px-6 py-12 text-center">
                            <p className="text-[var(--muted)] font-mono text-sm">Loading repositories...</p>
                        </div>
                    ) : filteredRepositories.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <p className="text-[var(--muted)] font-mono text-sm">No repositories match your filters</p>
                        </div>
                    ) : (
                        <div>
                            {filteredRepositories.map((repo, i) => (
                                <div
                                    key={repo.id + ":" + i}
                                    className={`${i > 0 ? 'border-t border-[var(--muted)]' : ''} px-6 py-4 hover:bg-[var(--muted-bg)] transition-colors group cursor-pointer`}
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
                                                <span>⭐ {repo.stargazers_count}</span>
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
                {/* Footer */}
                {repositories.length > 0 && !isLoading && (
                    <div className="px-6 py-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                        <div className="text-xs font-mono text-[var(--muted)]">
                            {filteredRepositories.length === repositories.length
                                ? `${repositories.length} repositories`
                                : `${filteredRepositories.length} of ${repositories.length} repositories`}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
