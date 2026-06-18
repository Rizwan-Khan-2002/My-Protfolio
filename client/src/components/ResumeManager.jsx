import React, { useState, useEffect, useRef } from 'react';
import { FileText, UploadCloud, Download, Eye, Trash2, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import API from '../services/api';
import { uploadToCloudinary, validateFile } from '../utils/cloudinary';
import ConfirmModal from './ConfirmModal';

const ResumeManager = () => {
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState(null); // {type, text}
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const fileRef = useRef(null);

    const fetchResume = async () => {
        try {
            const { data } = await API.get('/resume');
            setResume(data);
        } catch {
            setResume(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchResume(); }, []);

    const handleFile = async (e) => {
        const file = e.target.files?.[0];
        if (fileRef.current) fileRef.current.value = '';
        if (!file) return;
        const err = validateFile(file, 'resume');
        if (err) { setMessage({ type: 'error', text: err }); return; }

        setMessage(null);
        setUploading(true);
        setProgress(0);
        try {
            const { url, publicId, format } = await uploadToCloudinary(file, 'resume', setProgress);
            const { data } = await API.post('/resume', {
                resumeUrl: url,
                publicId,
                originalName: file.name,
                format: format || 'pdf',
            });
            setResume(data);
            setMessage({ type: 'success', text: 'Resume updated successfully.' });
        } catch (e2) {
            setMessage({ type: 'error', text: e2.response?.data?.message || e2.message || 'Upload failed' });
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await API.delete('/resume');
            setResume(null);
            setMessage({ type: 'success', text: 'Resume deleted.' });
        } catch (e) {
            setMessage({ type: 'error', text: e.response?.data?.message || 'Delete failed' });
        } finally {
            setDeleting(false);
            setConfirmOpen(false);
        }
    };

    return (
        <div className="glass-card p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-secondary/10 rounded-xl"><FileText className="w-7 h-7 text-secondary" /></div>
                <div>
                    <h3 className="text-xl font-orbitron font-bold">Resume Management</h3>
                    <p className="text-gray-400 text-sm">Upload, replace, preview or remove your resume (PDF, max 10MB).</p>
                </div>
            </div>

            {message && (
                <div className={`mb-5 p-3 rounded-xl text-sm flex items-center gap-2 ${
                    message.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                }`}>
                    {message.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />} {message.text}
                </div>
            )}

            {loading ? (
                <div className="h-20 skeleton rounded-xl" />
            ) : (
                <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-3 min-w-0">
                            <FileText className="w-8 h-8 text-accent shrink-0" />
                            <div className="min-w-0">
                                <p className="font-semibold truncate">{resume ? (resume.originalName || 'Resume.pdf') : 'No resume uploaded'}</p>
                                <p className="text-xs text-gray-400">
                                    {resume ? `Updated ${new Date(resume.updatedAt).toLocaleDateString()}` : 'Upload one to enable the public download button.'}
                                </p>
                            </div>
                        </div>
                        {resume && (
                            <div className="flex items-center gap-2 shrink-0">
                                <a href={resume.resumeUrl} target="_blank" rel="noopener noreferrer"
                                    className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors" title="Preview">
                                    <Eye size={18} />
                                </a>
                                <a href={resume.resumeUrl} download
                                    className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors" title="Download">
                                    <Download size={18} />
                                </a>
                                <button onClick={() => setConfirmOpen(true)}
                                    className="p-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 transition-colors" title="Delete">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        )}
                    </div>

                    <div>
                        <input ref={fileRef} type="file" accept="application/pdf" onChange={handleFile} className="hidden" />
                        <button onClick={() => fileRef.current?.click()} disabled={uploading}
                            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-secondary to-accent text-white font-orbitron text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                            {uploading ? <><Loader2 size={16} className="animate-spin" /> Uploading… {progress}%</> : <><UploadCloud size={16} /> {resume ? 'Replace Resume' : 'Upload Resume'}</>}
                        </button>
                        {uploading && (
                            <div className="h-1.5 bg-white/10 rounded-full mt-3 overflow-hidden max-w-xs">
                                <div className="h-full bg-gradient-to-r from-secondary to-accent transition-all" style={{ width: `${progress}%` }} />
                            </div>
                        )}
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={confirmOpen}
                title="Delete Resume?"
                message="This removes the resume from storage and disables the public download button."
                onConfirm={handleDelete}
                onCancel={() => setConfirmOpen(false)}
                loading={deleting}
            />
        </div>
    );
};

export default ResumeManager;
