import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Palette, Sparkles, Check } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ICONS = {
    dark: Moon,
    light: Sun,
    cyberpunk: Sparkles,
    glass: Palette,
};

const ThemeSwitcher = () => {
    const { theme, setTheme, themes } = useTheme();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const onClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, []);

    const Current = ICONS[theme] || Palette;

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((o) => !o)}
                aria-label="Change theme"
                className="p-2.5 rounded-full border border-white/10 hover:border-secondary text-secondary hover:scale-110 transition-all"
            >
                <Current className="w-5 h-5" />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-48 p-2 z-[60] rounded-2xl border border-white/15 bg-[#0d0d14]/95 backdrop-blur-xl shadow-2xl"
                    >
                        <p className="px-3 py-2 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Theme</p>
                        {themes.map((t) => {
                            const Icon = ICONS[t.id] || Palette;
                            const active = theme === t.id;
                            return (
                                <button
                                    key={t.id}
                                    onClick={() => { setTheme(t.id); setOpen(false); }}
                                    className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                                        active ? 'bg-secondary/15 text-secondary' : 'hover:bg-white/5'
                                    }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <Icon className="w-4 h-4" /> {t.label}
                                    </span>
                                    {active && <Check className="w-4 h-4" />}
                                </button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ThemeSwitcher;
