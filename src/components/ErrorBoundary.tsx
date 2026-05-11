/**
 * ┌─────────────────────────────────────────────────────────────┐
 * │  OmegaAPI — Error Boundary Component                       │
 * │  Author : Sʜɪɴᴇɪ Nᴏᴜᴢᴇɴ                                   │
 * │  License: MIT                                              │
 * │  Module : src/components/ErrorBoundary.tsx                  │
 * └─────────────────────────────────────────────────────────────┘
 *
 * React Error Boundary that catches rendering errors and shows
 * a fallback UI instead of crashing the entire page.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <BrowsePage />
 *   </ErrorBoundary>
 *
 * NOTE: Error boundaries only catch errors in child component
 * rendering. They don't catch errors in event handlers, async
 * code, or server-side rendering.
 */

'use client';

import { Component, type ReactNode } from 'react';

// ==================== TYPES ====================

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// ==================== COMPONENT ====================
// ---- FEATURE: ERROR BOUNDARY ----

/**
 * Error boundary wrapper for browse pages.
 *
 * @param children  - Components to wrap
 * @param fallback  - Optional custom fallback UI
 *
 * Catches rendering errors and shows a user-friendly error page
 * with a "Try Again" button that resets the error state.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to console in development, could be extended to send to
    // an error tracking service (Sentry, LogRocket, etc.)
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <main className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a10' }}>
          <div className="text-center max-w-md px-5">
            <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 text-[#ef4444] border-2 border-[#ef4444]/30 rounded-full" style={{ background: 'rgba(239,68,68,0.08)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h1 className="font-display text-xl text-[#e4e4e7] mb-2" style={{ textTransform: 'none' }}>
              Something Went Wrong
            </h1>
            <p className="text-sm text-[#71717a] mb-6">
              An unexpected error occurred while loading this page. This is likely a temporary issue.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="px-5 py-2.5 bg-[#ef4444] border-2 border-[#e4e4e7] text-white font-display font-bold text-sm uppercase tracking-widest shadow-[4px_4px_0_0_#e4e4e7] hover:bg-[#dc2626] hover:shadow-[2px_2px_0_0_#e4e4e7] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all"
              >
                Try Again
              </button>
              <a
                href="/"
                className="px-5 py-2.5 bg-[#12121a] border-2 border-[#2a2a36] text-[#a1a1aa] font-display font-bold text-sm uppercase tracking-widest hover:text-[#e4e4e7] hover:border-[#3a3a46] transition-all"
              >
                Go Home
              </a>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <pre className="mt-6 p-4 text-left text-xs text-[#ef4444] bg-[#12121a] border border-[#2a2a36] rounded-lg overflow-auto max-h-40">
                {this.state.error.message}
              </pre>
            )}
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

// ==================== EOF ====================
