import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

/**
 * POST /api/interact
 * Routes user interaction requests (click, type, search) to the backend
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action = 'click', ...payload } = body;

        // Valid actions: click, type, search
        const validActions = ['click', 'type', 'search'];
        if (!validActions.includes(action)) {
            return NextResponse.json(
                { error: `Invalid action. Must be one of: ${validActions.join(', ')}` },
                { status: 400 }
            );
        }

        // Proxy to Python backend
        const response = await fetch(`${BACKEND_URL}/api/interact/${action}`, {
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
            { error: error instanceof Error ? error.message : 'Failed to process interaction' },
            { status: 500 }
        );
    }
}
