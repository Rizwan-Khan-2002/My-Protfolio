import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Github, Linkedin, User } from 'lucide-react';
import ParticleField from './ParticleField';

const Hero = () => {
    const heroRef = useRef(null);

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

            {/* Animated particle field */}
            <div className="absolute inset-0 z-0 opacity-60 pointer-events-none">
                <ParticleField count={55} />
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
                    <a href="#about" className="px-10 py-5 bg-accent text-white font-black uppercase text-sm tracking-widest hover:bg-white hover:text-black transition-all transform hover:-translate-y-1 active:scale-95 shadow-[0_20px_40px_rgba(99,102,241,0.2)] flex items-center gap-2">
                        <User size={18} /> About Me
                    </a>
                    <a href="#contact" className="px-10 py-5 bg-transparent border-2 border-white/20 text-white font-black uppercase text-sm tracking-widest hover:border-accent hover:text-accent transition-all transform hover:-translate-y-1 active:scale-95">
                        Build Together
                    </a>
                </div>

                <div className="mt-20 flex flex-col items-center gap-4">
                    <div className="flex items-center justify-center space-x-12 text-white/30">
                        <a href="https://github.com/Rizwan-Khan-2002" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors"><Github className="w-6 h-6" /></a>
                        <a href="https://www.linkedin.com/in/rizwankhan8756" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors"><Linkedin className="w-6 h-6" /></a>
                        <a href="https://wa.me/918009030734" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.431 5.631 1.432h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                        </a>
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
