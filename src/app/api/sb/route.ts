import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { TestRun, Agent } from '@/types/nova';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration is missing');
}

function getClient() {
    return createClient(supabaseUrl!, supabaseKey!);
}

/**
 * GET /api/sb?resource=test-runs&repository_id=...
 * GET /api/sb?resource=test-runs&id=...
 * GET /api/sb?resource=agents&repository_id=...
 * GET /api/sb?resource=agents&id=...
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const resource = searchParams.get('resource');
    const id = searchParams.get('id');
    const repositoryId = searchParams.get('repository_id');

    if (!resource) {
        return NextResponse.json({ error: 'Missing resource parameter' }, { status: 400 });
    }

    const supabase = getClient();

    if (resource === 'test-runs') {
        if (id) {
            const { data, error } = await supabase
                .from('test_runs')
                .select('*')
                .eq('id', id)
                .single();
            if (error) return NextResponse.json({ error: error.message }, { status: 404 });
            return NextResponse.json(data);
        }
        if (!repositoryId) {
            return NextResponse.json({ error: 'Missing repository_id or id' }, { status: 400 });
        }
        const { data, error } = await supabase
            .from('test_runs')
            .select('*')
            .eq('repository_id', repositoryId)
            .order('timestamp', { ascending: false });
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json(data);
    }

    if (resource === 'agents') {
        if (id) {
            const { data, error } = await supabase
                .from('agents')
                .select('*')
                .eq('id', id)
                .single();
            if (error) return NextResponse.json({ error: error.message }, { status: 404 });
            return NextResponse.json(data);
        }
        if (!repositoryId) {
            return NextResponse.json({ error: 'Missing repository_id or id' }, { status: 400 });
        }
        const { data, error } = await supabase
            .from('agents')
            .select('*')
            .eq('repository_id', repositoryId)
            .order('created', { ascending: false });
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json(data);
    }

    return NextResponse.json({ error: `Unknown resource: ${resource}` }, { status: 400 });
}

/**
 * POST /api/sb
 * Body: { action: 'save-test-run', repository_id, testRun: TestRun }
 * Body: { action: 'save-agent',    repository_id, agent: Agent }
 */
export async function POST(request: Request) {
    let body: { action: string; repository_id?: string; testRun?: TestRun; agent?: Agent };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { action, repository_id } = body;
    if (!action) return NextResponse.json({ error: 'Missing action' }, { status: 400 });
    if (!repository_id) return NextResponse.json({ error: 'Missing repository_id' }, { status: 400 });

    const supabase = getClient();

    if (action === 'save-test-run') {
        const { testRun } = body;
        if (!testRun) return NextResponse.json({ error: 'Missing testRun' }, { status: 400 });

        const row = { ...testRun, repository_id };
        const { data, error } = await supabase
            .from('test_runs')
            .upsert(row, { onConflict: 'id' })
            .select()
            .single();
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json(data, { status: 201 });
    }

    if (action === 'save-agent') {
        const { agent } = body;
        if (!agent) return NextResponse.json({ error: 'Missing agent' }, { status: 400 });

        const row = { ...agent, repository_id };
        const { data, error } = await supabase
            .from('agents')
            .upsert(row, { onConflict: 'id' })
            .select()
            .single();
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json(data, { status: 201 });
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
}

/**
 * DELETE /api/sb
 * Body: { action: 'delete-test-run', id: string }
 * Body: { action: 'delete-agent',    id: string }
 */
export async function DELETE(request: Request) {
    let body: { action: string; id?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { action, id } = body;
    if (!action) return NextResponse.json({ error: 'Missing action' }, { status: 400 });
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const supabase = getClient();

    if (action === 'delete-test-run') {
        const { error } = await supabase.from('test_runs').delete().eq('id', id);
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ success: true });
    }

    if (action === 'delete-agent') {
        const { error } = await supabase.from('agents').delete().eq('id', id);
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
}

