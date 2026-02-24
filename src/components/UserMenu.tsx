'use client';

import { GithubUser } from '@/types/gh_user';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else if (theme === 'light') {
    root.classList.remove('dark');
  } else {
    // system
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', prefersDark);
  }
}

export default function UserMenu({ user, loading }: { user: GithubUser | null, loading: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isThemeExpanded, setIsThemeExpanded] = useState(false);
  const [theme, setTheme] = useState<Theme>('system');
  const router = useRouter();

  useEffect(() => {
    const saved = (localStorage.getItem('theme') as Theme) || 'system';
    setTheme(saved);
    applyTheme(saved);
  }, []);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="w-7 h-7 rounded-full bg-zinc-700 dark:bg-zinc-600 flex items-center justify-center text-white text-xs font-mono font-semibold cursor-pointer hover:bg-zinc-600 dark:hover:bg-zinc-500 transition-colors"
      >
        {loading ? (
          <div className="w-4 h-4 border-t-2 border-r-2 border-white rounded-full animate-spin" />
        ) : (
          <img src={user?.avatar_url || '/default-avatar.png'} alt="User Avatar" className="w-full h-full rounded-full object-cover" />
        )}
      </button>

      {isMenuOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute right-0 mt-1 w-48 bg-background rounded-xl shadow-xl z-50 text-sm overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
            <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
              <div className="px-4 py-2.5 hover:bg-(--muted-bg) cursor-pointer text-(--foreground-soft) font-mono text-xs">
                Profile
                <span className="block text-(--muted) text-xs">{user?.login}</span>
              </div>
            </Link>

            <div style={{ borderTop: '1px solid var(--border-subtle)' }} />

            <div>
              <button
                onClick={() => setIsThemeExpanded(!isThemeExpanded)}
                className="w-full px-4 py-2.5 hover:bg-(--muted-bg) transition-colors text-(--foreground-soft) font-mono text-xs flex items-center justify-between"
              >
                <span>Theme</span>
                <span className="text-(--muted) text-xs">{theme}</span>
              </button>

              {isThemeExpanded && (
                <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  {(['light', 'dark', 'system'] as Theme[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => handleThemeChange(t)}
                      className={`w-full px-5 py-2 text-left hover:bg-(--muted-bg) transition-colors flex items-center justify-between font-mono text-xs ${theme === t ? 'text-blue-500' : 'text-(--muted)'
                        }`}
                    >
                      <span className="capitalize">{t}</span>
                      {theme === t && <span className="text-blue-500">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)' }} />

            <button
              onClick={() => {
                setIsMenuOpen(false);
                router.push('/auth');
              }}
              className="w-full px-4 py-2.5 hover:bg-(--muted-bg) text-rose-500 text-left font-mono text-xs transition-colors"
            >
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
