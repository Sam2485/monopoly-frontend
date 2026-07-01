import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center select-text">
          <div className="max-w-2xl bg-red-950/20 border border-red-500/30 rounded-2xl p-8 shadow-2xl">
            <h1 className="text-3xl font-black text-red-400 mb-4">An unexpected UI error occurred</h1>
            <p className="text-slate-300 text-sm mb-6 font-semibold">
              The interface crashed during rendering. Below are the details to help identify the issue:
            </p>
            <pre className="bg-black/40 text-red-300 p-4 rounded-xl text-xs font-mono text-left overflow-x-auto border border-red-950/60 max-h-60">
              {this.state.error && this.state.error.toString()}
              {"\n\nComponent Stack:\n"}
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
