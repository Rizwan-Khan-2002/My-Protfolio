import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight, Filter, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const Projects = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);

    const categories = ['All', 'Beginner', 'Intermediate', 'Advanced'];

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/projects');
            setProjects(data);
        } catch (error) {
            console.error("Error fetching projects", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        try {
            await API.delete(`/projects/${id}`);
            fetchProjects();
        } catch (error) {
            alert('Failed to delete project');
        }
    };

    const filteredProjects = filter === 'All' 
        ? projects 
        : projects.filter(p => p.difficulty === filter);

    return (
        <section id="projects" className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
                    <div className="max-w-2xl">
                        <h4 className="text-accent font-orbitron tracking-[0.5em] uppercase mb-4 text-xs font-black">Selected Works</h4>
                        <h2 className="text-6xl md:text-8xl font-black mb-8 italic tracking-tighter uppercase whitespace-nowrap">
                            Proven <br /> <span className="gradient-text not-italic">Results.</span>
                        </h2>
                    </div>

                    <div className="flex flex-wrap gap-2 pb-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-8 py-3 rounded-none border-2 transition-all duration-500 text-[10px] font-black uppercase tracking-widest ${
                                    filter === cat 
                                    ? 'bg-white border-white text-black translate-y-[-4px] shadow-[0_10px_20px_rgba(255,255,255,0.1)]' 
                                    : 'border-white/10 text-white/40 hover:border-white/30'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project, index) => (
                            <motion.div
                                key={project._id}
                                layout
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.02 }}
                                className="group relative"
                            >
                                <Link to={`/project/${project._id}`}>
                                    <div className="relative aspect-[16/10] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000 border border-white/10">
                                        <img 
                                            src={project.image || 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?auto=format&fit=crop&q=80&w=800'} 
                                            alt={project.title}
                                            className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-[2s] ease-out"
                                        />
                                        
                                        <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 mix-blend-overlay" />
                                        
                                        <div className="absolute top-8 left-8">
                                            <div className="px-4 py-2 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em]">
                                                {project.difficulty}
                                            </div>
                                        </div>

                                        <div className="absolute bottom-0 right-0 p-8 transform translate-y-full group-hover:translate-y-0 transition-transform duration-700">
                                            <div className="w-16 h-16 bg-white text-black flex items-center justify-center">
                                                <ArrowUpRight size={32} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex flex-col gap-4">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-3xl font-black italic uppercase tracking-tighter group-hover:text-accent transition-colors">
                                                {project.title}
                                            </h3>
                                            <div className="flex gap-4 opacity-40 group-hover:opacity-100 transition-opacity">
                                                <a 
                                                    href={project.githubRepo} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()} 
                                                    className="hover:text-accent transition-colors p-2 bg-white/5 rounded-full"
                                                >
                                                    <Github size={20} />
                                                </a>
                                                <a 
                                                    href={project.liveDemo} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()} 
                                                    className="hover:text-accent transition-colors p-2 bg-white/5 rounded-full"
                                                >
                                                    <ExternalLink size={20} />
                                                </a>
                                                {user && (project.user?._id === user._id || project.user === user._id) && (
                                                    <button 
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            handleDelete(project._id);
                                                        }}
                                                        className="hover:text-red-500 transition-colors p-2 bg-white/5 rounded-full"
                                                        title="Delete Project"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-3">
                                            {project.techStack?.map(tech => (
                                                <span key={tech} className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                                                    #{tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
};

export default Projects;
