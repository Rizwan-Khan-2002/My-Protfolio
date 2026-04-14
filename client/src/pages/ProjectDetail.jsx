import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, Code, Layout, Server } from 'lucide-react';
import API from '../services/api';

const ProjectDetail = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                const { data } = await API.get(`/projects/${id}`);
                setProject(data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching project details:", err);
                setError("Project not found");
                setLoading(false);
            }
        };
        fetchProject();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-2xl font-orbitron animate-pulse gradient-text uppercase tracking-widest">Initializing Project Assets...</div>
        </div>
    );

    if (error || !project) return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-4xl font-black mb-4">404 - LOST IN SPACE</h1>
            <p className="text-gray-400 mb-8">The project you're looking for has drifted beyond the event horizon.</p>
            <Link to="/" className="btn-primary">Return to Base</Link>
        </div>
    );

    return (
        <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
            <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-accent transition-colors mb-8 group">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Projects
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                >
                    <h1 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter">{project.title}</h1>
                    <div className="flex flex-wrap gap-2">
                        {project.techStack?.map((tag, index) => (
                            <span key={index} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-accent font-bold uppercase tracking-widest">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <p className="text-lg text-white/70 leading-relaxed font-light">
                        {project.description}
                    </p>

                    <div className="flex gap-4 pt-4">
                        {project.liveDemo && (
                            <a href={project.liveDemo} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-8 py-4 bg-accent text-white font-black rounded-none hover:shadow-[0_0_30px_#6366f1] transition-all uppercase text-xs tracking-[0.2em]">
                                Live Demo <ExternalLink size={18} />
                            </a>
                        )}
                        {project.githubRepo && (
                            <a href={project.githubRepo} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-8 py-4 bg-white/5 text-white font-black rounded-none border border-white/10 hover:bg-white/10 transition-all uppercase text-xs tracking-[0.2em]">
                                Github <Github size={18} />
                            </a>
                        )}
                    </div>

                    <div className="pt-8 space-y-6">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic scale-x-110 origin-left">Project Metadata</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                                <h3 className="font-bold text-white uppercase tracking-tight mb-2 flex items-center gap-2">
                                    <Trophy size={16} className="text-accent" /> Difficulty Level
                                </h3>
                                <p className="text-sm text-accent font-black uppercase tracking-widest">{project.difficulty}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-8"
                >
                    <div className="aspect-video rounded-3xl overflow-hidden border border-white/10 group shadow-2xl relative">
                        <img 
                            src={project.image || 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?auto=format&fit=crop&q=80&w=2000'} 
                            alt={project.title} 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-accent/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

// Internal icons helper
const Trophy = ({ size, className }) => (
    <svg 
        width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" 
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
    >
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" /><path d="M10 22V8a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v14" />
        <path d="M4.5 9.5c.78.22 1.58.39 2.4.5" /><path d="M17.1 10c.82-.11 1.62-.28 2.4-.5" />
    </svg>
);

    return (
        <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
            <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-accent transition-colors mb-8">
                <ArrowLeft size={20} /> Back to Projects
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                >
                    <h1 className="text-4xl md:text-5xl font-black text-white italic">{project.title}</h1>
                    <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, index) => (
                            <span key={index} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-accent font-bold uppercase">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <p className="text-lg text-white/70 leading-relaxed">
                        {project.description}
                    </p>

                    <div className="flex gap-4 pt-4">
                        <a href={project.demo} className="flex items-center gap-2 px-6 py-3 bg-accent text-white font-bold rounded-full hover:shadow-[0_0_20px_#6366f1] transition-all">
                            Live Demo <ExternalLink size={18} />
                        </a>
                        <a href={project.github} className="flex items-center gap-2 px-6 py-3 bg-white/5 text-white font-bold rounded-full border border-white/10 hover:bg-white/10 transition-all">
                            Github <Github size={18} />
                        </a>
                    </div>

                    <div className="pt-8 space-y-6">
                        <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">Key Features</h2>
                        <ul className="space-y-4">
                            {project.features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-3 text-white/60">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2"></div>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-8"
                >
                    <div className="aspect-video rounded-3xl overflow-hidden border border-white/10 group shadow-2xl">
                        <img 
                            src={project.image} 
                            alt={project.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {project.technologies.map((tech, index) => (
                            <div key={index} className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-accent/40 transition-colors">
                                <div className="flex items-center gap-3 mb-2">
                                    {index === 0 ? <Layout size={20} className="text-accent" /> : 
                                     index === 1 ? <Server size={20} className="text-accent" /> : 
                                     <Code size={20} className="text-accent" />}
                                    <h3 className="font-bold text-white uppercase tracking-tight">{tech.name}</h3>
                                </div>
                                <p className="text-sm text-white/60">{tech.details}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProjectDetail;
