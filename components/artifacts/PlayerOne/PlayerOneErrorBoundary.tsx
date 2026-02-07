'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class PlayerOneErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Emergency scroll unlock
    document.body.classList.remove('hud-open');
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';

    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('PlayerOne HUD Error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4">
          <div className="max-w-md rounded-2xl border border-red-500/30 bg-black/80 p-6 text-center">
            <h2 className="mb-4 text-xl font-bold text-red-400">HUD Error</h2>
            <p className="mb-6 text-white/60">Something went wrong with the PlayerOne HUD.</p>
            <button
              onClick={this.handleReload}
              className="rounded-xl bg-red-500 px-6 py-3 font-bold text-white hover:bg-red-600"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
