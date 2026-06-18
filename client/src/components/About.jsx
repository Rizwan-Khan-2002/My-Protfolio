import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Award, Briefcase, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import API from '../services/api';
import { mergeProfile } from '../data/profileDefaults';

const About = () => {
    const [resumeUrl, setResumeUrl] = useState('/resume.pdf');
    const [profile, setProfile] = useState(mergeProfile(null));
    const photoRef = useRef(null);
    const stageRef = useRef(null);

    // GSAP: gentle floating + entrance for the cutout photo.
    useEffect(() => {
        if (!photoRef.current) return;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const ctx = gsap.context(() => {
            gsap.fromTo(photoRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
            if (!reduce) {
                gsap.to(photoRef.current, { y: '+=16', duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
            }
        }, stageRef);
        return () => ctx.revert();
    }, [profile.photoUrl]);

    // Mouse-driven 3D tilt for the photo stage.
    const handleTilt = (e) => {
        const el = stageRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(el, { rotateY: px * 18, rotateX: -py * 18, duration: 0.5, ease: 'power2.out', transformPerspective: 900, transformOrigin: 'center' });
    };
    const resetTilt = () => { if (stageRef.current) gsap.to(stageRef.current, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power2.out' }); };

    useEffect(() => {
        let active = true;
        API.get('/resume')
            .then(({ data }) => { if (active && data?.resumeUrl) setResumeUrl(data.resumeUrl); })
            .catch(() => { /* keep fallback */ });
        API.get('/profile')
            .then(({ data }) => { if (active) setProfile(mergeProfile(data)); })
            .catch(() => { /* keep defaults */ });
        return () => { active = false; };
    }, []);

    const stats = [
        { label: 'Years Experience', value: profile.stats.experienceYears, icon: Briefcase },
        { label: 'Projects Completed', value: profile.stats.projectsCompleted, icon: CheckCircle2 },
        { label: 'Happy Clients', value: profile.stats.happyClients, icon: Award },
    ];

    return (
        <section id="about" className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Image / Visual Side — floating cutout with GSAP 3D tilt */}
                    <div
                        className="lg:w-1/2 w-full flex justify-center"
                        onMouseMove={handleTilt}
                        onMouseLeave={resetTilt}
                        style={{ perspective: '1000px' }}
                    >
                        <div ref={stageRef} className="relative w-full max-w-sm sm:max-w-md aspect-[4/5]" style={{ transformStyle: 'preserve-3d' }}>
                            {/* animated gradient blobs / rings behind */}
                            <div className="absolute inset-6 rounded-[42%] bg-gradient-to-br from-secondary/40 to-accent/40 blur-3xl animate-pulse-slow" />
                            <div className="absolute inset-0 rounded-[45%] border border-white/10 animate-float" />
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-6 bg-black/40 blur-2xl rounded-full" />

                            {/* badge */}
                            <div className="absolute -right-2 sm:right-2 top-6 z-20 glass-card px-4 py-2 text-center">
                                <p className="text-lg font-black gradient-text leading-none">MERN</p>
                                <p className="text-[9px] uppercase tracking-widest text-white/50">Developer</p>
                            </div>

                            {/* the photo */}
                            <img
                                ref={photoRef}
                                src="/profile-cutout.png"
                                alt={profile.name}
                                className="relative z-10 w-full h-full object-contain object-bottom drop-shadow-[0_25px_40px_rgba(0,0,0,0.5)]"
                            />
                        </div>
                    </div>

                    {/* Content Side */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:w-1/2"
                    >
                        <h4 className="text-secondary font-orbitron tracking-widest uppercase mb-4">About Me</h4>
                        <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                            I build scalable applications for the <span className="gradient-text">Future.</span>
                        </h2>
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                            {profile.bio}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                            {stats.map((stat, i) => (
                                <div key={i} className="glass-card p-6 text-center group hover:border-secondary/50 transition-colors">
                                    <stat.icon className="w-8 h-8 text-secondary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                                    <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                                    <p className="text-gray-500 text-xs uppercase tracking-wider">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" download className="btn-primary inline-flex items-center gap-2">
                                <Download size={18} /> Download Resume
                            </a>
                            <Link to="/about-me" className="btn-outline inline-flex items-center gap-2">
                                Know More
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;
