'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText, AlertCircle } from 'lucide-react';
import type { ClientDocument } from '@/lib/types';

interface DocumentUploadModalProps {
    open: boolean;
    clientId: string;
    onClose: () => void;
    onUpload: (doc: ClientDocument) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const categories: { value: ClientDocument['category']; label: string }[] = [
    { value: 'deliverable', label: 'Deliverable' },
    { value: 'meeting_notes', label: 'Meeting Notes' },
    { value: 'reference', label: 'Reference' },
    { value: 'report', label: 'Report' },
    { value: 'template', label: 'Template' },
];

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentUploadModal({ open, clientId, onClose, onUpload }: DocumentUploadModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [category, setCategory] = useState<ClientDocument['category']>('reference');
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const reset = () => {
        setFile(null);
        setCategory('reference');
        setDragOver(false);
        setError(null);
        setUploading(false);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const validateFile = (f: File): boolean => {
        if (f.size > MAX_FILE_SIZE) {
            setError(`File too large (${formatFileSize(f.size)}). Maximum size is 5 MB.`);
            return false;
        }
        setError(null);
        return true;
    };

    const handleFileSelect = (f: File) => {
        if (validateFile(f)) {
            setFile(f);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const f = e.dataTransfer.files[0];
        if (f) handleFileSelect(f);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setDragOver(false);
    }, []);

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);

        try {
            const data = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = () => reject(new Error('Failed to read file'));
                reader.readAsDataURL(file);
            });

            const doc: ClientDocument = {
                id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                clientId,
                name: file.name,
                type: file.type || 'application/octet-stream',
                size: file.size,
                data,
                uploadedAt: new Date().toISOString(),
                category,
            };

            onUpload(doc);
            handleClose();
        } catch {
            setError('Failed to read the file. Please try again.');
            setUploading(false);
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="glass-card w-full max-w-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
                            <div>
                                <h2 className="text-lg font-bold text-white">Upload Document</h2>
                                <p className="text-xs text-neutral-500 mt-0.5">Attach a file to this client workspace</p>
                            </div>
                            <button onClick={handleClose} className="p-2 rounded-xl hover:bg-neutral-800 text-neutral-500 hover:text-white transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-5">
                            {/* Drop zone */}
                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onClick={() => inputRef.current?.click()}
                                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                                    dragOver
                                        ? 'border-emerald-500 bg-emerald-500/5'
                                        : file
                                            ? 'border-emerald-500/30 bg-emerald-500/5'
                                            : 'border-neutral-700 hover:border-neutral-600 bg-neutral-900/50'
                                }`}
                            >
                                <input
                                    ref={inputRef}
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => {
                                        const f = e.target.files?.[0];
                                        if (f) handleFileSelect(f);
                                    }}
                                />

                                {file ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                                            <FileText className="w-5 h-5 text-emerald-400" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-semibold text-white truncate max-w-[280px]">{file.name}</p>
                                            <p className="text-[10px] text-neutral-500">{formatFileSize(file.size)}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
                                        <p className="text-sm font-medium text-neutral-400">Drop a file here or click to browse</p>
                                        <p className="text-[10px] text-neutral-600 mt-1">Maximum file size: 5 MB</p>
                                    </>
                                )}
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    {error}
                                </div>
                            )}

                            {/* Category */}
                            <div>
                                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1.5 block">Category</label>
                                <select
                                    className="input-base w-full"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value as ClientDocument['category'])}
                                >
                                    {categories.map(c => (
                                        <option key={c.value} value={c.value}>{c.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between p-6 border-t border-neutral-800">
                            <button onClick={handleClose} className="btn-secondary text-xs">Cancel</button>
                            <button
                                onClick={handleUpload}
                                disabled={!file || uploading}
                                className="btn-primary text-xs"
                            >
                                {uploading ? 'Uploading...' : 'Upload Document'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
