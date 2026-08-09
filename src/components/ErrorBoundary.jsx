import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Uncaught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-stone px-6 text-center">
          <h1 className="font-display text-3xl text-ink mb-3">
            Something went wrong
          </h1>
          <p className="text-slate mb-6">
            An unexpected error occurred. Try refreshing the page.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-ink text-stone px-6 py-2.5 font-medium hover:bg-brass transition-colors"
          >
            Go back home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}