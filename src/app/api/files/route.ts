import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

/**
 * POST /api/files
 * Routes file operations (upload, download) to the backend
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action = 'upload', ...payload } = body;

        // Valid actions: upload, download
        const validActions = ['upload', 'download'];
        if (!validActions.includes(action)) {
            return NextResponse.json(
                { error: `Invalid action. Must be one of: ${validActions.join(', ')}` },
                { status: 400 }
            );
        }

        // Proxy to Python backend
        const response = await fetch(`${BACKEND_URL}/api/files/${action}`, {
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
            { error: error instanceof Error ? error.message : 'Failed to process file operation' },
            { status: 500 }
        );
    }
}

/**
 * GET /api/files/:fileId
 * Retrieve a previously downloaded file
 */
export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const fileId = url.pathname.split('/').pop();

        if (!fileId) {
            return NextResponse.json(
                { error: 'File ID is required' },
                { status: 400 }
            );
        }

        // Proxy to Python backend
        const response = await fetch(`${BACKEND_URL}/api/files/download/${fileId}`, {
            method: 'GET',
            headers: {
                'Accept': '*/*',
            },
        });

        if (!response.ok) {
            const error = await response.text();
            return NextResponse.json(
                { error: error || 'File not found' },
                { status: response.status }
            );
        }

        // Return file as download
        const buffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'application/octet-stream';
        const contentDisposition = response.headers.get('content-disposition') || `attachment; filename="${fileId}"`;

        return new Response(buffer, {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': contentDisposition,
            },
        });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to retrieve file' },
            { status: 500 }
        );
    }
}
