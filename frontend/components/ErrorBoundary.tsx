'use client';

import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center min-h-[400px] p-8">
                    <div className="glass-card p-8 max-w-md w-full text-center">
                        <div className="w-12 h-12 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-6 h-6 text-red-400" />
                        </div>
                        <h2 className="text-lg font-bold text-white mb-2">Something went wrong</h2>
                        <p className="text-sm text-neutral-500 mb-1">
                            An unexpected error occurred while rendering this section.
                        </p>
                        <p className="text-xs text-neutral-600 mb-6 font-mono break-all">
                            {this.state.error?.message}
                        </p>
                        <button
                            onClick={() => this.setState({ hasError: false, error: null })}
                            className="btn-primary text-sm inline-flex items-center gap-2"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
