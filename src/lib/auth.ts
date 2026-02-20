import type { AuthResponse, SignupParams, LoginParams } from '@/types/auth';

/**
 * Sign up a new user
 */
export async function signup({ email, password, name }: SignupParams): Promise<AuthResponse> {
    const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'signup',
            email,
            password,
            name,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
    }

    return data;
}

/**
 * Log in an existing user
 */
export async function login({ email, password }: LoginParams): Promise<AuthResponse> {
    const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'login',
            email,
            password,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Login failed');
    }

    return data;
}

/**
 * Log out the current user
 */
export async function logout(): Promise<AuthResponse> {
    const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'logout',
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Logout failed');
    }

    return data;
}