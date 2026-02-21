'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const router = useRouter();


    useEffect(() => {
        console.log('Auth state changed:', { user, loading }); // Debug log
        if (!loading && !user) {
            router.push('/auth');
        }
    }, [user, loading, router]);

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[var(--background)]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)] mx-auto mb-4"></div>
                    <p className="text-[var(--muted)] font-mono text-sm">Loading...</p>
                </div>
            </div>
        );
    }

    // Only render children if user is authenticated
    if (!user) {
        return null;
    }

    return <>{children}</>;
}
