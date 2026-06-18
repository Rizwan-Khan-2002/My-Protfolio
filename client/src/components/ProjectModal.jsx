import React, { useState, useRef } from 'react';
import { X, Globe, Github, Layers, UploadCloud, Loader2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadToCloudinary, validateFile } from '../utils/cloudinary';
import { FALLBACK_IMAGE } from './SmartImage';

const emptyForm = {
    title: '',
    description: '',
    techStack: '',
    liveDemo: '',
    githubRepo: '',
    category: 'Intermediate',
    image: '',
    imagePublicId: '',
    status: 'Published',
    featured: false,
};

const fromInitial = (data) => {
    if (!data) return emptyForm;
    return {
        title: data.title || '',
        description: data.description || '',
        techStack: Array.isArray(data.techStack) ? data.techStack.join(', ') : (data.techStack || ''),
        liveDemo: data.liveDemo || '',
        githubRepo: data.githubRepo || '',
        category: data.category || data.difficulty || 'Intermediate',
        image: data.image || '',
        imagePublicId: data.imagePublicId || '',
        status: data.status || 'Published',
        featured: Boolean(data.featured),
    };
};

const ProjectModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
    const [formData, setFormData] = useState(() => fromInitial(initialData));
    const [errors, setErrors] = useState({});
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [uploadError, setUploadError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const fileRef = useRef(null);
    const prevId = useRef();

    // Reset form whenever the modal opens with new data.
    if (isOpen && prevId.current !== (initialData?._id || 'new')) {
        prevId.current = initialData?._id || 'new';
        setFormData(fromInitial(initialData));
        setErrors({});
        setUploadError('');
        setProgress(0);
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
        setErrors((er) => ({ ...er, [name]: undefined }));
    };

    const handleFile = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const err = validateFile(file, 'image');
        if (err) { setUploadError(err); return; }

        setUploadError('');
        setUploading(true);
        setProgress(0);
        try {
            const { url, publicId } = await uploadToCloudinary(file, 'image', setProgress);
            setFormData((f) => ({ ...f, image: url, imagePublicId: publicId }));
            setErrors((er) => ({ ...er, image: undefined }));
        } catch (e2) {
            setUploadError(e2.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const validate = () => {
        const e = {};
        if (!formData.title.trim()) e.title = 'Title is required';
        if (!formData.description.trim()) e.description = 'Description is required';
        if (!formData.category) e.category = 'Category is required';
        if (!formData.image.trim()) e.image = 'Project image is required';
        if (!formData.liveDemo.trim()) e.liveDemo = 'Live link is required';
        if (!formData.githubRepo.trim()) e.githubRepo = 'GitHub link is required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (uploading) return;
        if (!validate()) return;
        setSubmitting(true);
        try {
            await onSubmit({
                ...formData,
                difficulty: formData.category, // keep legacy field in sync
                techStack: formData.techStack.split(',').map((s) => s.trim()).filter(Boolean),
            });
        } finally {
            setSubmitting(false);
        }
    };

    const inputCls = (field) =>
        `w-full bg-white/5 border ${errors[field] ? 'border-red-500/70' : 'border-white/10'} rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-all`;

    const Err = ({ field }) =>
        errors[field] ? (
            <p className="text-red-400 text-xs flex items-center gap-1 mt-1"><AlertCircle size={12} /> {errors[field]}</p>
        ) : null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="glass-card w-full max-w-2xl relative z-10 overflow-hidden max-h-[92vh] overflow-y-auto"
                    >
                        <div className="flex justify-between items-center p-6 border-b border-white/10 sticky top-0 bg-primary/80 backdrop-blur-lg z-10">
                            <h2 className="text-2xl font-orbitron font-bold gradient-text">
                                {initialData ? 'Edit Project' : 'New Masterpiece'}
                            </h2>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-400">Project Title *</label>
                                    <input type="text" name="title" value={formData.title} onChange={handleChange}
                                        className={inputCls('title')} placeholder="Awesome Web App" />
                                    <Err field="title" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-400">Category *</label>
                                    <select name="category" value={formData.category} onChange={handleChange}
                                        className={`${inputCls('category')} text-white`}>
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                    <Err field="category" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-400">Description *</label>
                                <textarea name="description" rows="3" value={formData.description} onChange={handleChange}
                                    className={`${inputCls('description')} resize-none`} placeholder="Tell the story of this project..." />
                                <Err field="description" />
                            </div>

                            {/* Image uploader */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                    <ImageIcon size={14} /> Project Image *
                                </label>
                                <div className="flex flex-col sm:flex-row gap-4 items-start">
                                    <div className="w-full sm:w-48 aspect-[16/10] rounded-xl overflow-hidden border border-white/10 bg-white/5 shrink-0">
                                        <img src={formData.image || FALLBACK_IMAGE} alt="preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }} />
                                    </div>
                                    <div className="flex-1 w-full">
                                        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} className="hidden" />
                                        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                                            className={`w-full py-3 px-4 rounded-xl border ${errors.image ? 'border-red-500/70' : 'border-white/10'} hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60`}>
                                            {uploading ? <><Loader2 size={16} className="animate-spin" /> Uploading… {progress}%</> : <><UploadCloud size={16} /> {formData.image ? 'Replace Image' : 'Upload Image'}</>}
                                        </button>
                                        {uploading && (
                                            <div className="h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-secondary to-accent transition-all" style={{ width: `${progress}%` }} />
                                            </div>
                                        )}
                                        <p className="text-[10px] text-gray-500 mt-2">JPG, PNG or WEBP · max 5MB · auto-optimized via Cloudinary.</p>
                                        {uploadError && <p className="text-red-400 text-xs flex items-center gap-1 mt-1"><AlertCircle size={12} /> {uploadError}</p>}
                                        <Err field="image" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                    <Layers size={14} /> Tech Stack (comma separated)
                                </label>
                                <input type="text" name="techStack" value={formData.techStack} onChange={handleChange}
                                    className={inputCls('techStack')} placeholder="React, Node.js, MongoDB..." />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-400 flex items-center gap-2"><Globe size={14} /> Live Demo URL *</label>
                                    <input type="url" name="liveDemo" value={formData.liveDemo} onChange={handleChange}
                                        className={inputCls('liveDemo')} placeholder="https://..." />
                                    <Err field="liveDemo" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-400 flex items-center gap-2"><Github size={14} /> GitHub Link *</label>
                                    <input type="url" name="githubRepo" value={formData.githubRepo} onChange={handleChange}
                                        className={inputCls('githubRepo')} placeholder="https://github.com/..." />
                                    <Err field="githubRepo" />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 items-center">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-400">Status</label>
                                    <select name="status" value={formData.status} onChange={handleChange}
                                        className={`${inputCls('status')} text-white`}>
                                        <option value="Published">Published</option>
                                        <option value="Draft">Draft</option>
                                    </select>
                                </div>
                                <label className="flex items-center gap-3 cursor-pointer pt-6">
                                    <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange}
                                        className="w-5 h-5 accent-secondary" />
                                    <span className="text-sm text-gray-300">Mark as featured</span>
                                </label>
                            </div>

                            <div className="pt-2 flex gap-4">
                                <button type="button" onClick={onClose}
                                    className="flex-1 py-4 px-6 rounded-xl border border-white/10 hover:bg-white/5 transition-all font-orbitron text-sm uppercase tracking-widest">
                                    Cancel
                                </button>
                                <button type="submit" disabled={uploading || submitting}
                                    className="flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-secondary to-accent text-white font-orbitron text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-secondary/20 disabled:opacity-60 disabled:hover:scale-100">
                                    {submitting ? 'Saving…' : initialData ? 'Update Project' : 'Launch Project'}
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
