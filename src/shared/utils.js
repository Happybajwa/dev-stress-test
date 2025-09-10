"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateErrorMessage = generateErrorMessage;
exports.delay = delay;
exports.isDevelopment = isDevelopment;
exports.logError = logError;
exports.createError = createError;
exports.validateOptions = validateOptions;
exports.generateRandomError = generateRandomError;
exports.simulateMemoryLeak = simulateMemoryLeak;
/**
 * Generate a random error message if none provided
 */
function generateErrorMessage(type, customMessage) {
    if (customMessage)
        return customMessage;
    const messages = {
        'uncaught-exception': 'Simulated uncaught exception',
        'unhandled-rejection': 'Simulated unhandled promise rejection',
        'memory-leak': 'Simulated memory leak',
        'render': 'Simulated React render error',
        'async': 'Simulated async operation error',
        'event': 'Simulated event handler error',
        'default': 'Simulated error for development testing'
    };
    return messages[type] || messages.default;
}
/**
 * Create a delay promise
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/**
 * Check if we're in development environment
 */
function isDevelopment() {
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
function logError(error, options = {}) {
    if (!options.silent && isDevelopment()) {
        console.error('[dev-stress-test]', error.message);
        console.error(error.stack);
    }
}
/**
 * Create an error with stack trace
 */
function createError(message) {
    var _a;
    const error = new Error(message);
    (_a = Error.captureStackTrace) === null || _a === void 0 ? void 0 : _a.call(Error, error, createError);
    return error;
}
/**
 * Validate error simulation options
 */
function validateOptions(options = {}) {
    return {
        delay: Math.max(0, options.delay || 0),
        message: options.message,
        silent: Boolean(options.silent)
    };
}
/**
 * Generate a random error for testing purposes
 */
function generateRandomError() {
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
function simulateMemoryLeak() {
    const leakArray = [];
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
