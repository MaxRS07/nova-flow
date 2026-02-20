'use client';

import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function TestPage() {
    const params = useParams();
    const repositoryId = params.repository_id;
    const [selectedTestSuites, setSelectedTestSuites] = useState<string[]>(['all']);
    const [agentCount, setAgentCount] = useState(4);
    const [isLaunching, setIsLaunching] = useState(false);

    const testSuites = [
        { id: 'all', name: 'All Tests', count: 24 },
        { id: 'unit', name: 'Unit Tests', count: 8 },
        { id: 'integration', name: 'Integration Tests', count: 10 },
        { id: 'e2e', name: 'E2E Tests', count: 6 },
    ];

    const recentRuns = [
        { id: 1, timestamp: '2h ago', agents: 4, tests: 24, passed: 22, failed: 2, duration: '2m 34s' },
        { id: 2, timestamp: '5h ago', agents: 4, tests: 24, passed: 24, failed: 0, duration: '2m 18s' },
        { id: 3, timestamp: '1d ago', agents: 2, tests: 24, passed: 23, failed: 1, duration: '3m 42s' },
    ];

    const handleLaunchTests = async () => {
        setIsLaunching(true);
        // Simulate launch
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLaunching(false);
        console.log('Launching test fleet with:', {
            repository: repositoryId,
            testSuites: selectedTestSuites,
            agents: agentCount,
            timestamp: new Date().toISOString(),
        });
    };

    return (
        <div className="flex flex-col h-screen bg-[var(--background)]">
            <Topbar />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar />

                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-5xl mx-auto px-10 py-12">

                        {/* Header */}
                        <div className="mb-10">
                            <p className="text-xs font-mono text-[var(--muted)] uppercase tracking-widest mb-2">Repository · {repositoryId}</p>
                            <h1 className="text-2xl font-semibold text-[var(--foreground)] tracking-tight mb-2">Test Fleet</h1>
                            <p className="text-sm text-[var(--muted)] font-mono">Launch and manage your agent-powered test execution</p>
                        </div>

                        {/* Configuration Section */}
                        <div className="bg-[var(--surface)] rounded-xl p-6 mb-8" style={{ border: '1px solid var(--border-subtle)' }}>
                            <p className="text-xs font-mono text-[var(--muted)] uppercase tracking-wider mb-6">Configuration</p>

                            {/* Agent Count */}
                            <div className="mb-8">
                                <label className="block text-sm font-mono text-[var(--foreground-soft)] mb-3">
                                    Parallel Agents
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="1"
                                        max="8"
                                        value={agentCount}
                                        onChange={(e) => setAgentCount(parseInt(e.target.value))}
                                        className="flex-1 h-2 rounded-full bg-[var(--muted-bg)] outline-none"
                                    />
                                    <div className="w-16 bg-[var(--muted-bg)] rounded-lg px-4 py-2 text-center">
                                        <span className="font-mono font-bold text-[var(--foreground)]">{agentCount}</span>
                                    </div>
                                </div>
                                <p className="text-xs text-[var(--muted)] font-mono mt-2">Higher agent count = faster parallel test execution</p>
                            </div>

                            {/* Test Suites */}
                            <div>
                                <label className="block text-sm font-mono text-[var(--foreground-soft)] mb-3">
                                    Test Suites
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {testSuites.map((suite) => (
                                        <button
                                            key={suite.id}
                                            onClick={() => {
                                                if (suite.id === 'all') {
                                                    setSelectedTestSuites(selectedTestSuites.includes('all') ? [] : ['all']);
                                                } else {
                                                    const newSuites = selectedTestSuites.filter(s => s !== 'all');
                                                    if (selectedTestSuites.includes(suite.id)) {
                                                        setSelectedTestSuites(newSuites.filter(s => s !== suite.id));
                                                    } else {
                                                        setSelectedTestSuites([...newSuites, suite.id]);
                                                    }
                                                }
                                            }}
                                            className={`p-4 rounded-lg border-2 transition-all text-left font-mono text-sm ${selectedTestSuites.includes(suite.id) || (suite.id === 'all' && selectedTestSuites.includes('all'))
                                                ? 'border-blue-500 bg-blue-500/10'
                                                : 'border-[var(--border-subtle)] hover:border-[var(--border)]'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold text-[var(--foreground)]">{suite.name}</span>
                                                <span className="text-xs text-[var(--muted)]">{suite.count}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Launch Section */}
                        <div className="bg-(--surface) rounded-xl p-6 mb-8" style={{ border: '1px solid var(--border-subtle)' }}>
                            <p className="text-xs font-mono text-(--muted) uppercase tracking-wider mb-4">Ready to start</p>
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div>
                                    <p className="text-xs text-(--muted) font-mono mb-1">agents</p>
                                    <p className="text-2xl font-mono font-bold text-foreground">{agentCount}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-(--muted) font-mono mb-1">test suites selected</p>
                                    <p className="text-2xl font-mono font-bold text-foreground">{selectedTestSuites.length}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-(--muted) font-mono mb-1">estimated tests</p>
                                    <p className="text-2xl font-mono font-bold text-blue-500">24</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLaunchTests}
                                disabled={isLaunching || selectedTestSuites.length === 0}
                                className={`w-full py-3 rounded-lg font-semibold transition-all border ${isLaunching || selectedTestSuites.length === 0
                                    ? 'text-(--muted) cursor-not-allowed border-(--muted)'
                                    : 'text-white hover:shadow-lg hover:cursor-pointer '
                                    }`}
                                style={isLaunching || selectedTestSuites.length === 0
                                    ? { borderColor: 'var(--border)' }
                                    : { borderColor: 'var(--muted)' }}
                            >
                                {isLaunching ? 'Launching Test Fleet...' : 'Launch Test Fleet'}
                            </button>
                        </div>

                        {/* Recent Runs */}
                        <div className="bg-(--surface) rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
                            <div className="px-6 py-4 bg-(--muted-bg)" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                <p className="text-xs font-mono text-(--muted) uppercase tracking-wider">Recent Test Runs</p>
                            </div>
                            <div className="grid grid-cols-[1fr_0.8fr_0.8fr_1fr_1fr_0.8fr] px-6 py-3 bg-(--muted-bg)" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                {['time', 'agents', 'tests', 'passed', 'failed', 'duration'].map((col) => (
                                    <span key={col} className="text-xs font-mono text-(--muted) uppercase tracking-wider">{col}</span>
                                ))}
                            </div>
                            {recentRuns.map((run, i) => (
                                <div
                                    key={run.id}
                                    className="grid grid-cols-[1fr_0.8fr_0.8fr_1fr_1fr_0.8fr] px-6 py-4 hover:bg-[var(--muted-bg)] transition-colors items-center"
                                    style={i < recentRuns.length - 1 ? { borderBottom: '1px solid var(--border-subtle)' } : {}}
                                >
                                    <span className="font-mono text-sm text-[var(--foreground-soft)]">{run.timestamp}</span>
                                    <span className="font-mono text-sm text-[var(--foreground)]">{run.agents}</span>
                                    <span className="font-mono text-sm text-[var(--foreground)]">{run.tests}</span>
                                    <span className="font-mono text-sm text-emerald-500">{run.passed}</span>
                                    <span className={`font-mono text-sm ${run.failed > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>{run.failed}</span>
                                    <span className="font-mono text-sm text-[var(--muted)]">{run.duration}</span>
                                </div>
                            ))}
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
