'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, X, AlertCircle, AlertTriangle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextValue {
    toast: (message: string, type?: ToastType) => void;
}

const toastConfig: Record<ToastType, { icon: typeof CheckCircle2; color: string; borderColor: string }> = {
    success: { icon: CheckCircle2, color: 'text-emerald-400', borderColor: 'border-emerald-500/20' },
    error: { icon: AlertCircle, color: 'text-red-400', borderColor: 'border-red-500/20' },
    warning: { icon: AlertTriangle, color: 'text-amber-400', borderColor: 'border-amber-500/20' },
    info: { icon: Info, color: 'text-blue-400', borderColor: 'border-blue-500/20' },
};

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType = 'success') => {
        const id = crypto.randomUUID();
        setToasts(prev => [...prev, { id, message, type }]);
        const duration = type === 'error' ? 5000 : 2500;
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toast: addToast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2" role="status" aria-live="polite">
                <AnimatePresence>
                    {toasts.map(t => {
                        const config = toastConfig[t.type];
                        const Icon = config.icon;
                        return (
                            <motion.div
                                key={t.id}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-neutral-900 border ${config.borderColor} shadow-2xl min-w-[260px]`}
                            >
                                <Icon className={`w-4 h-4 ${config.color} flex-shrink-0`} />
                                <span className="text-sm text-neutral-200 font-medium flex-1">{t.message}</span>
                                <button
                                    onClick={() => removeToast(t.id)}
                                    aria-label="Dismiss notification"
                                    className="p-0.5 rounded-md hover:bg-neutral-800 text-neutral-600 hover:text-neutral-300 transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export const useToast = () => useContext(ToastContext);
