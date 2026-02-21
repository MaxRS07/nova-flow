'use client';

import { usePathname } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';

interface RouteWrapperProps {
    children: React.ReactNode;
}

export default function RouteWrapper({ children }: RouteWrapperProps) {
    const pathname = usePathname();
    const isAuthPage = pathname === '/auth';

    // Only apply ProtectedRoute to non-auth pages
    if (isAuthPage) {
        return <>{children}</>;
    }

    return <ProtectedRoute>{children}</ProtectedRoute>;
}
