'use client';

import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { useParams } from 'next/navigation';

export default function RepositoryDashboard() {
  const params = useParams();
  const repositoryId = params.repository_id;

  const mockData = {
    name: 'web-app',
    totalTests: 24,
    passingTests: 22,
    failingTests: 2,
    coverage: 87,
    lastRun: '2h ago',
    status: 'healthy',
  };

  const passRate = ((mockData.passingTests / mockData.totalTests) * 100).toFixed(1);

  const testRows = [
    { name: 'auth.spec.ts', status: 'passed', duration: '1.2s', ran: '2h ago' },
    { name: 'api.spec.ts', status: 'passed', duration: '3.1s', ran: '2h ago' },
    { name: 'ui.spec.ts', status: 'failed', duration: '0.8s', ran: '2h ago' },
    { name: 'e2e.spec.ts', status: 'passed', duration: '4.5s', ran: '2h ago' },
    { name: 'unit.spec.ts', status: 'passed', duration: '2.2s', ran: '2h ago' },
  ];

  const stats = [
    { label: 'total tests', value: mockData.totalTests, color: 'text-[var(--foreground)]' },
    { label: 'passing', value: mockData.passingTests, color: 'text-emerald-500' },
    { label: 'failing', value: mockData.failingTests, color: 'text-rose-500' },
    { label: 'coverage', value: `${mockData.coverage}%`, color: 'text-[var(--accent)]' },
  ];

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
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-[var(--foreground)] tracking-tight">{mockData.name}</h1>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">{mockData.status}</span>
              </div>
              <p className="text-sm text-[var(--muted)] font-mono mt-1.5">Last run {mockData.lastRun}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-10">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-[var(--surface)] rounded-xl px-6 py-5" style={{ border: '1px solid var(--border-subtle)' }}>
                  <p className="text-xs font-mono text-[var(--muted)] mb-3 uppercase tracking-wider">{stat.label}</p>
                  <p className={`text-3xl font-mono font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Pass rate + activity */}
            <div className="grid grid-cols-3 gap-4 mb-10">
              <div className="col-span-2 bg-[var(--surface)] rounded-xl px-6 py-6" style={{ border: '1px solid var(--border-subtle)' }}>
                <p className="text-xs font-mono text-[var(--muted)] uppercase tracking-wider mb-5">Pass Rate</p>
                <div className="flex items-center gap-6">
                  <span className="text-5xl font-mono font-bold text-emerald-500 shrink-0">{passRate}%</span>
                  <div className="flex-1 space-y-2">
                    <div className="h-2.5 rounded-full bg-[var(--muted-bg)] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all"
                        style={{ width: `${passRate}%` }}
                      />
                    </div>
                    <p className="text-xs font-mono text-[var(--muted)]">{mockData.passingTests} of {mockData.totalTests} tests passing</p>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--surface)] rounded-xl px-6 py-6" style={{ border: '1px solid var(--border-subtle)' }}>
                <p className="text-xs font-mono text-[var(--muted)] uppercase tracking-wider mb-5">Activity</p>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-[var(--muted)] font-mono mb-1">last run</p>
                    <p className="text-sm font-mono text-[var(--foreground-soft)]">{mockData.lastRun}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--muted)] font-mono mb-1">status</p>
                    <p className="text-sm font-mono text-emerald-500">{mockData.status}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Test Results */}
            <div className="bg-[var(--surface)] rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
              <div className="px-6 py-4 bg-[var(--muted-bg)]" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <p className="text-xs font-mono text-[var(--muted)] uppercase tracking-wider">Recent Test Results</p>
              </div>
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr] px-6 py-3 bg-[var(--muted-bg)]" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                {['test', 'status', 'duration', 'ran'].map((col) => (
                  <span key={col} className="text-xs font-mono text-[var(--muted)] uppercase tracking-wider">{col}</span>
                ))}
              </div>
              {testRows.map((row, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[2fr_1fr_1fr_1fr] px-6 py-4 hover:bg-[var(--muted-bg)] transition-colors"
                  style={i < testRows.length - 1 ? { borderBottom: '1px solid var(--border-subtle)' } : {}}
                >
                  <span className="font-mono text-sm text-[var(--foreground-soft)]">{row.name}</span>
                  <span className={`font-mono text-sm ${row.status === 'passed' ? 'text-emerald-500' : 'text-rose-500'}`}>{row.status}</span>
                  <span className="font-mono text-sm text-[var(--muted)]">{row.duration}</span>
                  <span className="font-mono text-sm text-[var(--muted)]">{row.ran}</span>
                </div>
              ))}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
