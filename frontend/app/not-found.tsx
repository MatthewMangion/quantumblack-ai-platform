'use client';

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center px-8">
                <p className="text-8xl font-bold text-emerald-500/20 mb-4">404</p>
                <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
                <p className="text-sm text-neutral-500 mb-8 max-w-md">
                    The page you are looking for does not exist or has been moved.
                </p>
                <div className="flex items-center justify-center gap-3">
                    <Link
                        href="/"
                        className="btn-primary text-sm inline-flex items-center gap-2"
                    >
                        <Home className="w-4 h-4" />
                        Go to Dashboard
                    </Link>
                    <button
                        onClick={() => history.back()}
                        className="btn-secondary text-sm inline-flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}
