'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StatusDropdownProps<T extends string> {
    value: T;
    options: { value: T; label: string; color: string }[];
    onChange: (newStatus: T) => void;
}

export default function StatusDropdown<T extends string>({
    value,
    options,
    onChange,
}: StatusDropdownProps<T>) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        if (open) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    const current = options.find(o => o.value === value)!;

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setOpen(false);
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            const idx = options.findIndex(o => o.value === value);
            const next = e.key === 'ArrowDown'
                ? (idx + 1) % options.length
                : (idx - 1 + options.length) % options.length;
            onChange(options[next].value);
        } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(!open);
        }
    };

    return (
        <div ref={ref} className="relative inline-block">
            <button
                onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
                onKeyDown={handleKeyDown}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label={`Status: ${current.label}`}
                className="badge flex items-center gap-1.5 cursor-pointer hover:brightness-125 transition-all"
                style={{ background: `${current.color}12`, color: current.color, borderColor: `${current.color}20` }}
            >
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: current.color }} aria-hidden="true" />
                {current.label}
                <ChevronUp className={`w-3 h-3 transition-transform ${open ? '' : 'rotate-180'}`} />
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.15 }}
                        role="listbox"
                        aria-label="Status options"
                        className="absolute z-50 mt-1 right-0 min-w-[140px] bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl overflow-hidden"
                    >
                        {options.map(opt => (
                            <button
                                key={opt.value}
                                role="option"
                                aria-selected={opt.value === value}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onChange(opt.value);
                                    setOpen(false);
                                }}
                                className={`w-full flex items-center gap-2 px-3 py-2 text-[11px] font-semibold transition-colors hover:bg-neutral-800 ${opt.value === value ? 'bg-neutral-800/60' : ''}`}
                                style={{ color: opt.color }}
                            >
                                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: opt.color }} aria-hidden="true" />
                                {opt.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
