export const THEME_STORAGE_KEY = 'eastshan-theme';

export const THEME_OPTIONS = ['light', 'dark', 'system'];

export function getStoredTheme() {
    try {
        const value = localStorage.getItem(THEME_STORAGE_KEY);
        return THEME_OPTIONS.includes(value) ? value : 'system';
    } catch {
        return 'system';
    }
}

export function resolveTheme(preference) {
    if (preference === 'light' || preference === 'dark') {
        return preference;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
}

export function isAdminPath(pathname = window.location.pathname) {
    const path = pathname.split('?')[0];

    return /^\/mongla\/admin(?:\/|$)/.test(path);
}

export function applyThemeClass(preference = getStoredTheme(), pathname) {
    const root = document.documentElement;

    root.classList.remove('light', 'dark');

    if (!isAdminPath(pathname)) {
        root.classList.add('light');
        root.dataset.theme = 'light';

        return 'light';
    }

    const resolved = resolveTheme(preference);

    root.classList.add(resolved);
    root.dataset.theme = preference;

    return resolved;
}

export function setThemePreference(preference) {
    const next = THEME_OPTIONS.includes(preference) ? preference : 'system';

    try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
        // Ignore quota / private-mode failures.
    }

    applyThemeClass(next);

    return next;
}
