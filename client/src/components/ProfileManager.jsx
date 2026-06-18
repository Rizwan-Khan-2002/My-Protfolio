import React, { useEffect, useRef, useState } from 'react';
import {
    User, UploadCloud, Loader2, Plus, Trash2, Save, CheckCircle2, AlertCircle,
} from 'lucide-react';
import API from '../services/api';
import { uploadToCloudinary, validateFile } from '../utils/cloudinary';
import { profileDefaults } from '../data/profileDefaults';

const blankEdu = { degree: '', institution: '', period: '', description: '' };
const blankExp = { role: '', company: '', period: '', description: '' };
const blankSkill = { name: '', level: 80 };

const ProfileManager = () => {
    const [form, setForm] = useState(profileDefaults);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [msg, setMsg] = useState(null);
    const fileRef = useRef(null);

    useEffect(() => {
        API.get('/profile')
            .then(({ data }) => { if (data) setForm({ ...profileDefaults, ...data, socials: { ...profileDefaults.socials, ...(data.socials || {}) }, stats: { ...profileDefaults.stats, ...(data.stats || {}) } }); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
    const setNested = (group, k, v) => setForm((f) => ({ ...f, [group]: { ...f[group], [k]: v } }));

    const setItem = (group, i, k, v) =>
        setForm((f) => ({ ...f, [group]: f[group].map((it, idx) => (idx === i ? { ...it, [k]: v } : it)) }));
    const addItem = (group, blank) => setForm((f) => ({ ...f, [group]: [...(f[group] || []), { ...blank }] }));
    const removeItem = (group, i) => setForm((f) => ({ ...f, [group]: f[group].filter((_, idx) => idx !== i) }));

    const handlePhoto = async (e) => {
        const file = e.target.files?.[0];
        if (fileRef.current) fileRef.current.value = '';
        if (!file) return;
        const err = validateFile(file, 'image');
        if (err) { setMsg({ type: 'error', text: err }); return; }
        setMsg(null); setUploading(true); setProgress(0);
        try {
            const { url, publicId } = await uploadToCloudinary(file, 'image', setProgress);
            setForm((f) => ({ ...f, photoUrl: url, photoPublicId: publicId }));
        } catch (e2) {
            setMsg({ type: 'error', text: e2.message || 'Upload failed' });
        } finally { setUploading(false); }
    };

    const save = async () => {
        setSaving(true); setMsg(null);
        try {
            await API.put('/profile', form);
            setMsg({ type: 'success', text: 'Profile saved.' });
        } catch (e) {
            setMsg({ type: 'error', text: e.response?.data?.message || 'Save failed' });
        } finally { setSaving(false); }
    };

    const input = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-secondary transition-all text-sm';
    const labelCls = 'text-xs font-medium text-gray-400 mb-1 block';

    if (loading) return <div className="glass-card p-8 h-40 skeleton" />;

    return (
        <div className="glass-card p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-secondary/10 rounded-xl"><User className="w-7 h-7 text-secondary" /></div>
                <div>
                    <h3 className="text-xl font-orbitron font-bold">About / Profile</h3>
                    <p className="text-gray-400 text-sm">Powers the public “About Me” page. Everything here is dynamic.</p>
                </div>
            </div>

            {msg && (
                <div className={`mb-5 p-3 rounded-xl text-sm flex items-center gap-2 ${msg.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'}`}>
                    {msg.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />} {msg.text}
                </div>
            )}

            {/* Photo */}
            <div className="flex flex-col sm:flex-row gap-5 mb-8">
                <div className="w-32 h-40 rounded-xl overflow-hidden border border-white/10 bg-white/5 shrink-0 flex items-center justify-center">
                    {form.photoUrl ? <img src={form.photoUrl} alt="profile" className="w-full h-full object-cover" /> : <User className="w-10 h-10 text-white/20" />}
                </div>
                <div className="flex-1">
                    <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhoto} className="hidden" />
                    <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                        className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-all flex items-center gap-2 text-sm disabled:opacity-60">
                        {uploading ? <><Loader2 size={16} className="animate-spin" /> {progress}%</> : <><UploadCloud size={16} /> {form.photoUrl ? 'Replace Photo' : 'Upload Photo'}</>}
                    </button>
                    <p className="text-[10px] text-gray-500 mt-2">JPG/PNG/WEBP · max 5MB. Shown on your About page.</p>
                </div>
            </div>

            {/* Basic fields */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div><label className={labelCls}>Name</label><input className={input} value={form.name} onChange={(e) => set('name', e.target.value)} /></div>
                <div><label className={labelCls}>Title</label><input className={input} value={form.title} onChange={(e) => set('title', e.target.value)} /></div>
                <div><label className={labelCls}>Email</label><input className={input} value={form.email} onChange={(e) => set('email', e.target.value)} /></div>
                <div><label className={labelCls}>Phone</label><input className={input} value={form.phone} onChange={(e) => set('phone', e.target.value)} /></div>
                <div><label className={labelCls}>Location</label><input className={input} value={form.location} onChange={(e) => set('location', e.target.value)} /></div>
                <label className="flex items-center gap-3 mt-6 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 accent-secondary" checked={form.available} onChange={(e) => set('available', e.target.checked)} />
                    <span className="text-sm text-gray-300">Available for work</span>
                </label>
            </div>
            <div className="mb-6">
                <label className={labelCls}>Bio</label>
                <textarea rows="4" className={`${input} resize-none`} value={form.bio} onChange={(e) => set('bio', e.target.value)} />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div><label className={labelCls}>Experience</label><input className={input} value={form.stats.experienceYears} onChange={(e) => setNested('stats', 'experienceYears', e.target.value)} /></div>
                <div><label className={labelCls}>Projects</label><input className={input} value={form.stats.projectsCompleted} onChange={(e) => setNested('stats', 'projectsCompleted', e.target.value)} /></div>
                <div><label className={labelCls}>Clients</label><input className={input} value={form.stats.happyClients} onChange={(e) => setNested('stats', 'happyClients', e.target.value)} /></div>
            </div>

            {/* Socials */}
            <h4 className="font-orbitron text-sm uppercase tracking-widest text-white/50 mb-3">Social Links</h4>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {['github', 'linkedin', 'whatsapp', 'twitter', 'website'].map((s) => (
                    <div key={s}><label className={`${labelCls} capitalize`}>{s}</label>
                        <input className={input} value={form.socials[s] || ''} onChange={(e) => setNested('socials', s, e.target.value)} placeholder="https://..." />
                    </div>
                ))}
            </div>

            {/* Repeatable groups */}
            <RepeatGroup title="Experience" items={form.experience} onAdd={() => addItem('experience', blankExp)} onRemove={(i) => removeItem('experience', i)}
                render={(it, i) => (
                    <>
                        <input className={input} placeholder="Role" value={it.role} onChange={(e) => setItem('experience', i, 'role', e.target.value)} />
                        <input className={input} placeholder="Company" value={it.company} onChange={(e) => setItem('experience', i, 'company', e.target.value)} />
                        <input className={input} placeholder="Period (e.g. 2023 — Present)" value={it.period} onChange={(e) => setItem('experience', i, 'period', e.target.value)} />
                        <textarea className={`${input} resize-none sm:col-span-3`} rows="2" placeholder="Description" value={it.description} onChange={(e) => setItem('experience', i, 'description', e.target.value)} />
                    </>
                )} />

            <RepeatGroup title="Education" items={form.education} onAdd={() => addItem('education', blankEdu)} onRemove={(i) => removeItem('education', i)}
                render={(it, i) => (
                    <>
                        <input className={input} placeholder="Degree" value={it.degree} onChange={(e) => setItem('education', i, 'degree', e.target.value)} />
                        <input className={input} placeholder="Institution" value={it.institution} onChange={(e) => setItem('education', i, 'institution', e.target.value)} />
                        <input className={input} placeholder="Period" value={it.period} onChange={(e) => setItem('education', i, 'period', e.target.value)} />
                        <textarea className={`${input} resize-none sm:col-span-3`} rows="2" placeholder="Description" value={it.description} onChange={(e) => setItem('education', i, 'description', e.target.value)} />
                    </>
                )} />

            <RepeatGroup title="Skills" items={form.skills} onAdd={() => addItem('skills', blankSkill)} onRemove={(i) => removeItem('skills', i)} cols="sm:grid-cols-2"
                render={(it, i) => (
                    <>
                        <input className={input} placeholder="Skill name" value={it.name} onChange={(e) => setItem('skills', i, 'name', e.target.value)} />
                        <input className={input} type="number" min="0" max="100" placeholder="Level %" value={it.level} onChange={(e) => setItem('skills', i, 'level', Number(e.target.value))} />
                    </>
                )} />

            <button onClick={save} disabled={saving || uploading}
                className="mt-4 btn-primary inline-flex items-center gap-2 disabled:opacity-60">
                {saving ? <><Loader2 size={18} className="animate-spin" /> Saving…</> : <><Save size={18} /> Save Profile</>}
            </button>
        </div>
    );
};

const RepeatGroup = ({ title, items, render, onAdd, onRemove, cols = 'sm:grid-cols-3' }) => (
    <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
            <h4 className="font-orbitron text-sm uppercase tracking-widest text-white/50">{title}</h4>
            <button onClick={onAdd} className="text-xs flex items-center gap-1 text-secondary hover:underline"><Plus size={14} /> Add</button>
        </div>
        <div className="space-y-4">
            {(items || []).map((it, i) => (
                <div key={i} className="relative p-4 rounded-xl bg-white/[0.03] border border-white/10">
                    <button onClick={() => onRemove(i)} className="absolute top-3 right-3 p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20" title="Remove"><Trash2 size={14} /></button>
                    <div className={`grid grid-cols-1 ${cols} gap-3 pr-8`}>{render(it, i)}</div>
                </div>
            ))}
            {(!items || items.length === 0) && <p className="text-white/30 text-sm">None yet — click “Add”.</p>}
        </div>
    </div>
);

export default ProfileManager;
