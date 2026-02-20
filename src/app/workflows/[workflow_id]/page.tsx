'use client';

import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { useParams } from 'next/navigation';
import { useState } from 'react';

interface Step {
    id: string;
    name: string;
    status: 'success' | 'error' | 'pending' | 'running';
    output?: string;
    duration?: number;
    logs?: string[];
}

export default function WorkflowRunPage() {
    const params = useParams();
    const workflowId = params.workflow_id as string;
    const [expandedSteps, setExpandedSteps] = useState<string[]>([]);

    // Mock data - replace with actual API call
    const [steps] = useState<Step[]>([
        {
            id: '1',
            name: 'Initialize workflow',
            status: 'success',
            duration: 1200,
            logs: [
                'Initializing workflow engine...',
                'Loading configuration files',
                'Validating schema',
                '✓ Workflow initialized successfully'
            ]
        },
        {
            id: '2',
            name: 'Fetch data from API',
            status: 'success',
            duration: 2500,
            logs: [
                'Connecting to API endpoint: https://api.example.com',
                'Authentication successful',
                'Fetching data from /users endpoint',
                'Retrieved 1,250 records',
                '✓ Data fetch completed'
            ]
        },
        {
            id: '3',
            name: 'Process data',
            status: 'success',
            duration: 3200,
            logs: [
                'Starting data processing pipeline',
                'Filtering records by criteria',
                'Transforming data format',
                'Aggregating results',
                'Generated 42 processed records',
                '✓ Data processing completed'
            ]
        },
        {
            id: '4',
            name: 'Generate report',
            status: 'running',
            duration: 0,
            logs: [
                'Initializing report generator',
                'Building report structure',
                'Applying formatting...'
            ]
        },
        {
            id: '5',
            name: 'Send notification',
            status: 'pending',
            duration: 0,
            logs: []
        },
    ]);

    const toggleStep = (stepId: string) => {
        setExpandedSteps((prev) =>
            prev.includes(stepId)
                ? prev.filter((id) => id !== stepId)
                : [...prev, stepId]
        );
    };

    const getStatusIcon = (status: Step['status']) => {
        switch (status) {
            case 'success':
                return (
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                );
            case 'error':
                return (
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </div>
                );
            case 'running':
                return (
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center animate-spin">
                        <div className="w-3 h-3 rounded-full border-2 border-blue-300 border-t-blue-600"></div>
                    </div>
                );
            case 'pending':
                return (
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    </div>
                );
        }
    };

    const getStatusColor = (status: Step['status']) => {
        switch (status) {
            case 'success':
                return 'text-green-600';
            case 'error':
                return 'text-red-600';
            case 'running':
                return 'text-blue-600';
            case 'pending':
                return 'text-gray-400';
        }
    };

    const formatDuration = (ms: number) => {
        if (ms === 0) return '';
        const seconds = Math.round(ms / 1000);
        return `${seconds}s`;
    };

    const isExpanded = (stepId: string) => expandedSteps.includes(stepId);

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="overflow-y-scroll flex-1 flex flex-col overflow-hidden bg-gray-50">
                {/* Topbar Card */}
                <div className="p-4">
                    <Topbar />
                </div>

                {/* Main Content Card */}
                <main className="flex-1 p-4">
                    <div className="bg-white rounded-2xl shadow-lg p-8 h-full overflow-y-auto">
                        <div className="max-w-4xl mx-auto">
                            {/* Header */}
                            <div className="mb-8">
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                    Workflow: {workflowId}
                                </h1>
                                <p className="text-gray-500">
                                    Run completed • Started 2 minutes ago
                                </p>
                            </div>

                            {/* Steps List */}
                            <div className="space-y-4">
                                {steps.map((step, index) => (
                                    <div
                                        key={step.id}
                                        className="border border-gray-200 rounded-lg overflow-hidden"
                                    >
                                        <button
                                            onClick={() => toggleStep(step.id)}
                                            className="w-full p-6 hover:bg-gray-50 transition-colors text-left flex items-start justify-between"
                                        >
                                            <div className="flex items-start gap-4 flex-1">
                                                {/* Status Icon */}
                                                {getStatusIcon(step.status)}

                                                {/* Step Info */}
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                            {step.name}
                                                        </h3>
                                                        <span className={`text-sm font-medium ${getStatusColor(step.status)}`}>
                                                            {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                {/* Duration */}
                                                {step.duration && step.duration > 0 && (
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-500">
                                                            {formatDuration(step.duration)}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Expand Icon */}
                                                <svg
                                                    className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded(step.id) ? 'rotate-180' : ''}`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                                </svg>
                                            </div>
                                        </button>

                                        {/* Terminal Output */}
                                        {isExpanded(step.id) && (
                                            <div className="border-t border-gray-200 bg-gray-100 p-6">
                                                <div className="font-mono text-sm text-gray-600 space-y-1">
                                                    {step.logs && step.logs.length > 0 ? (
                                                        step.logs.map((log, logIndex) => (
                                                            <div key={logIndex}>
                                                                {log}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="text-gray-400">No output available</div>
                                                    )}
                                                </div>

                                                {/* Progress Bar for Running Step */}
                                                {step.status === 'running' && (
                                                    <div className="mt-4 h-1 bg-gray-300 rounded-full overflow-hidden">
                                                        <div className="bg-blue-500 h-full rounded-full animate-pulse" style={{ width: '45%' }}></div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Summary */}
                            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                                <h3 className="font-semibold text-green-900 mb-2">Workflow Status</h3>
                                <p className="text-green-700">
                                    3 of 5 steps completed successfully. 1 step currently running.
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
