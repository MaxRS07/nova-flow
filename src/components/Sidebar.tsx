'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function Sidebar() {
    const { repository_id } = useParams();

    const pathname = usePathname();
    const activeItem = pathname.split('/')[1] || '';

    const menuItems = [
        { id: 'dashboard', label: 'dashboard' },
        { id: 'test', label: 'test' },
        { id: 'git_workflows', label: 'git workflows' },
        { id: 'settings', label: 'settings' },
    ];

    return (
        <aside className="w-56 bg-(--surface) shrink-0 flex flex-col" style={{ borderRight: '1px solid var(--border)' }}>
            <nav className="flex-1 py-6 px-3">
                <p className="text-[10px] font-mono font-medium text-(--muted) uppercase tracking-widest px-3 mb-3">Navigation</p>
                <ul className="space-y-0.5">
                    {menuItems.map((item) => (
                        <li key={item.id}>
                            <Link
                                href={`${item.id}`}
                                className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-mono transition-all ${activeItem === item.id
                                    ? 'bg-(--accent-soft) text-(--accent) font-medium'
                                    : 'text-(--muted) hover:text-(--foreground-soft) hover:bg-(--muted-bg)'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}
