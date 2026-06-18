import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Award, Briefcase, Zap, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { mergeProfile } from '../data/profileDefaults';

const About = () => {
    const [resumeUrl, setResumeUrl] = useState('/resume.jpg');
    const [profile, setProfile] = useState(mergeProfile(null));

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
                    {/* Image / Visual Side */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:w-1/2 relative group"
                    >
                        <div className="w-full aspect-square max-w-md mx-auto relative cursor-pointer">
                            <div className="absolute inset-0 bg-secondary/20 rounded-3xl rotate-6 group-hover:rotate-12 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-accent/20 rounded-3xl -rotate-6 group-hover:-rotate-12 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl flex items-center justify-center p-8 overflow-hidden">
                                <Zap className="w-32 h-32 text-secondary opacity-20 absolute top-0 right-0 -translate-y-1/2 translate-x-1/2" />
                                <div className="text-center">
                                    <h3 className="text-6xl font-black mb-2 gradient-text">MERN</h3>
                                    <p className="text-gray-400 font-orbitron tracking-widest uppercase text-sm">Stack Specialist</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

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
