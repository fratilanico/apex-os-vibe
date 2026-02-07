/**
 * Error Boundary - Production-ready React error boundary
 * Following AGENTS.md Section 20 standards
 * 
 * @module ErrorBoundary
 * @version 1.0.0
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { errorReporter } from '../src/lib/error-handler';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: Array<string | number>;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    errorReporter.report(error, {
      type: 'react_error_boundary',
      componentStack: errorInfo.componentStack
    });
    this.props.onError?.(error, errorInfo);
  }

  public componentDidUpdate(prevProps: Props) {
    const { resetKeys } = this.props;
    const { hasError } = this.state;

    if (hasError && resetKeys && prevProps.resetKeys !== resetKeys) {
      if (resetKeys.some((key, index) => key !== prevProps.resetKeys?.[index])) {
        this.reset();
      }
    }
  }

  private reset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">Portfolio Error</h2>
            <p className="text-gray-600 mb-6">Something went wrong loading the portfolio.</p>
            
            <div className="flex gap-4 justify-center">
              <button 
                onClick={this.reset}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Try Again
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function ErrorFallback({ error, onRetry }: { error: Error; onRetry?: () => void }) {
  React.useEffect(() => {
    errorReporter.report(error, { type: 'error_fallback' });
  }, [error]);

  return (
    <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
      <p className="text-red-600">{error.message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorBoundary;
