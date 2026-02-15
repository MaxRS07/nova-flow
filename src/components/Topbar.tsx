'use client';

import Link from 'next/link';

export default function Topbar() {
    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
            {/* Search */}
            <div className="flex-1 max-w-2xl">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search workflows..."
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 ml-6">
                <button className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-700 font-medium" title="Notifications">
                    Notifications
                </button>
                <button className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-700 font-medium" title="Options">
                    Options
                </button>
                <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:shadow-lg transition-all">
                    Share
                </button>
                <Link href="/auth">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-semibold cursor-pointer hover:shadow-lg transition-all">
                        U
                    </div>
                </Link>
            </div>
        </header>
    );
}
