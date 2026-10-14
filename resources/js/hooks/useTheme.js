import { useCallback, useEffect, useState } from 'react';
import {
    applyThemeClass,
    getStoredTheme,
    setThemePreference,
} from '@/lib/theme';

export default function useTheme() {
    const [preference, setPreference] = useState(getStoredTheme);

    const setTheme = useCallback((next) => {
        const value = setThemePreference(next);
        setPreference(value);
    }, []);

    useEffect(() => {
        applyThemeClass(preference);
        if (preference !== 'system') return undefined;

        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const update = () => applyThemeClass('system');
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, [preference]);

    return { preference, setTheme };
}
