import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { Trash2, Shield, AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/admin/users');
            setUsers(data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch users');
            setLoading(false);
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await API.delete(`/admin/user/${id}`);
            setUsers(users.filter(user => user._id !== id));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete user');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) return (
        <div className="pt-32 flex justify-center text-white">
            <RefreshCw className="animate-spin mr-2" /> Loading Users...
        </div>
    );

    return (
        <div className="pt-28 sm:pt-32 pb-12 px-5 sm:px-6 max-w-6xl mx-auto">
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-white/60 hover:text-accent transition-colors mb-8 group">
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </Link>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-12">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                        <Shield className="text-accent" size={32} /> Admin Control
                    </h1>
                    <p className="text-white/50 mt-2">Manage portfolio users and platform security</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div className="text-xs uppercase tracking-widest text-white/40 mb-1">Total Users</div>
                    <div className="text-2xl font-bold text-white">{users.length}</div>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl text-red-500 mb-8 flex items-center gap-3">
                    <AlertTriangle size={20} /> {error}
                </div>
            )}

            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 text-white/40 text-xs uppercase tracking-widest border-b border-white/10">
                            <th className="px-8 py-6 font-medium">User Details</th>
                            <th className="px-8 py-6 font-medium">Role</th>
                            <th className="px-8 py-6 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                                            {user.name[0]}
                                        </div>
                                        <div>
                                            <div className="text-white font-bold">{user.name}</div>
                                            <div className="text-sm text-white/40">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                        user.role === 'admin' ? 'bg-accent/20 text-accent border border-accent/40' : 'bg-white/10 text-white/60 border border-white/10'
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    {user.role !== 'admin' && (
                                        <button 
                                            onClick={() => deleteUser(user._id)}
                                            className="p-3 text-white/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
