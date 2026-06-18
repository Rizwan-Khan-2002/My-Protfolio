import React from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import useScrollReveal from '../hooks/useScrollReveal';

const Home = () => {
    // Reveal each section as it scrolls into view.
    const revealRef = useScrollReveal('.reveal-section', { y: 50, stagger: 0 });

    return (
        <motion.main
            ref={revealRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Hero />
            <div className="reveal-section"><About /></div>
            <div className="reveal-section"><Skills /></div>
            <div className="reveal-section"><Projects /></div>
            <div className="reveal-section"><Contact /></div>
            <Footer />
        </motion.main>
    );
};

export default Home;
