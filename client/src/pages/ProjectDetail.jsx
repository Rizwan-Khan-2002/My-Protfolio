import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, Trophy, Trash2 } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
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

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        try {
            await API.delete(`/projects/${id}`);
            navigate('/');
        } catch (error) {
            alert('Failed to delete project');
        }
    };

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

    const isOwner = user && (project.user?._id === user._id || project.user === user._id);

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
                    <div className="flex justify-between items-start">
                        <h1 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter">{project.title}</h1>
                        {isOwner && (
                            <button 
                                onClick={handleDelete}
                                className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-full transition-all"
                                title="Delete Project"
                            >
                                <Trash2 size={24} />
                            </button>
                        )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 text-flex items-center">
                        <span className="px-3 py-1 bg-accent/20 border border-accent/40 rounded-full text-[10px] text-accent font-black uppercase tracking-widest">
                            {project.difficulty}
                        </span>
                        {project.techStack?.map((tag, index) => (
                            <span key={index} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-white/60 font-bold uppercase tracking-widest">
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

export default ProjectDetail;
