import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, Trophy, Trash2 } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import SmartImage from '../components/SmartImage';
import ConfirmModal from '../components/ConfirmModal';

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

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
        setDeleting(true);
        try {
            await API.delete(`/projects/${id}`);
            navigate('/');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete project');
            setDeleting(false);
            setConfirmOpen(false);
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
                        {isAdmin && (
                            <button
                                onClick={() => setConfirmOpen(true)}
                                className="p-3 bg-red-500/20 text-red-500 border border-red-500/40 hover:bg-red-500 hover:text-white rounded-xl transition-all flex items-center gap-2 group"
                                title="Delete Project"
                            >
                                <Trash2 size={24} className="group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-bold uppercase tracking-widest hidden md:inline">Delete Project</span>
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
                        <SmartImage
                            src={project.image}
                            alt={project.title}
                            width={1400}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-accent/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                </motion.div>
            </div>

            <ConfirmModal
                isOpen={confirmOpen}
                title="Delete Project?"
                message="This will permanently remove the project and its image."
                onConfirm={handleDelete}
                onCancel={() => setConfirmOpen(false)}
                loading={deleting}
            />
        </div>
    );
};

export default ProjectDetail;
