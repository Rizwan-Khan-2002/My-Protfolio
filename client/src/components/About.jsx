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

    // GSAP: entrance for the circular photo (float handled via CSS so the
    // image never shifts inside the clipped circle).
    useEffect(() => {
        if (!photoRef.current) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(photoRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1, ease: 'power3.out' });
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
                        <div ref={stageRef} className="relative w-full max-w-[280px] sm:max-w-sm aspect-square" style={{ transformStyle: 'preserve-3d' }}>
                            {/* glow behind the circle */}
                            <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-secondary/40 to-accent/30 blur-3xl animate-pulse-slow" />
                            {/* slow rotating dashed ring */}
                            <div className="absolute -inset-2 rounded-full border border-dashed border-white/15" style={{ animation: 'spin 22s linear infinite' }} />

                            {/* the circular photo — fills the circle */}
                            <div className="absolute inset-0 rounded-full overflow-hidden border-2 border-white/15 shadow-2xl animate-float bg-gradient-to-br from-secondary/25 to-primary">
                                <img
                                    ref={photoRef}
                                    src="/profile-cutout.png"
                                    alt={profile.name}
                                    className="w-full h-full object-cover"
                                    style={{ objectPosition: '50% 12%' }}
                                />
                            </div>

                            {/* name tag — slides in from the left */}
                            <motion.div
                                initial={{ opacity: 0, x: -60 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
                                className="absolute bottom-8 left-0 sm:-left-6 z-20 glass-card px-5 py-3 border-l-4 border-l-secondary"
                            >
                                <p className="text-[10px] uppercase tracking-[0.25em] text-accent font-bold flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> Rizwan Here
                                </p>
                                <p className="text-lg font-black gradient-text leading-tight">MERN Developer</p>
                            </motion.div>
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
