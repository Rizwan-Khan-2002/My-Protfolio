import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const THEMES = [
    { id: 'dark', label: 'Dark' },
    { id: 'light', label: 'Light' },
    { id: 'cyberpunk', label: 'Cyberpunk' },
    { id: 'glass', label: 'Glassmorphism' },
];

const VALID = THEMES.map((t) => t.id);

const getInitialTheme = () => {
    try {
        const saved = localStorage.getItem('theme');
        if (saved && VALID.includes(saved)) return saved;
    } catch { /* ignore */ }
    return 'dark';
};

export const ThemeProvider = ({ children }) => {
    const [theme, setThemeState] = useState(getInitialTheme);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        try {
            localStorage.setItem('theme', theme);
        } catch { /* ignore */ }
    }, [theme]);

    const setTheme = (id) => {
        if (VALID.includes(id)) setThemeState(id);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
