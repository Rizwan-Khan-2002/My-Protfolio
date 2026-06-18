import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Download, Mail, MapPin, Phone, Github, Linkedin, Twitter,
    MessageSquare, Globe, GraduationCap, Briefcase, FolderKanban, Sparkles,
} from 'lucide-react';
import API from '../services/api';
import { mergeProfile } from '../data/profileDefaults';
import ParticleField from '../components/ParticleField';
import TiltCard from '../components/TiltCard';
import useScrollReveal from '../hooks/useScrollReveal';

const AboutPage = () => {
    const [profile, setProfile] = useState(mergeProfile(null));
    const [resumeUrl, setResumeUrl] = useState('/resume.jpg');
    const [projectCount, setProjectCount] = useState(null);
    const revealRef = useScrollReveal('.reveal', { y: 40, stagger: 0.06 });

    useEffect(() => {
        window.scrollTo(0, 0);
        let active = true;
        API.get('/profile').then(({ data }) => { if (active) setProfile(mergeProfile(data)); }).catch(() => {});
        API.get('/resume').then(({ data }) => { if (active && data?.resumeUrl) setResumeUrl(data.resumeUrl); }).catch(() => {});
        API.get('/projects').then(({ data }) => { if (active && Array.isArray(data)) setProjectCount(data.length); }).catch(() => {});
        return () => { active = false; };
    }, []);

    const initials = (profile.name || 'RK').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

    const socialItems = [
        { key: 'github', icon: Github, url: profile.socials?.github },
        { key: 'linkedin', icon: Linkedin, url: profile.socials?.linkedin },
        { key: 'whatsapp', icon: MessageSquare, url: profile.socials?.whatsapp },
        { key: 'twitter', icon: Twitter, url: profile.socials?.twitter },
        { key: 'website', icon: Globe, url: profile.socials?.website },
    ].filter((s) => s.url);

    const stats = [
        { label: 'Years Experience', value: profile.stats?.experienceYears },
        { label: 'Projects', value: projectCount != null ? `${projectCount}` : profile.stats?.projectsCompleted },
        { label: 'Happy Clients', value: profile.stats?.happyClients },
    ];

    return (
        <div ref={revealRef} className="relative min-h-screen overflow-hidden pt-28 sm:pt-32 pb-24">
            {/* Background particles + glows */}
            <div className="absolute inset-0 -z-10 opacity-40 pointer-events-none"><ParticleField count={45} /></div>
            <div className="hero-glow bg-secondary/20 top-20 -left-32 w-[480px] h-[480px]" />
            <div className="hero-glow bg-accent/20 bottom-20 -right-32 w-[480px] h-[480px]" />

            <div className="container mx-auto px-5 sm:px-6 max-w-6xl">
                <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-accent transition-colors mb-10 group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
                </Link>

                {/* ===== HERO: photo + intro ===== */}
                <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16 items-center mb-20 sm:mb-28">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7 }}
                        className="reveal order-1 lg:order-none mx-auto w-full max-w-xs sm:max-w-sm"
                    >
                        <TiltCard max={12}>
                            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-2xl tilt-inner">
                                <div className="absolute -inset-1 bg-gradient-to-br from-secondary/40 to-accent/40 blur-2xl -z-10" />
                                {profile.photoUrl ? (
                                    <img src={profile.photoUrl} alt={profile.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-secondary/20 to-accent/10">
                                        <span className="text-7xl font-black gradient-text">{initials}</span>
                                        <span className="mt-3 text-xs uppercase tracking-[0.3em] text-white/40">Upload photo in dashboard</span>
                                    </div>
                                )}
                            </div>
                        </TiltCard>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                    >
                        {profile.available && (
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 rounded-full bg-white/5 border border-white/10 text-accent text-xs uppercase tracking-widest font-bold">
                                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" /> Available for work
                            </div>
                        )}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black italic uppercase tracking-tighter mb-3">
                            {profile.name}
                        </h1>
                        <p className="text-accent font-orbitron tracking-widest uppercase text-sm mb-6">{profile.title}</p>
                        <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-8">{profile.bio}</p>

                        <div className="flex flex-wrap gap-4">
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" download
                                className="btn-primary inline-flex items-center gap-2">
                                <Download size={18} /> Download Resume
                            </a>
                            <Link to="/#contact" className="btn-outline inline-flex items-center gap-2">
                                <Mail size={18} /> Contact Me
                            </Link>
                        </div>

                        {socialItems.length > 0 && (
                            <div className="flex gap-3 mt-8">
                                {socialItems.map(({ key, icon: Icon, url }) => (
                                    <a key={key} href={url} target="_blank" rel="noopener noreferrer"
                                        className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-accent hover:border-accent transition-all">
                                        <Icon size={18} />
                                    </a>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* ===== STATS ===== */}
                <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-20 sm:mb-28">
                    {stats.map((s, i) => (
                        <div key={i} className="reveal glass-card p-5 sm:p-8 text-center">
                            <h3 className="text-3xl sm:text-5xl font-black gradient-text mb-1">{s.value}</h3>
                            <p className="text-[10px] sm:text-xs uppercase tracking-widest text-white/50">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* ===== CONTACT INFO ===== */}
                <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mb-20 sm:mb-28">
                    {[
                        { icon: Mail, label: 'Email', value: profile.email },
                        { icon: Phone, label: 'Phone', value: profile.phone },
                        { icon: MapPin, label: 'Location', value: profile.location },
                    ].filter((c) => c.value).map((c, i) => (
                        <div key={i} className="reveal glass-card p-5 flex items-center gap-4">
                            <div className="w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                                <c.icon size={18} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{c.label}</p>
                                <p className="text-sm font-medium break-words">{c.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ===== SKILLS ===== */}
                <SectionHeading icon={Sparkles} kicker="Expertise" title="Skills" />
                <div className="grid sm:grid-cols-2 gap-5 sm:gap-6 mb-20 sm:mb-28">
                    {profile.skills.map((skill, i) => (
                        <div key={i} className="reveal glass-card p-5">
                            <div className="flex justify-between items-center mb-3">
                                <span className="font-orbitron font-bold text-sm sm:text-base">{skill.name}</span>
                                <span className="text-xs font-mono text-white/40">{skill.level}%</span>
                            </div>
                            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }}
                                    viewport={{ once: true }} transition={{ duration: 1 }}
                                    className="h-full bg-gradient-to-r from-secondary to-accent"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* ===== EXPERIENCE ===== */}
                <SectionHeading icon={Briefcase} kicker="Journey" title="Experience" />
                <Timeline items={profile.experience} primary="role" secondary="company" />

                {/* ===== EDUCATION ===== */}
                <div className="mt-20 sm:mt-28">
                    <SectionHeading icon={GraduationCap} kicker="Background" title="Education" />
                    <Timeline items={profile.education} primary="degree" secondary="institution" />
                </div>

                {/* ===== PROJECTS CTA ===== */}
                <div className="reveal glass-card p-8 sm:p-12 mt-20 sm:mt-28 text-center">
                    <FolderKanban className="w-10 h-10 text-secondary mx-auto mb-4" />
                    <h3 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tighter mb-3">See my work</h3>
                    <p className="text-white/60 mb-6 max-w-xl mx-auto">
                        {projectCount != null ? `${projectCount} projects` : 'Projects'} across Beginner, Intermediate and Advanced levels.
                    </p>
                    <Link to="/#projects" className="btn-primary inline-flex items-center gap-2">
                        Explore Projects
                    </Link>
                </div>
            </div>
        </div>
    );
};

const SectionHeading = ({ icon: Icon, kicker, title }) => (
    <div className="reveal mb-8 sm:mb-10">
        <h4 className="text-accent font-orbitron tracking-[0.4em] uppercase text-xs font-black mb-2 flex items-center gap-2">
            <Icon size={14} /> {kicker}
        </h4>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black italic uppercase tracking-tighter">{title}</h2>
    </div>
);

const Timeline = ({ items, primary, secondary }) => {
    if (!items?.length) return <p className="text-white/40">No entries yet.</p>;
    return (
        <div className="relative border-l-2 border-white/10 ml-3 space-y-8">
            {items.map((item, i) => (
                <div key={i} className="reveal relative pl-8">
                    <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-gradient-to-br from-secondary to-accent border-2 border-primary" />
                    <div className="glass-card p-5 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                            <h3 className="text-lg sm:text-xl font-bold">{item[primary]}</h3>
                            {item.period && (
                                <span className="text-[10px] uppercase tracking-widest text-accent font-bold shrink-0">{item.period}</span>
                            )}
                        </div>
                        {item[secondary] && <p className="text-secondary text-sm font-semibold mb-2">{item[secondary]}</p>}
                        {item.description && <p className="text-white/60 text-sm leading-relaxed">{item.description}</p>}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AboutPage;
