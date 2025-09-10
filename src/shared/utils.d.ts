import { ErrorSimulationOptions } from '../types';
/**
 * Generate a random error message if none provided
 */
export declare function generateErrorMessage(type: string, customMessage?: string): string;
/**
 * Create a delay promise
 */
export declare function delay(ms: number): Promise<void>;
/**
 * Check if we're in development environment
 */
export declare function isDevelopment(): boolean;
/**
 * Log error information if not silent
 */
export declare function logError(error: Error, options?: ErrorSimulationOptions): void;
/**
 * Create an error with stack trace
 */
export declare function createError(message: string): Error;
/**
 * Validate error simulation options
 */
export declare function validateOptions(options?: ErrorSimulationOptions): ErrorSimulationOptions;
/**
 * Generate a random error for testing purposes
 */
export declare function generateRandomError(): Error;
/**
 * Simulate a memory leak for testing purposes
 * Returns a cleanup function to stop the leak
 */
export declare function simulateMemoryLeak(): () => void;
