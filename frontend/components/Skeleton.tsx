'use client';

/**
 * Reusable skeleton loading components for shimmer placeholders.
 */

interface SkeletonProps {
    className?: string;
    style?: React.CSSProperties;
}

export function Skeleton({ className = '', style }: SkeletonProps) {
    return (
        <div
            className={`animate-pulse rounded-lg bg-neutral-800/60 ${className}`}
            style={style}
            aria-hidden="true"
        />
    );
}

export function SkeletonCard() {
    return (
        <div className="glass-card p-5 space-y-3" aria-hidden="true">
            <div className="flex items-center justify-between">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <Skeleton className="w-4 h-4" />
            </div>
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-3 w-24" />
        </div>
    );
}

export function SkeletonRow() {
    return (
        <div className="flex items-center gap-4 py-3 px-4" aria-hidden="true">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-2 w-1/2" />
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
        </div>
    );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
    return (
        <div className="glass-card overflow-hidden" aria-hidden="true">
            <div className="flex gap-4 px-4 py-3 border-b border-neutral-800">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-3 flex-1" />
                ))}
            </div>
            {[...Array(rows)].map((_, i) => (
                <SkeletonRow key={i} />
            ))}
        </div>
    );
}

export function SkeletonChart() {
    return (
        <div className="glass-card p-6 space-y-4" aria-hidden="true">
            <Skeleton className="h-4 w-32" />
            <div className="flex items-end gap-2 h-48">
                {[40, 65, 30, 80, 55, 45, 70].map((h, i) => (
                    <Skeleton key={i} className="flex-1 rounded-t-lg" style={{ height: `${h}%` }} />
                ))}
            </div>
        </div>
    );
}

export function SkeletonClientCard() {
    return (
        <div className="glass-card p-6 space-y-4" aria-hidden="true">
            <div className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                </div>
            </div>
            <Skeleton className="h-1.5 w-full rounded-full" />
            <div className="flex gap-4">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-20" />
            </div>
        </div>
    );
}
