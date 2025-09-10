import { ErrorSimulationOptions } from '../types';

/**
 * Generate a random error message if none provided
 */
export function generateErrorMessage(type: string, customMessage?: string): string {
  if (customMessage) return customMessage;

  const messages = {
    'uncaught-exception': 'Simulated uncaught exception',
    'unhandled-rejection': 'Simulated unhandled promise rejection',
    'memory-leak': 'Simulated memory leak',
    'render': 'Simulated React render error',
    'async': 'Simulated async operation error',
    'event': 'Simulated event handler error',
    'default': 'Simulated error for development testing'
  };

  return messages[type as keyof typeof messages] || messages.default;
}

/**
 * Create a delay promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if we're in development environment
 */
export function isDevelopment(): boolean {
  if (typeof process !== 'undefined' && process.env) {
    return process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'test' ||
      !process.env.NODE_ENV;
  }
  return true; // Default to true in browser environments for development
}

/**
 * Log error information if not silent
 */
export function logError(error: Error, options: ErrorSimulationOptions = {}): void {
  if (!options.silent && isDevelopment()) {
    console.error('[dev-stress-test]', error.message);
    console.error(error.stack);
  }
}

/**
 * Create an error with stack trace
 */
export function createError(message: string): Error {
  const error = new Error(message);
  Error.captureStackTrace?.(error, createError);
  return error;
}

/**
 * Validate error simulation options
 */
export function validateOptions(options: ErrorSimulationOptions = {}): ErrorSimulationOptions {
  return {
    delay: Math.max(0, options.delay || 0),
    message: options.message,
    silent: Boolean(options.silent)
  };
}

/**
 * Generate a random error for testing purposes
 */
export function generateRandomError(): Error {
  const errorTypes = [
    'Network connection failed',
    'Database query timeout',
    'Invalid user input',
    'File not found',
    'Permission denied',
    'Memory allocation failed',
    'API rate limit exceeded'
  ];

  const randomMessage = errorTypes[Math.floor(Math.random() * errorTypes.length)];
  return createError(`Simulated error: ${randomMessage}`);
}

/**
 * Simulate a memory leak for testing purposes
 * Returns a cleanup function to stop the leak
 */
export function simulateMemoryLeak(): () => void {
  const leakArray: any[] = [];
  let isLeaking = true;

  const leakInterval = setInterval(() => {
    if (isLeaking) {
      // Add objects to simulate memory leak
      for (let i = 0; i < 1000; i++) {
        leakArray.push(new Array(100).fill('memory-leak-data'));
      }
    }
  }, 100);

  // Return cleanup function
  return () => {
    isLeaking = false;
    clearInterval(leakInterval);
    leakArray.length = 0; // Clear the array
  };
}
