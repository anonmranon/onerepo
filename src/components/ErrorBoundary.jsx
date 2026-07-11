import React from 'react';
import { Link } from 'react-router-dom';
import { AlertOctagon } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark flex flex-col items-center justify-center px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <AlertOctagon className="w-16 h-16 text-primary" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Something went wrong
          </h1>
          <p className="text-body-dark text-sm max-w-md mx-auto mb-8 leading-relaxed">
            We've encountered an unexpected error. Our engineering team has been notified.
            Please try refreshing the page or returning home.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3 rounded transition-colors text-sm"
            >
              REFRESH PAGE
            </button>
            <a
              href="/"
              className="border border-white/20 text-white font-bold px-6 py-3 rounded hover:border-white/50 transition-colors text-sm"
            >
              RETURN HOME
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
