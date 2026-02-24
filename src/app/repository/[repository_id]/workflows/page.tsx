'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { fetchRepoTree } from '@/lib/github';
import { useProjects } from '@/contexts/ProjectsContext';

interface CIPipeline {
    path: string;
    fileName: string;
    type: string;
    provider: string;
}

export default function WorkflowsPage() {
    const params = useParams();
    const repositoryId = params.repository_id;
    const project = useProjects().getProject(Number(repositoryId));

    const [pipelines, setPipelines] = useState<CIPipeline[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [repositoryInfo, setRepositoryInfo] = useState<{ owner?: string; repo?: string } | null>(null);

    // Map file paths to CI providers
    const detectCIProvider = (filePath: string): { provider: string; type: string } => {
        const path = filePath.toLowerCase();

        if (path.includes('.github/workflows')) return { provider: 'GitHub Actions', type: 'GitHub Actions' };
        if (path.includes('.gitlab-ci.yml')) return { provider: 'GitLab CI', type: 'GitLab CI' };
        if (path.includes('.circleci/config.yml')) return { provider: 'CircleCI', type: 'CircleCI' };
        if (path.includes('bitbucket-pipelines.yml')) return { provider: 'Bitbucket Pipelines', type: 'Bitbucket' };
        if (path.includes('.travis.yml')) return { provider: 'Travis CI', type: 'Travis CI' };
        if (path.includes('azure-pipelines.yml') || path.includes('azure-pipelines.yaml')) return { provider: 'Azure Pipelines', type: 'Azure' };
        if (path.includes('.drone.yml')) return { provider: 'Drone CI', type: 'Drone' };
        if (path.includes('jenkinsfile') || path.includes('jenkins')) return { provider: 'Jenkins', type: 'Jenkins' };
        if (path.includes('.gitpod.yml')) return { provider: 'Gitpod', type: 'Gitpod' };
        if (path.includes('cloudbuild.yaml')) return { provider: 'Google Cloud Build', type: 'CloudBuild' };

        return { provider: 'Unknown', type: 'Generic CI' };
    };

    // Fetch the repository details and YAML files
    useEffect(() => {
        const fetchWorkflows = async () => {
            try {
                setLoading(true);
                setError(null);

                if (project) {
                    setRepositoryInfo({ owner: project.owner.login, repo: project.name });
                    const result = await fetchRepoTree(project.owner.login, project.name);
                    console.log(result);

                    if (result && result.yamlFiles) {
                        const ciPipelines: CIPipeline[] = result.yamlFiles
                            .map((filePath: string) => {
                                const fileName = filePath.split('/').pop() || filePath;
                                const { provider, type } = detectCIProvider(filePath);
                                return {
                                    path: filePath,
                                    fileName,
                                    type,
                                    provider,
                                };
                            })
                            .filter((pipeline: CIPipeline) => pipeline.provider !== 'Unknown');

                        // Remove duplicates and sort by provider
                        const uniquePipelines = Array.from(
                            new Map(ciPipelines.map((p) => [p.provider, p])).values()
                        ).sort((a, b) => a.provider.localeCompare(b.provider));

                        setPipelines(uniquePipelines);

                        if (uniquePipelines.length === 0) {
                            setError('No CI/CD pipeline configurations found in this repository.');
                        }
                    } else {
                        setError('Could not fetch repository files. Please make sure the GitHub App is installed.');
                    }
                } else {
                    // Fallback: show demo data or error for now
                    setError('Repository information not available. Navigate from the repositories page.');
                }
            } catch (err) {
                console.error('Error fetching workflows:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch CI/CD pipelines');
            } finally {
                setLoading(false);
            }
        };

        fetchWorkflows();
    }, [repositoryId]);

    const getProviderColor = (provider: string): string => {
        switch (provider) {
            case 'GitHub Actions':
                return 'bg-blue-500/10 text-blue-500';
            case 'GitLab CI':
                return 'bg-orange-500/10 text-orange-500';
            case 'CircleCI':
                return 'bg-purple-500/10 text-purple-500';
            case 'Azure Pipelines':
                return 'bg-blue-600/10 text-blue-600';
            case 'Travis CI':
                return 'bg-red-500/10 text-red-500';
            case 'Drone CI':
                return 'bg-cyan-500/10 text-cyan-500';
            case 'Jenkins':
                return 'bg-red-600/10 text-red-600';
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
                    <div className="max-w-5xl mx-auto px-10 py-12">
                        {/* Header */}
                        <div className="mb-10">
                            <p className="text-xs font-mono text-[var(--muted)] uppercase tracking-widest mb-2">
                                Repository · {repositoryId}
                            </p>
                            <h1 className="text-2xl font-semibold text-[var(--foreground)] tracking-tight mb-2">
                                CI/CD Pipelines
                            </h1>
                            <p className="text-sm text-[var(--muted)] font-mono">
                                Detected CI/CD pipeline configurations in your repository
                            </p>
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="flex items-center justify-center py-16">
                                <div className="text-center">
                                    <div className="inline-block animate-spin mb-4">
                                        <div className="w-8 h-8 border-2 border-[var(--muted)] border-t-[var(--accent)] rounded-full"></div>
                                    </div>
                                    <p className="text-sm font-mono text-[var(--muted)]">Scanning for CI/CD pipelines...</p>
                                </div>
                            </div>
                        )}

                        {/* Error State */}
                        {!loading && error && (
                            <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl px-6 py-4">
                                <p className="text-sm font-mono text-rose-500">{error}</p>
                            </div>
                        )}

                        {/* Pipelines List */}
                        {!loading && !error && pipelines.length > 0 && (
                            <div className="space-y-4">
                                {/* Summary */}
                                <div className="grid grid-cols-3 gap-4 mb-8">
                                    <div className="bg-[var(--surface)] rounded-xl px-6 py-5" style={{ border: '1px solid var(--border-subtle)' }}>
                                        <p className="text-xs font-mono text-[var(--muted)] mb-3 uppercase tracking-wider">Total Pipelines</p>
                                        <p className="text-3xl font-mono font-bold text-[var(--accent)]">{pipelines.length}</p>
                                    </div>
                                    <div className="bg-[var(--surface)] rounded-xl px-6 py-5" style={{ border: '1px solid var(--border-subtle)' }}>
                                        <p className="text-xs font-mono text-[var(--muted)] mb-3 uppercase tracking-wider">Providers</p>
                                        <p className="text-3xl font-mono font-bold text-emerald-500">{new Set(pipelines.map(p => p.provider)).size}</p>
                                    </div>
                                    <div className="bg-[var(--surface)] rounded-xl px-6 py-5" style={{ border: '1px solid var(--border-subtle)' }}>
                                        <p className="text-xs font-mono text-[var(--muted)] mb-3 uppercase tracking-wider">Repository</p>
                                        <p className="text-sm font-mono font-bold text-[var(--foreground-soft)] truncate">
                                            {repositoryInfo?.owner}/{repositoryInfo?.repo || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                {/* Pipelines Table */}
                                <div className="bg-[var(--surface)] rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
                                    <div className="px-6 py-4 bg-[var(--muted-bg)]" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                        <p className="text-xs font-mono text-[var(--muted)] uppercase tracking-wider">CI/CD Pipeline Configurations</p>
                                    </div>

                                    <div className="grid grid-cols-[2fr_1.5fr_2fr] px-6 py-3 bg-[var(--muted-bg)]" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                        <span className="text-xs font-mono text-[var(--muted)] uppercase tracking-wider">File Path</span>
                                        <span className="text-xs font-mono text-[var(--muted)] uppercase tracking-wider">Provider</span>
                                        <span className="text-xs font-mono text-[var(--muted)] uppercase tracking-wider">Type</span>
                                    </div>

                                    {pipelines.map((pipeline, i) => (
                                        <div
                                            key={i}
                                            className="grid grid-cols-[2fr_1.5fr_2fr] px-6 py-4 hover:bg-[var(--muted-bg)] transition-colors"
                                            style={i < pipelines.length - 1 ? { borderBottom: '1px solid var(--border-subtle)' } : {}}
                                        >
                                            <div className="flex items-center gap-3">
                                                <svg className="w-4 h-4 text-[var(--muted)] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M5.5 13a3 3 0 01.369-1.495 2 2 0 00-1.64-3.365 2 2 0 00-3.496 3.364A3 3 0 005.5 13m11.979-1.11a6 6 0 10-12.958 0 6 6 0 0012.958 0z" />
                                                </svg>
                                                <span className="font-mono text-sm text-[var(--foreground-soft)] truncate" title={pipeline.path}>
                                                    {pipeline.path}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getProviderColor(pipeline.provider)}`}>
                                                    {pipeline.provider}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="font-mono text-sm text-[var(--muted)]">{pipeline.type}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Info */}
                                <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl px-6 py-4">
                                    <p className="text-xs font-mono text-blue-500/70">
                                        💡 Tip: Select a pipeline configuration to view details, edit, or analyze its workflow triggers and jobs.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Empty State */}
                        {!loading && !error && pipelines.length === 0 && (
                            <div className="text-center py-12">
                                <div className="mb-4">
                                    <svg className="w-12 h-12 text-[var(--muted)] mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <p className="text-[var(--muted)] font-mono text-sm mb-4">No CI/CD pipelines detected</p>
                                <p className="text-[var(--muted-soft)] font-mono text-xs max-w-sm mx-auto">
                                    This repository doesn't appear to have any CI/CD pipeline configurations. Consider adding GitHub Actions, GitLab CI, or another CI provider to automate your testing and deployment.
                                </p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
