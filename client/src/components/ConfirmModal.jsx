import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

/**
 * Reusable confirmation dialog.
 * Props: isOpen, title, message, confirmText, onConfirm, onCancel, loading
 */
const ConfirmModal = ({
    isOpen,
    title = 'Are you sure?',
    message = 'This action cannot be undone.',
    confirmText = 'Delete',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    loading = false,
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCancel}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        role="alertdialog"
                        aria-modal="true"
                        className="glass-card relative z-10 w-full max-w-md p-8 text-center"
                    >
                        <button
                            onClick={onCancel}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
                            aria-label="Close"
                        >
                            <X size={18} />
                        </button>
                        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-red-500/15 flex items-center justify-center">
                            <AlertTriangle className="text-red-500" size={30} />
                        </div>
                        <h3 className="text-2xl font-orbitron font-bold mb-2">{title}</h3>
                        <p className="text-gray-400 mb-8">{message}</p>
                        <div className="flex gap-4">
                            <button
                                onClick={onCancel}
                                disabled={loading}
                                className="flex-1 py-3 rounded-xl border border-white/15 hover:bg-white/5 transition-all font-semibold uppercase tracking-widest text-xs disabled:opacity-50"
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={loading}
                                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all font-semibold uppercase tracking-widest text-xs disabled:opacity-50"
                            >
                                {loading ? 'Deleting…' : confirmText}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmModal;
