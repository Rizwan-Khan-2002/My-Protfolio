import React, { useState } from 'react';
import { X, Globe, Github, Layers, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
    const [formData, setFormData] = useState(initialData || {
        title: '',
        description: '',
        techStack: '',
        liveDemo: '',
        githubRepo: '',
        difficulty: 'Intermediate',
        image: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Convert techStack string to array
        const processedData = {
            ...formData,
            techStack: formData.techStack.split(',').map(s => s.trim()).filter(s => s !== '')
        };
        onSubmit(processedData);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="glass-card w-full max-w-2xl relative z-10 overflow-hidden"
                    >
                        <div className="flex justify-between items-center p-6 border-b border-white/10">
                            <h2 className="text-2xl font-orbitron font-bold gradient-text">
                                {initialData ? 'Edit Project' : 'New Masterpiece'}
                            </h2>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Project Title</label>
                                    <input 
                                        type="text" name="title" required
                                        value={formData.title} onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-all"
                                        placeholder="Awesome Web App"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Difficulty</label>
                                    <select 
                                        name="difficulty"
                                        value={formData.difficulty} onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-all text-white"
                                    >
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Description</label>
                                <textarea 
                                    name="description" required rows="3"
                                    value={formData.description} onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-all resize-none"
                                    placeholder="Tell the story of this project..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400 text-flex items-center gap-2">
                                    <Layers size={14} /> Tech Stack (comma separated)
                                </label>
                                <input 
                                    type="text" name="techStack"
                                    value={formData.techStack} onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-all"
                                    placeholder="React, Node.js, MongoDB..."
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                        <Globe size={14} /> Live Demo URL
                                    </label>
                                    <input 
                                        type="url" name="liveDemo"
                                        value={formData.liveDemo} onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-all"
                                        placeholder="https://..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                        <Github size={14} /> GitHub Link
                                    </label>
                                    <input 
                                        type="url" name="githubRepo"
                                        value={formData.githubRepo} onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-all"
                                        placeholder="https://github.com/..."
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button 
                                    type="button" onClick={onClose}
                                    className="flex-1 py-4 px-6 rounded-xl border border-white/10 hover:bg-white/5 transition-all font-orbitron text-sm uppercase tracking-widest"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-secondary to-accent text-white font-orbitron text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-secondary/20"
                                >
                                    {initialData ? 'Update Project' : 'Launch Project'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ProjectModal;
