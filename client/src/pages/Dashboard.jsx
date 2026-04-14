import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Plus, Settings, FolderKanban, Trash2, ExternalLink, Github } from 'lucide-react';
import ProjectModal from '../components/ProjectModal';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/projects');
            // Filter projects to show only those belonging to the current user
            const myProjects = data.filter(p => {
                const projectUserId = p.user?._id?.toString() || p.user?.toString();
                const currentUserId = user?._id?.toString();
                return projectUserId === currentUserId;
            });
            setProjects(myProjects);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
            setLoading(false);
        }
    };

    const handleProjectSubmit = async (projectData) => {
        try {
            await API.post('/projects', projectData);
            setIsModalOpen(false);
            fetchProjects();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to save project');
        }
    };

    const deleteProject = async (id) => {
        if (!window.confirm('Delete this project?')) return;
        try {
            await API.delete(`/projects/${id}`);
            fetchProjects();
        } catch (error) {
            alert('Failed to delete project');
        }
    };

    useEffect(() => {
        if (user) fetchProjects();
    }, [user]);

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 container mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-4xl font-orbitron mb-2">Welcome back, <span className="gradient-text">{user?.name}</span></h1>
                    <p className="text-gray-400">Manage your projects and profile here.</p>
                </motion.div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    New Project
                </button>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="glass-card p-6 flex items-center gap-4">
                    <div className="p-3 bg-secondary/10 rounded-xl">
                        <FolderKanban className="w-8 h-8 text-secondary" />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Total Projects</p>
                        <h3 className="text-2xl font-bold">{projects.length}</h3>
                    </div>
                </div>

                <div className="glass-card p-6 flex items-center gap-4 text-white/30">
                    <div className="p-3 bg-white/5 rounded-xl">
                        <LayoutDashboard className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm">Activity</p>
                        <h3 className="text-xl">Coming Soon</h3>
                    </div>
                </div>

                <div className="glass-card p-6 flex items-center gap-4">
                    <div className="p-3 bg-accent/10 rounded-xl">
                        <Settings className="w-8 h-8 text-accent" />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Account Type</p>
                        <h3 className="text-2xl font-bold text-accent italic uppercase tracking-tighter">{user?.role}</h3>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-400">Loading projects...</div>
            ) : projects.length === 0 ? (
                <div className="mt-12 glass-card p-8 border-dashed">
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Plus className="w-10 h-10 text-gray-600" />
                        </div>
                        <h3 className="text-xl font-orbitron mb-2">No Projects Found</h3>
                        <p className="text-gray-400 mb-8">Start by adding your first project to your portfolio.</p>
                        <button onClick={() => setIsModalOpen(true)} className="btn-outline">Add Project</button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <div key={project._id} className="glass-card group overflow-hidden">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-orbitron font-bold group-hover:text-secondary transition-colors">{project.title}</h3>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => deleteProject(project._id)}
                                            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-gray-400 text-sm mb-6 line-clamp-3">{project.description}</p>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.techStack.map((tech, i) => (
                                        <span key={i} className="text-[10px] uppercase font-bold px-2 py-1 bg-white/5 rounded-md border border-white/10 text-gray-300">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-4 pt-4 border-t border-white/5">
                                    {project.liveDemo && (
                                        <a href={project.liveDemo} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-secondary hover:underline">
                                            <ExternalLink size={14} /> Demo
                                        </a>
                                    )}
                                    {project.githubRepo && (
                                        <a href={project.githubRepo} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors">
                                            <Github size={14} /> Code
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ProjectModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSubmit={handleProjectSubmit} 
            />
        </div>
    );
};

export default Dashboard;
