'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

interface Agent {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'inactive' | 'running';
    tasksCompleted: number;
    created: string;
}

export default function AgentsPage() {
    const params = useParams();
    const repositoryId = params.repository_id;

    // Mock agent data
    const agents: Agent[] = [
        {
            id: '1',
            name: 'Web Testing Agent',
            description: 'Automated testing for web applications',
            status: 'active',
            tasksCompleted: 24,
            created: '2025-02-15',
        },
        {
            id: '2',
            name: 'API Validation Agent',
            description: 'Tests and validates API endpoints',
            status: 'running',
            tasksCompleted: 12,
            created: '2025-02-10',
        },
        {
            id: '3',
            name: 'UI Automation Agent',
            description: 'Automates UI interactions and workflows',
            status: 'active',
            tasksCompleted: 18,
            created: '2025-02-08',
        },
        {
            id: '4',
            name: 'Performance Monitor',
            description: 'Monitors and logs performance metrics',
            status: 'inactive',
            tasksCompleted: 8,
            created: '2025-02-01',
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-emerald-500/10 text-emerald-500';
            case 'running':
                return 'bg-blue-500/10 text-blue-500';
            case 'inactive':
                return 'bg-slate-500/10 text-slate-500';
            default:
                return 'bg-slate-500/10 text-slate-500';
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[var(--background)]">
            <Topbar />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar />

                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-6xl mx-auto px-10 py-12">
                        {/* Header */}
                        <div className="mb-8 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-mono text-[var(--muted)] uppercase tracking-widest mb-2">Repository · {repositoryId}</p>
                                <h1 className="text-2xl font-semibold text-[var(--foreground)] tracking-tight">Agents</h1>
                            </div>
                            <Link
                                href={`/repository/${repositoryId}/agents/new`}
                                className="px-4 py-2 bg-[var(--accent)] rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
                            >
                                Create Agent
                            </Link>
                        </div>

                        {/* Agents Table */}
                        <div className="bg-[var(--surface)] rounded-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b" style={{ borderColor: 'var(--muted)' }}>
                                            <th className="px-6 py-4 text-left text-xs font-mono text-[var(--muted)] uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-4 text-left text-xs font-mono text-[var(--muted)] uppercase tracking-wider">Description</th>
                                            <th className="px-6 py-4 text-left text-xs font-mono text-[var(--muted)] uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-mono text-[var(--muted)] uppercase tracking-wider">Tasks</th>
                                            <th className="px-6 py-4 text-left text-xs font-mono text-[var(--muted)] uppercase tracking-wider">Created</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {agents.map((agent) => (
                                            <tr key={agent.id} className="hover:bg-[var(--muted-bg)] transition-colors border-t border-[var(--muted)]" style={{ borderColor: 'var(--muted)' }}>
                                                <td className="px-6 py-4">
                                                    <p className="font-medium text-[var(--foreground)]">{agent.name}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-[var(--muted)]">{agent.description}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(agent.status)}`}>
                                                        {agent.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-mono text-[var(--foreground-soft)]">{agent.tasksCompleted}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-mono text-[var(--muted)]">{agent.created}</p>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Empty state (if needed later) */}
                        {agents.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-[var(--muted)] mb-4">No agents yet</p>
                                <Link
                                    href={`/repository/${repositoryId}/agents/new`}
                                    className="text-[var(--accent)] hover:underline text-sm font-medium"
                                >
                                    Create your first agent
                                </Link>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}