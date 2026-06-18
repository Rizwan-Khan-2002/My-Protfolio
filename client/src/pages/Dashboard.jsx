import React, { useState, useEffect, useMemo } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
    Plus, FolderKanban, Star, ShieldCheck, Trash2, Pencil, Eye,
    ExternalLink, Github,
} from 'lucide-react';
import { motion } from 'framer-motion';
import ProjectModal from '../components/ProjectModal';
import ConfirmModal from '../components/ConfirmModal';
import ResumeManager from '../components/ResumeManager';
import SmartImage from '../components/SmartImage';

const Dashboard = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [toDelete, setToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/projects');
            setProjects(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to fetch projects:', err);
            setError('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProjects(); }, []);

    const handleProjectSubmit = async (projectData) => {
        try {
            if (editing) {
                await API.put(`/projects/${editing._id}`, projectData);
            } else {
                await API.post('/projects', projectData);
            }
            setIsModalOpen(false);
            setEditing(null);
            fetchProjects();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save project');
        }
    };

    const confirmDelete = async () => {
        if (!toDelete) return;
        setDeleting(true);
        try {
            await API.delete(`/projects/${toDelete._id}`);
            setProjects((prev) => prev.filter((p) => p._id !== toDelete._id));
            setToDelete(null);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete project');
        } finally {
            setDeleting(false);
        }
    };

    const openNew = () => { setEditing(null); setIsModalOpen(true); };
    const openEdit = (p) => { setEditing(p); setIsModalOpen(true); };

    const stats = useMemo(() => ({
        total: projects.length,
        featured: projects.filter((p) => p.featured).length,
        published: projects.filter((p) => (p.status || 'Published') === 'Published').length,
    }), [projects]);

    const fmt = (d) => (d ? new Date(d).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) : '—');

    return (
        <div className="min-h-screen pt-28 sm:pt-32 pb-24 px-4 sm:px-6 container mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl sm:text-4xl font-orbitron mb-2">Admin <span className="gradient-text">Dashboard</span></h1>
                    <p className="text-gray-400">Welcome back, {user?.name}. Manage your projects & resume here.</p>
                </motion.div>
                <button onClick={openNew} className="btn-primary flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" /> New Project
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <div className="glass-card p-6 flex items-center gap-4">
                    <div className="p-3 bg-secondary/10 rounded-xl"><FolderKanban className="w-7 h-7 text-secondary" /></div>
                    <div><p className="text-gray-400 text-sm">Total Projects</p><h3 className="text-2xl font-bold">{stats.total}</h3></div>
                </div>
                <div className="glass-card p-6 flex items-center gap-4">
                    <div className="p-3 bg-amber-500/10 rounded-xl"><Star className="w-7 h-7 text-amber-400" /></div>
                    <div><p className="text-gray-400 text-sm">Featured</p><h3 className="text-2xl font-bold">{stats.featured}</h3></div>
                </div>
                <div className="glass-card p-6 flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/10 rounded-xl"><ShieldCheck className="w-7 h-7 text-emerald-400" /></div>
                    <div><p className="text-gray-400 text-sm">Published</p><h3 className="text-2xl font-bold">{stats.published}</h3></div>
                </div>
            </div>

            {/* Resume management */}
            <div className="mb-10">
                <ResumeManager />
            </div>

            {/* Projects table */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-orbitron">Manage Projects</h2>
                <Link to="/admin" className="text-sm text-secondary hover:underline">Manage Users →</Link>
            </div>

            {error && <div className="bg-red-500/10 border border-red-500/40 p-4 rounded-xl text-red-400 mb-6">{error}</div>}

            {loading ? (
                <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-20 skeleton rounded-xl" />)}</div>
            ) : projects.length === 0 ? (
                <div className="glass-card p-10 text-center border-dashed">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-5">
                        <Plus className="w-8 h-8 text-gray-600" />
                    </div>
                    <h3 className="text-lg font-orbitron mb-2">No Projects Yet</h3>
                    <p className="text-gray-400 mb-6">Add your first project to your portfolio.</p>
                    <button onClick={openNew} className="btn-outline">Add Project</button>
                </div>
            ) : (
                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[720px]">
                            <thead>
                                <tr className="text-white/40 text-[11px] uppercase tracking-widest border-b border-white/10">
                                    <th className="px-5 py-4 font-medium">Project</th>
                                    <th className="px-5 py-4 font-medium">Category</th>
                                    <th className="px-5 py-4 font-medium">Status</th>
                                    <th className="px-5 py-4 font-medium">Created</th>
                                    <th className="px-5 py-4 font-medium">Updated</th>
                                    <th className="px-5 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {projects.map((p) => {
                                    const cat = p.category || p.difficulty || 'Intermediate';
                                    const status = p.status || 'Published';
                                    return (
                                        <tr key={p._id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-16 h-11 rounded-md overflow-hidden border border-white/10 bg-white/5 shrink-0">
                                                        <SmartImage src={p.image} alt={p.title} width={160} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="font-bold truncate max-w-[220px]">{p.title}</div>
                                                        {p.featured && <span className="text-[10px] text-amber-400 uppercase tracking-widest font-bold">★ Featured</span>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-accent/15 text-accent border border-accent/30">{cat}</span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                                    status === 'Published' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-white/10 text-white/60 border-white/15'
                                                }`}>{status}</span>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-white/50">{fmt(p.createdAt)}</td>
                                            <td className="px-5 py-4 text-sm text-white/50">{fmt(p.updatedAt)}</td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link to={`/project/${p._id}`} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors" title="Preview"><Eye size={16} /></Link>
                                                    <button onClick={() => openEdit(p)} className="p-2 rounded-lg bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 transition-colors" title="Edit"><Pencil size={16} /></button>
                                                    <button onClick={() => setToDelete(p)} className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 transition-colors" title="Delete"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <ProjectModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditing(null); }}
                onSubmit={handleProjectSubmit}
                initialData={editing}
            />
            <ConfirmModal
                isOpen={Boolean(toDelete)}
                title="Delete Project?"
                message={`“${toDelete?.title || ''}” and its image will be permanently removed.`}
                onConfirm={confirmDelete}
                onCancel={() => setToDelete(null)}
                loading={deleting}
            />
        </div>
    );
};

export default Dashboard;
