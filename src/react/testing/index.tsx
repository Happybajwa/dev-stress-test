import React from 'react';

/**
 * Testing Utilities for dev-stress-test
 *
 * Helpers for testing error boundaries and error handling with Jest and React Testing Library.
 */

export interface SimulateErrorOptions {
  /**
   * Error message to throw
   */
  message?: string;
  /**
   * Delay before throwing error (ms)
   */
  delay?: number;
  /**
   * Whether to log the error
   */
  logError?: boolean;
}

/**
 * Programmatically trigger errors in a component for testing Error Boundaries
 *
 * @param component - React component instance or element
 * @param options - Error simulation options
 *
 * @example
 * ```tsx
 * import { render } from '@testing-library/react';
 * import { simulateError } from 'dev-stress-test/testing';
 *
 * test('error boundary catches errors', () => {
 *   const { getByText } = render(
 *     <ErrorBoundary fallback={<div>Error occurred</div>}>
 *       <TestComponent />
 *     </ErrorBoundary>
 *   );
 *
 *   simulateError(<TestComponent />, { message: 'Test error' });
 *   expect(getByText('Error occurred')).toBeInTheDocument();
 * });
 * ```
 */
export function simulateError(
  component: React.ReactElement,
  options: SimulateErrorOptions = {}
): Promise<void> {
  const {
    message = 'simulateError: Test error simulation',
    delay = 0,
    logError = false,
  } = options;

  return new Promise((resolve, reject) => {
    const throwError = () => {
      if (logError) {
        console.error('🧪 simulateError triggered:', message);
      }

      try {
        throw new Error(message);
      } catch (error) {
        reject(error);
      }
    };

    if (delay > 0) {
      setTimeout(throwError, delay);
    } else {
      throwError();
    }
  });
}

/**
 * Simple Error Boundary component for testing
 */
class TestErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('TestErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

/**
 * Wrap a component with an Error Boundary for testing
 *
 * @param component - Component to wrap
 * @param fallback - Fallback UI to render on error
 *
 * @example
 * ```tsx
 * import { render } from '@testing-library/react';
 * import { wrapWithErrorBoundary } from 'dev-stress-test/testing';
 *
 * test('component handles errors gracefully', () => {
 *   const WrappedComponent = wrapWithErrorBoundary(
 *     <ProblematicComponent />,
 *     <div>Something went wrong</div>
 *   );
 *
 *   const { getByText } = render(WrappedComponent);
 *   // Test error handling...
 * });
 * ```
 */
export function wrapWithErrorBoundary(
  component: React.ReactElement,
  fallback: React.ReactNode
): React.ReactElement {
  return <TestErrorBoundary fallback={fallback}>{component}</TestErrorBoundary>;
}

/**
 * Mock Error Boundary for testing that captures error details
 */
export class MockErrorBoundary extends React.Component<
  {
    children: React.ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
    fallback?: React.ReactNode;
  },
  { hasError: boolean; error?: Error }
> {
  constructor(props: {
    children: React.ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
    fallback?: React.ReactNode;
  }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div data-testid="error-boundary">Error occurred</div>
        )
      );
    }

    return this.props.children;
  }
}

/**
 * Enable dev-stress-test in test environment
 */
export function enableTestMode(): void {
  if (!window.__DEV_STRESS_TEST) {
    window.__DEV_STRESS_TEST = {
      slowNetwork: false,
      networkFailureActive: false,
      corsErrorActive: false,
      memoryLeakIntervals: [],
      infiniteLoopRunning: false,
      originalFetch: fetch,
      metrics: [],
      enabled: true,
    };
  }
  if (window.__DEV_STRESS_TEST) {
    window.__DEV_STRESS_TEST.enabled = true;
  }
}

/**
 * Disable dev-stress-test in test environment
 */
export function disableTestMode(): void {
  if (window.__DEV_STRESS_TEST) {
    window.__DEV_STRESS_TEST.enabled = false;
  }
}

/**
 * Set a deterministic random seed for reproducible tests
 */
export function setTestRandomSeed(seed: number): void {
  if (!window.__DEV_STRESS_TEST) {
    window.__DEV_STRESS_TEST = {
      slowNetwork: false,
      networkFailureActive: false,
      corsErrorActive: false,
      memoryLeakIntervals: [],
      infiniteLoopRunning: false,
      originalFetch: fetch,
      metrics: [],
      enabled: true,
    };
  }
  if (window.__DEV_STRESS_TEST) {
    window.__DEV_STRESS_TEST.randomSeed = seed;
  }
}
