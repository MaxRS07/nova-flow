import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

/**
 * POST /api/browser
 * Routes browser automation requests to the backend
 * 
 * Supported actions: act, extract, screenshot
 * 
 * Example requests:
 * - { action: 'act', url: 'https://example.com', prompt: 'Click login button' }
 * - { action: 'extract', url: 'https://example.com', prompt: 'Get all product names', schema: {...} }
 * - { action: 'screenshot', url: 'https://example.com', prompt: 'Navigate to dashboard' }
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action = 'act', ...payload } = body;

        // Valid actions: act, extract, screenshot
        const validActions = ['act', 'extract', 'screenshot'];
        if (!validActions.includes(action)) {
            return NextResponse.json(
                { error: `Invalid action. Must be one of: ${validActions.join(', ')}` },
                { status: 400 }
            );
        }

        // Proxy to Python backend
        const response = await fetch(`${BACKEND_URL}/api/browser/${action}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const error = await response.text();
            return NextResponse.json(
                { error: error || 'Backend request failed' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to process browser action' },
            { status: 500 }
        );
    }
}
