/**
 * Error types that can be simulated in Node.js environment
 */
export type NodeErrorType = 'uncaught-exception' | 'unhandled-rejection' | 'memory-leak' | 'syntax-error' | 'timeout';
/**
 * Error types that can be simulated in React environment
 */
export type ReactErrorType = 'render' | 'async' | 'event' | 'lifecycle' | 'hook';
/**
 * Common error simulation options
 */
export interface ErrorSimulationOptions {
    /** Delay before triggering the error (milliseconds) */
    delay?: number;
    /** Custom error message */
    message?: string;
    /** Whether to log the error to console */
    silent?: boolean;
}
/**
 * Node.js specific error simulation options
 */
export interface NodeErrorOptions extends ErrorSimulationOptions {
    /** Process exit code for uncaught exceptions */
    exitCode?: number;
    /** Memory leak size in MB */
    memorySize?: number;
}
/**
 * React specific error simulation options
 */
export interface ReactErrorOptions extends ErrorSimulationOptions {
    /** Whether to recover from the error */
    recoverable?: boolean;
    /** Component fallback content */
    fallback?: React.ReactNode;
}
/**
 * Error simulator configuration
 */
export interface ErrorSimulatorConfig {
    /** Environment: development, test, or production */
    environment?: 'development' | 'test' | 'production';
    /** Enable/disable error simulation globally */
    enabled?: boolean;
    /** Default error options */
    defaultOptions?: ErrorSimulationOptions;
}
