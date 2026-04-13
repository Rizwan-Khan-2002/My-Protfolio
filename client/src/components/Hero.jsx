import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ChevronRight, Github, Linkedin, MousePointer2 } from 'lucide-react';

const Hero = () => {
    const heroRef = useRef(null);
    const glowRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".hero-content > *", {
                y: 100,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power4.out",
            });

            gsap.to(".hero-glow", {
                x: "random(-100, 100)",
                y: "random(-100, 100)",
                duration: 5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });
        }, heroRef);

        return () => ctx.revert();
    }, []);

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const x = (clientX - window.innerWidth / 2) / 20;
        const y = (clientY - window.innerHeight / 2) / 20;
        
        gsap.to(".hero-content", {
            x: x,
            y: y,
            duration: 0.5,
            ease: "power2.out"
        });
    };

    return (
        <section 
            ref={heroRef} 
            onMouseMove={handleMouseMove}
            className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
        >
            {/* 3D Parallax Layers */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="hero-glow bg-secondary/20 blur-[120px] top-1/4 -left-20 w-[500px] h-[500px] rounded-full mix-blend-screen" />
                <div className="hero-glow bg-accent/20 blur-[120px] bottom-1/4 -right-20 w-[500px] h-[500px] rounded-full mix-blend-screen" />
            </div>

            {/* Floating Elements Layer */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-white/20 rounded-full"
                        animate={{
                            y: [0, -100, 0],
                            x: [0, Math.random() * 50 - 25, 0],
                            opacity: [0, 1, 0]
                        }}
                        transition={{
                            duration: 5 + Math.random() * 5,
                            repeat: Infinity,
                            delay: Math.random() * 5
                        }}
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`
                        }}
                    />
                ))}
            </div>
            
            <div className="container mx-auto px-6 relative z-10 hero-content text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                    <span className="text-sm font-medium text-accent tracking-wider uppercase flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        Available for Hire
                    </span>
                </motion.div>

                <h1 className="text-6xl md:text-[120px] font-black mb-6 tracking-tighter leading-[0.9] italic">
                    CRAFTING <br />
                    <span className="gradient-text not-italic">DIGITAL</span> <br />
                    EXPERIENCES.
                </h1>

                <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium uppercase tracking-widest">
                    Rizwan Khan // Full Stack Architect
                </p>

                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                    <a href="#projects" className="px-10 py-5 bg-white text-black font-black uppercase text-sm tracking-widest hover:bg-accent hover:text-white transition-all transform hover:-translate-y-1 active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)]">
                        Explore Projects
                    </a>
                    <a href="#contact" className="px-10 py-5 bg-transparent border-2 border-white/20 text-white font-black uppercase text-sm tracking-widest hover:border-accent hover:text-accent transition-all transform hover:-translate-y-1 active:scale-95">
                        Build Together
                    </a>
                </div>

                <div className="mt-20 flex flex-col items-center gap-4">
                    <div className="flex items-center justify-center space-x-12 text-white/30">
                        <a href="https://github.com/Rizwan-Khan-2002" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors"><Github className="w-6 h-6" /></a>
                        <a href="https://www.linkedin.com/in/rizwankhan8756" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors"><Linkedin className="w-6 h-6" /></a>
                    </div>
                    <motion.div 
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-[10px] uppercase tracking-[0.5em] text-white/20 mt-8"
                    >
                        Scroll to Explore
                    </motion.div>
                </div>
            </div>

            {/* Background Texture Overlay */}
            <div className="absolute inset-0 -z-10 opacity-[0.03] pointer-events-none" 
                style={{ 
                    backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")'
                }} 
            />
        </section>
    );
};

export default Hero;
