'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Sidebar() {
    const [activeItem, setActiveItem] = useState('workflows');

    const menuItems = [
        { id: 'workflows', label: 'Workflows' },
        { id: 'shared', label: 'Shared' },
        { id: 'favorites', label: 'Favorites' },
        { id: 'recent', label: 'Recent' },
        { id: 'settings', label: 'Settings' },
    ];

    return (
        <aside className="w-72 m-4 mr-0">
            <div className="bg-white rounded-2xl shadow-lg flex flex-col h-[calc(100vh-2rem)]" style={{ marginRight: "20px" }}>
                {/* Logo */}
                <Link href="/">
                    <div className="p-6 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                            Nova Flow
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Agentic Workflows</p>
                    </div>
                </Link>

                {/* Navigation */}
                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.id}>
                                <button
                                    onClick={() => setActiveItem(item.id)}
                                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all ${activeItem === item.id
                                        ? 'bg-blue-50 text-blue-600 font-medium'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <span>{item.label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-200">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:shadow-lg transition-all">
                        <span>+</span>
                        <span>New Workflow</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
