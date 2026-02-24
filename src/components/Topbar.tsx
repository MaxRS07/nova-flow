'use client';

import Link from 'next/link';
import UserMenu from './UserMenu';
import WebCLI from './WebCLI';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function Topbar() {
    const { user, loading } = useAuth();
    const params = useParams();
    const [webCLIOpen, setWebCLIOpen] = useState(false);

    const toggleWebCLI = () => {
        setWebCLIOpen(!webCLIOpen);
    };
    return (
        <header className="h-14 flex items-center justify-between px-6 bg-[var(--surface)] shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className='flex flex-row'>
                <Link href="/" className="font-mono text-sm font-semibold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors tracking-tight">
                    qa-platform
                </Link>
                {params.repository_id && (
                    <>
                        <span className="mx-2 text-[var(--muted)]">/</span>
                        <Link href={`/repository/${params.repository_id}/dashboard`} className="font-mono text-sm font-semibold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors tracking-tight">
                            {`repo-${params.repository_id}`}
                        </Link>
                    </>
                )}
            </div>

            <div className="flex-1 max-w-md mx-8">
                <input
                    type="text"
                    placeholder="Search projects..."
                    className="w-full px-3.5 py-2 text-sm rounded-lg bg-[var(--muted-bg)] text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 transition-all"
                    style={{ border: 'none' }}
                />
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={toggleWebCLI}
                    title="Open Web CLI"
                    className="text-[var(--muted)] hover:text-[var(--foreground-soft)] transition-colors text-xs font-mono tracking-wide"
                >
                    terminal
                </button>
                <UserMenu
                    user={user}
                    loading={loading}
                />
            </div>

            <WebCLI isOpen={webCLIOpen} onClose={() => setWebCLIOpen(false)} />
        </header>
    );
}
