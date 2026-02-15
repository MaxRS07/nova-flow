import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase configuration is missing");
}

/**
 * POST /api/auth
 * Handles login and signup operations based on action parameter
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action, email, password, name } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        const supabase = createClient(supabaseUrl!, supabaseKey!);

        // Handle signup
        if (action === 'signup') {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name: name || null,
                    },
                },
            });

            if (error) {
                return NextResponse.json(
                    { error: error.message },
                    { status: 400 }
                );
            }

            return NextResponse.json({
                message: 'Signup successful',
                user: data.user,
                session: data.session,
            });
        }

        // Handle login
        if (action === 'login') {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                return NextResponse.json(
                    { error: error.message },
                    { status: 401 }
                );
            }

            return NextResponse.json({
                message: 'Login successful',
                user: data.user,
                session: data.session,
            });
        }

        // Handle logout
        if (action === 'logout') {
            const { error } = await supabase.auth.signOut();

            if (error) {
                return NextResponse.json(
                    { error: error.message },
                    { status: 400 }
                );
            }

            return NextResponse.json({ message: 'Logout successful' });
        }

        return NextResponse.json(
            { error: 'Invalid action. Use "signup", "login", or "logout"' },
            { status: 400 }
        );

    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}