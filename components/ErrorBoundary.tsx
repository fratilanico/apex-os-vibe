import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component to catch and display errors gracefully
 * Prevents entire page from crashing due to component errors
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const payload = {
      type: 'react.error_boundary',
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      ts: new Date().toISOString(),
    };
    if (typeof window !== 'undefined') {
      const key = '__APEX_WAITLIST_DEBUG__';
      const w = window as unknown as Record<string, unknown>;
      const existing = (w[key] as Array<Record<string, unknown>> | undefined) || [];
      w[key] = [...existing, payload].slice(-100);
    }
    console.error('ErrorBoundary caught an error:', payload);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-6 rounded-lg border border-red-500/30 bg-red-500/10 text-center">
          <h3 className="text-red-400 font-bold mb-2">Something went wrong</h3>
          <p className="text-white/60 text-sm mb-4">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded text-red-400 text-sm hover:bg-red-500/30 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
