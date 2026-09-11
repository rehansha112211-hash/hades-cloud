"use client";

import { Component, type ReactNode } from "react";

interface State {
  hasError: boolean;
}

/**
 * Global error boundary — catches client-side render errors
 * and prevents the "Application error" white screen.
 * Renders children normally; if they crash, shows a fallback.
 */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch() {
    // Silently catch — don't crash the whole page
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-sm text-muted-foreground">
          Something went wrong loading this section.{" "}
          <button
            onClick={() => this.setState({ hasError: false })}
            className="text-primary underline"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
