import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import SmartImage from './SmartImage';
import TiltCard from './TiltCard';
import ConfirmModal from './ConfirmModal';

const categories = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const Projects = () => {
    const { isAdmin } = useAuth();
    const [projects, setProjects] = useState([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [toDelete, setToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/projects');
            setProjects(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching projects', error);
            setProjects([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const confirmDelete = async () => {
        if (!toDelete) return;
        setDeleting(true);
        try {
            await API.delete(`/projects/${toDelete}`);
            setProjects((prev) => prev.filter((p) => p._id !== toDelete));
            setToDelete(null);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete project');
        } finally {
            setDeleting(false);
        }
    };

    // FIX: filter by category, falling back to legacy `difficulty` field.
    const filteredProjects = useMemo(() => {
        if (filter === 'All') return projects;
        return projects.filter((p) => p && (p.category || p.difficulty) === filter);
    }, [projects, filter]);

    return (
        <section id="projects" className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-8">
                    <div className="max-w-2xl">
                        <h4 className="text-accent font-orbitron tracking-[0.5em] uppercase mb-4 text-xs font-black">Selected Works</h4>
                        <h2 className="text-5xl sm:text-6xl md:text-8xl font-black mb-4 italic tracking-tighter uppercase">
                            Proven <br /> <span className="gradient-text not-italic">Results.</span>
                        </h2>
                    </div>

                    <div className="flex flex-wrap gap-2 pb-2">
                        {categories.map((cat) => {
                            const active = filter === cat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    aria-pressed={active}
                                    className={`px-5 sm:px-8 py-3 border-2 transition-all duration-300 text-[10px] font-black uppercase tracking-widest ${
                                        active
                                            ? 'bg-white border-white text-black -translate-y-1 shadow-[0_10px_20px_rgba(255,255,255,0.1)]'
                                            : 'border-white/10 text-white/40 hover:border-white/30'
                                    }`}
                                >
                                    {cat}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="space-y-4">
                                <div className="aspect-[16/10] skeleton rounded-lg border border-white/10" />
                                <div className="h-6 w-2/3 skeleton rounded" />
                                <div className="h-4 w-1/3 skeleton rounded" />
                            </div>
                        ))}
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="text-center py-24 text-white/40 uppercase tracking-widest font-bold">
                        No projects in “{filter}” yet.
                    </div>
                ) : (
                    <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                        <AnimatePresence mode="popLayout">
                            {filteredProjects.map((project, index) => {
                                if (!project || !project._id) return null;
                                const cat = project.category || project.difficulty || 'Intermediate';
                                return (
                                    <motion.div
                                        key={project._id}
                                        layout
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.6, delay: Math.min(index * 0.08, 0.4) }}
                                        viewport={{ once: true }}
                                        className="group relative"
                                    >
                                        <TiltCard max={6}>
                                            <Link to={`/project/${project._id}`}>
                                                <div className="relative aspect-[16/10] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 border border-white/10 rounded-lg">
                                                    <SmartImage
                                                        src={project.image}
                                                        alt={project.title || 'Project'}
                                                        width={900}
                                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                                                    />
                                                    <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-overlay pointer-events-none" />
                                                    <div className="absolute top-6 left-6">
                                                        <div className="px-4 py-2 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em]">
                                                            {cat}
                                                        </div>
                                                    </div>
                                                    <div className="absolute bottom-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                                        <div className="w-14 h-14 bg-white text-black flex items-center justify-center">
                                                            <ArrowUpRight size={28} />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-6 flex flex-col gap-4">
                                                    <div className="flex justify-between items-start gap-4">
                                                        <h3 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tighter group-hover:text-accent transition-colors">
                                                            {project.title || 'Untitled Project'}
                                                        </h3>
                                                        <div className="flex gap-3 opacity-60 group-hover:opacity-100 transition-opacity shrink-0">
                                                            {project.githubRepo && (
                                                                <a
                                                                    href={project.githubRepo}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    className="hover:text-accent transition-colors p-2 bg-white/5 rounded-full"
                                                                    aria-label="GitHub"
                                                                >
                                                                    <Github size={18} />
                                                                </a>
                                                            )}
                                                            {project.liveDemo && (
                                                                <a
                                                                    href={project.liveDemo}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    className="hover:text-accent transition-colors p-2 bg-white/5 rounded-full"
                                                                    aria-label="Live demo"
                                                                >
                                                                    <ExternalLink size={18} />
                                                                </a>
                                                            )}
                                                            {isAdmin && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        setToDelete(project._id);
                                                                    }}
                                                                    className="hover:text-white p-2 bg-red-500/20 text-red-500 rounded-full border border-red-500/30 transition-colors hover:bg-red-600"
                                                                    title="Delete Project"
                                                                >
                                                                    <Trash2 size={18} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-3">
                                                        {project.techStack?.map((tech) => (
                                                            <span key={tech} className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                                                                #{tech}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </Link>
                                        </TiltCard>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>

            <ConfirmModal
                isOpen={Boolean(toDelete)}
                title="Delete Project?"
                message="This will permanently remove the project and its image from your portfolio."
                onConfirm={confirmDelete}
                onCancel={() => setToDelete(null)}
                loading={deleting}
            />
        </section>
    );
};

export default Projects;
