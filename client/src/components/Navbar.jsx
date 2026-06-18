import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Rocket, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ThemeSwitcher from './ThemeSwitcher';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user, isAdmin, logout } = useAuth();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/#about' },
        { name: 'Skills', path: '/#skills' },
        { name: 'Projects', path: '/#projects' },
        { name: 'Contact', path: '/#contact' },
    ];

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-primary/80 backdrop-blur-lg border-b border-white/10 py-4' : 'bg-transparent py-6'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2 group">
                    <Rocket className="w-8 h-8 text-secondary group-hover:rotate-45 transition-transform duration-300" />
                    <span className="text-2xl font-orbitron font-bold gradient-text">RK.</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <a key={link.name} href={link.path} className="text-gray-300 hover:text-white transition-colors duration-300 font-medium">
                            {link.name}
                        </a>
                    ))}
                    {user ? (
                        <div className="flex items-center space-x-4">
                            {isAdmin && (
                                <Link to="/dashboard" className="flex items-center space-x-2 text-secondary hover:text-secondary-light font-semibold">
                                    <User className="w-5 h-5" />
                                    <span>Dashboard</span>
                                </Link>
                            )}
                            <button onClick={logout} className="text-gray-400 hover:text-white transition-colors" aria-label="Log out">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn-primary text-sm py-2 px-6">Login</Link>
                    )}
                    <ThemeSwitcher />
                </div>

                {/* Mobile actions */}
                <div className="md:hidden flex items-center gap-2">
                    <ThemeSwitcher />
                    <button className="text-white" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
                        {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden absolute top-full left-0 w-full bg-primary/95 backdrop-blur-xl border-b border-white/10 py-8 px-6 space-y-6"
                    >
                        {navLinks.map((link) => (
                            <a 
                                key={link.name} 
                                href={link.path} 
                                className="block text-xl font-orbitron hover:text-secondary transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </a>
                        ))}
                        {user ? (
                            <div className="pt-6 border-t border-white/10 space-y-4">
                                {isAdmin && (
                                    <Link to="/dashboard" className="block text-secondary text-xl font-semibold" onClick={() => setIsOpen(false)}>Dashboard</Link>
                                )}
                                <button onClick={() => { logout(); setIsOpen(false); }} className="block text-gray-400 text-xl">Logout</button>
                            </div>
                        ) : (
                            <Link to="/login" className="block btn-primary text-center" onClick={() => setIsOpen(false)}>Login</Link>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
