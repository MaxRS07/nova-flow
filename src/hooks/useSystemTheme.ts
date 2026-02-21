import { useEffect, useState } from 'react';

export function useSystemTheme() {
    const [isDark, setIsDark] = useState<boolean | null>(null);

    useEffect(() => {
        // Check initial system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDark(prefersDark);

        // Listen for changes in system preference
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            setIsDark(e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return isDark;
}
