// if you are design an analytical database, you should denormalize it

import type { TestRun, Agent } from '@/types/nova';

const BASE = '/api/sb';

// ── Test Runs ────────────────────────────────────────────────────────────────

export async function getTestRuns(repositoryId: string): Promise<TestRun[]> {
    const res = await fetch(`${BASE}?resource=test-runs&repository_id=${encodeURIComponent(repositoryId)}`);
    if (!res.ok) throw new Error((await res.json()).error ?? 'Failed to fetch test runs');
    return res.json();
}

export async function getTestRun(id: string): Promise<TestRun> {
    const res = await fetch(`${BASE}?resource=test-runs&id=${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error((await res.json()).error ?? 'Failed to fetch test run');
    return res.json();
}

export async function saveTestRun(repositoryId: string, testRun: TestRun): Promise<TestRun> {
    const res = await fetch(BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save-test-run', repository_id: repositoryId, testRun }),
    });
    if (!res.ok) throw new Error((await res.json()).error ?? 'Failed to save test run');
    return res.json();
}

export async function deleteTestRun(id: string): Promise<void> {
    const res = await fetch(BASE, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete-test-run', id }),
    });
    if (!res.ok) throw new Error((await res.json()).error ?? 'Failed to delete test run');
}

// ── Agents ───────────────────────────────────────────────────────────────────

export async function getAgents(repositoryId: string): Promise<Agent[]> {
    const res = await fetch(`${BASE}?resource=agents&repository_id=${encodeURIComponent(repositoryId)}`);
    if (!res.ok) throw new Error((await res.json()).error ?? 'Failed to fetch agents');
    return res.json();
}

export async function getAgent(id: string): Promise<Agent> {
    const res = await fetch(`${BASE}?resource=agents&id=${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error((await res.json()).error ?? 'Failed to fetch agent');
    return res.json();
}

export async function saveAgent(repositoryId: string, agent: Agent): Promise<Agent> {
    const res = await fetch(BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save-agent', repository_id: repositoryId, agent }),
    });
    if (!res.ok) throw new Error((await res.json()).error ?? 'Failed to save agent');
    return res.json();
}

export async function deleteAgent(id: string): Promise<void> {
    const res = await fetch(BASE, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete-agent', id }),
    });
    if (!res.ok) throw new Error((await res.json()).error ?? 'Failed to delete agent');
}

