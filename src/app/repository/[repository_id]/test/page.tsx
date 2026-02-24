'use client';

import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import Dropdown from '@/components/Dropdown';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import InfoIcon from '@/components/InfoIcon';

export default function TestPage() {
    const params = useParams();
    const repositoryId = params.repository_id;
    const [testUrl, setTestUrl] = useState<string>('');
    const [subpages, setSubpages] = useState<string[]>([]);
    const [agentCount, setAgentCount] = useState(4);
    const [isLaunching, setIsLaunching] = useState(false);
    const [selectedConfig, setSelectedConfig] = useState('default');
    const [lastUsedConfig, setLastUsedConfig] = useState('default');
    const [userAgents, setUserAgents] = useState<string[]>(['default-ui-agent']);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const recentRuns: { id: number; timestamp: string; agents: number; tests: number; passed: number; failed: number; duration: string }[] = [
    ];

    const handleLaunchTests = async () => {
        setIsLaunching(true);
        // Simulate launch
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLaunching(false);
    };

    const formathhmmss = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours}h ${minutes}m ${secs.toPrecision(2)}s`;
    }

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTestUrl(value);

        if (value === '' || isValidUrl(value)) {
            setFormErrors(prev => {
                const updated = { ...prev };
                delete updated['testUrl'];
                return updated;
            });
        } else {
            setFormErrors(prev => ({
                ...prev,
                testUrl: 'Invalid URL format'
            }));
        }
    };
    const isValidUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const router = useRouter();

    return (
        <div className="flex flex-col h-screen bg-[var(--background)]">
            <Topbar />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar />

                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-5xl mx-auto px-10 py-12">

                        {/* Header */}
                        <div className="mb-5">
                            <p className="text-xs font-mono text-[var(--muted)] uppercase tracking-widest mb-2">Repository · {repositoryId}</p>
                            <h1 className="text-2xl font-semibold text-[var(--foreground)] tracking-tight mb-2">Test Fleet</h1>
                            <p className="text-sm text-[var(--muted)] font-mono">Launch and manage your agent-powered test execution</p>
                        </div>

                        {/* Configuration Section */}
                        <div className="bg-[var(--surface)] rounded-xl p-6 mb-8" style={{ border: '1px solid var(--border-subtle)' }}>
                            <p className="text-xs font-mono text-[var(--muted)] uppercase tracking-wider mb-6">Agent Configuration</p>
                            {/* Agent Config Dropdown */}
                            <span className="text-sm font-mono text-[var(--foreground-soft)] mb-3 block">Configuration Profile
                                <InfoIcon text="Configure your test fleet by selecting an agent configuration profile, customizing user agents for diverse test execution, and setting the number of parallel agents to optimize testing speed." />
                            </span>

                            <div className="mb-6">
                                <Dropdown
                                    options={[
                                        { value: 'default', label: 'Default Config' },
                                        { value: 'config1', label: 'Config 1' },
                                        { value: 'config2', label: 'Config 2' },
                                    ]}
                                    value={selectedConfig}
                                    onChange={setSelectedConfig}
                                    onCreate={() => { }}
                                    lastUsedValue={lastUsedConfig}
                                />
                            </div>
                            { /* Edit Agent */}
                            <div>
                                <span className="block text-sm font-mono text-[var(--foreground-soft)] mb-3">
                                    User Agents
                                    <InfoIcon text="Select user agents to simulate different browsers and devices during test execution. The agent's exploratory behavior can also be configured." />
                                </span>
                                <div className="space-y-3">
                                    {userAgents.map((agent, i) => (
                                        <div key={i} className="flex gap-3 items-center">
                                            <div className="flex-1">
                                                <Dropdown
                                                    options={[{ value: 'default-ui-agent', label: 'Default UI Testing Agent' }]}
                                                    value={agent}
                                                    onChange={(value) => setUserAgents(prev => {
                                                        const updated = [...prev];
                                                        updated[i] = value;
                                                        return updated;
                                                    })}
                                                    onCreate={() => router.push(`/repository/${repositoryId}/agents/new`)}
                                                    lastUsedValue={''}
                                                />
                                            </div>
                                            {userAgents.length > 1 &&
                                                <button
                                                    onClick={() => setUserAgents(prev => prev.filter((_, idx) => idx !== i))}
                                                    className="px-3 py-2 text-xs font-mono text-red-500 hover:bg-red-500/10 rounded-lg transition-colors border border-[var(--border-subtle)] whitespace-nowrap"
                                                >
                                                    Remove
                                                </button>
                                            }
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type='button'
                                    onClick={() => userAgents.length < 5 && setUserAgents(prev => [...prev, 'default-ui-agent'])}
                                    disabled={userAgents.length >= 5}
                                    className="mt-3 px-3 py-2 text-xs font-mono text-[var(--accent)] hover:bg-[var(--muted-bg)] rounded-lg transition-colors border border-[var(--border-subtle)] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    + Add Agent
                                </button>
                                <span className="text-xs text-[var(--muted)] font-mono mt-2 block">{userAgents.length}/5</span>
                            </div>
                            {/* Agent Count */}
                            <div className="mt-4 mb-8">
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

                            {/* Test URL */}
                            <div>
                                <label className="block text-sm font-mono text-[var(--foreground-soft)] mb-3">
                                    <span className="flex items-center gap-4">
                                        Test URL
                                        <InfoIcon text="URL of your application to test. The test fleet will spawn at this URL and sub-pages." />
                                    </span>

                                    <input
                                        id='testUrl'
                                        name='testUrl'
                                        type='text'
                                        value={testUrl}
                                        onChange={handleUrlChange}
                                        placeholder={"https://myapp.com"}
                                        className={`mt-4 w-full flex-1 p-3 rounded-lg border transition-all text-left font-mono text-sm bg-[var(--background)] ${formErrors['testUrl']
                                            ? 'border-rose-500 focus:outline-none'
                                            : 'border-[var(--border-subtle)]'
                                            }`}
                                    />
                                    {formErrors['testUrl'] && (
                                        <p className="text-xs text-rose-500 font-mono mt-2">{formErrors['testUrl']}</p>
                                    )}
                                </label>
                                {subpages.length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-xs text-[var(--muted)] font-mono mb-3">Subpages</p>
                                        <div className="space-y-2">
                                            {subpages.map((subpage, index) => (
                                                <div key={index} className="flex gap-2 items-center">
                                                    <span className="text-[var(--muted)] text-sm font-mono">/</span>
                                                    <input
                                                        id={`subpage-${index}`}
                                                        type='text'
                                                        value={subpage}
                                                        onChange={(e) => {
                                                            const updated = [...subpages];
                                                            updated[index] = e.target.value;
                                                            setSubpages(updated);
                                                        }}
                                                        placeholder={"dashboard"}
                                                        className="flex-1 p-3 rounded-lg border border-[var(--border-subtle)] transition-all text-left font-mono text-sm bg-[var(--background)]"
                                                    />
                                                    <button
                                                        onClick={() => setSubpages(subpages.filter((_, i) => i !== index))}
                                                        className="px-3 py-2 text-xs font-mono text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <button
                                    type='button'
                                    title='Add subpage'
                                    onClick={() => setSubpages(prev => [...prev, ''])}
                                    className="mt-3 px-3 py-2 text-xs font-mono text-[var(--accent)] hover:bg-[var(--muted-bg)] rounded-lg transition-colors border border-[var(--border-subtle)]"
                                >
                                    + Add Subpage
                                </button>
                            </div>
                        </div>

                        {/* Launch Section */}
                        <div className="bg-[var(--surface)] rounded-xl p-6 mb-8" style={{ border: '1px solid var(--border-subtle)' }}>
                            <p className="text-xs font-mono text-[var(--muted)] uppercase tracking-wider mb-4">Ready to start</p>
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div>
                                    <p className="text-xs text-[var(--muted)] font-mono mb-1">agents</p>
                                    <p className="text-2xl font-mono font-bold text-foreground">{agentCount}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-[var(--muted)] font-mono mb-1">estimated runtime</p>
                                    <p className="text-2xl font-mono font-bold text-blue-500">{formathhmmss(90 / agentCount)}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLaunchTests}
                                disabled={isLaunching || !isValidUrl(testUrl) || Object.keys(formErrors).length > 0}
                                className={`w-full py-3 rounded-lg font-semibold transition-all border ${isLaunching || !isValidUrl(testUrl) || Object.keys(formErrors).length > 0
                                    ? 'text-[var(--muted)] cursor-not-allowed border-[var(--muted)]'
                                    : 'text-white hover:shadow-lg hover:cursor-pointer '
                                    }`}
                                style={isLaunching || !isValidUrl(testUrl) || Object.keys(formErrors).length > 0
                                    ? { borderColor: 'var(--border)' }
                                    : { borderColor: 'var(--muted)' }}
                            >
                                {isLaunching ? 'Launching Test Fleet...' : 'Launch Test Fleet'}
                            </button>
                        </div>

                        {/* Recent Runs */}
                        <div className="bg-[var(--surface)] rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
                            <div className="px-6 py-4 bg-[var(--muted-bg)]" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                <p className="text-xs font-mono text-[var(--muted)] uppercase tracking-wider">Recent Test Runs</p>
                            </div>
                            <div className="grid grid-cols-[1fr_0.8fr_0.8fr_1fr_1fr_0.8fr] px-6 py-3 bg-[var(--muted-bg)]" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                {['time', 'agents', 'tests', 'passed', 'failed', 'duration'].map((col) => (
                                    <span key={col} className="text-xs font-mono text-[var(--muted)] uppercase tracking-wider">{col}</span>
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
