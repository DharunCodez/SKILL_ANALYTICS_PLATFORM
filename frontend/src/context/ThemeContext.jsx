import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

const DEFAULT_APPEARANCE = {
    theme: 'dark',
    compactMode: false,
    showCharts: true,
};

export const ThemeProvider = ({ children }) => {
    const [appearance, setAppearance] = useState(() => {
        try {
            const saved = localStorage.getItem('appearancePrefs');
            return saved ? { ...DEFAULT_APPEARANCE, ...JSON.parse(saved) } : DEFAULT_APPEARANCE;
        } catch {
            return DEFAULT_APPEARANCE;
        }
    });

    // Apply theme class to <html> element whenever theme changes
    useEffect(() => {
        const root = document.documentElement;

        // Resolve effective theme
        let effectiveTheme = appearance.theme;
        if (effectiveTheme === 'system') {
            effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        // Set theme class
        root.classList.remove('theme-dark', 'theme-light');
        root.classList.add(`theme-${effectiveTheme}`);

        // Set compact mode class
        if (appearance.compactMode) {
            root.classList.add('compact-mode');
        } else {
            root.classList.remove('compact-mode');
        }

        // Listen for system theme changes when 'system' is selected
        if (appearance.theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handler = (e) => {
                root.classList.remove('theme-dark', 'theme-light');
                root.classList.add(e.matches ? 'theme-dark' : 'theme-light');
            };
            mediaQuery.addEventListener('change', handler);
            return () => mediaQuery.removeEventListener('change', handler);
        }
    }, [appearance.theme, appearance.compactMode]);

    const updateAppearance = (newAppearance) => {
        setAppearance(newAppearance);
        localStorage.setItem('appearancePrefs', JSON.stringify(newAppearance));
    };

    return (
        <ThemeContext.Provider value={{ appearance, updateAppearance }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;
