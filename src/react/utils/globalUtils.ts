/**
 * Global Utilities for dev-stress-test
 * 
 * Functions to control error simulation behavior gl  if (window.__DEV_STRESS_TEST) {
    window.__DEV_STRESS_TEST.randomSeed = seed;
  }
  console.log('🎲 dev-stress-test: Random seed set to', seed);ally.
 */

/**
 * Enable dev-stress-test error simulation globally
 * 
 * By default, dev-stress-test only works in development mode.
 * Use this function to enable it in production or any environment.
 * 
 * @example
 * ```tsx
 * import { enableDevStress } from 'dev-stress-test';
 * 
 * // Enable in production for debugging
 * if (window.location.search.includes('debug=true')) {
 *   enableDevStress();
 * }
 * ```
 */
export function enableDevStress(): void {
    if (!window.__DEV_STRESS_TEST) {
        window.__DEV_STRESS_TEST = {
            slowNetwork: false,
            networkFailureActive: false,
            corsErrorActive: false,
            memoryLeakIntervals: [],
            infiniteLoopRunning: false,
            originalFetch: fetch,
            metrics: [],
            enabled: true
        };
    }

    window.__DEV_STRESS_TEST.enabled = true;
    console.log('🔧 dev-stress-test: Enabled globally');
}

/**
 * Disable dev-stress-test error simulation globally
 * 
 * @example
 * ```tsx
 * import { disableDevStress } from 'dev-stress-test';
 * 
 * // Disable for specific environments
 * if (process.env.REACT_APP_ENV === 'staging') {
 *   disableDevStress();
 * }
 * ```
 */
export function disableDevStress(): void {
    if (window.__DEV_STRESS_TEST) {
        window.__DEV_STRESS_TEST.enabled = false;
        console.log('🔧 dev-stress-test: Disabled globally');
    }
}

/**
 * Check if dev-stress-test is currently enabled
 * 
 * @returns true if enabled, false otherwise
 */
export function isDevStressEnabled(): boolean {
    if (process.env.NODE_ENV === 'development') {
        return true;
    }

    return window.__DEV_STRESS_TEST?.enabled === true;
}

/**
 * Set a deterministic random seed for reproducible error simulation
 * 
 * When a seed is set, all random errors will follow a predictable pattern.
 * This is useful for testing and debugging.
 * 
 * @param seed - Number to use as random seed
 * 
 * @example
 * ```tsx
 * import { setRandomSeed } from 'dev-stress-test';
 * 
 * // Use same seed for reproducible errors in tests
 * setRandomSeed(12345);
 * ```
 */
export function setRandomSeed(seed: number): void {
    if (!window.__DEV_STRESS_TEST) {
        window.__DEV_STRESS_TEST = {
            slowNetwork: false,
            networkFailureActive: false,
            corsErrorActive: false,
            memoryLeakIntervals: [],
            infiniteLoopRunning: false,
            originalFetch: fetch,
            metrics: [],
            enabled: process.env.NODE_ENV === 'development'
        };
    }

    window.__DEV_STRESS_TEST.randomSeed = seed;
    console.log('🎲 dev-stress-test: Random seed set to', seed);
}

/**
 * Clear the random seed (return to true randomness)
 * 
 * @example
 * ```tsx
 * import { clearRandomSeed } from 'dev-stress-test';
 * 
 * // Return to non-deterministic behavior
 * clearRandomSeed();
 * ```
 */
export function clearRandomSeed(): void {
    if (window.__DEV_STRESS_TEST) {
        delete window.__DEV_STRESS_TEST.randomSeed;
        console.log('🎲 dev-stress-test: Random seed cleared');
    }
}

/**
 * Get current error metrics and statistics
 * 
 * @returns Array of error metrics
 */
export function getErrorMetrics(): Array<{
    type: string;
    triggeredAt: number;
    message?: string;
}> {
    return window.__DEV_STRESS_TEST?.metrics || [];
}

/**
 * Clear all error metrics
 */
export function clearErrorMetrics(): void {
    if (window.__DEV_STRESS_TEST) {
        window.__DEV_STRESS_TEST.metrics = [];
        console.log('🧹 dev-stress-test: Error metrics cleared');
    }
}

/**
 * Log current dev-stress-test status and configuration
 */
export function getDevStressStatus(): {
    enabled: boolean;
    environment: string;
    hasRandomSeed: boolean;
    metricsCount: number;
    activeErrors: {
        slowNetwork: boolean;
        infiniteLoop: boolean;
        memoryLeaks: number;
    };
} {
    const status = {
        enabled: isDevStressEnabled(),
        environment: process.env.NODE_ENV || 'unknown',
        hasRandomSeed: window.__DEV_STRESS_TEST?.randomSeed !== undefined,
        metricsCount: getErrorMetrics().length,
        activeErrors: {
            slowNetwork: window.__DEV_STRESS_TEST?.slowNetwork || false,
            infiniteLoop: window.__DEV_STRESS_TEST?.infiniteLoopRunning || false,
            memoryLeaks: window.__DEV_STRESS_TEST?.memoryLeakIntervals?.length || 0
        }
    };

    console.log('📊 dev-stress-test status:', status);
    return status;
}

/**
 * Reset all dev-stress-test state (clear intervals, reset flags, etc.)
 */
export function resetDevStress(): void {
    if (window.__DEV_STRESS_TEST) {
        // Clear memory leak intervals
        window.__DEV_STRESS_TEST.memoryLeakIntervals.forEach(clearInterval);

        // Reset state
        window.__DEV_STRESS_TEST = {
            slowNetwork: false,
            networkFailureActive: false,
            corsErrorActive: false,
            memoryLeakIntervals: [],
            infiniteLoopRunning: false,
            originalFetch: window.__DEV_STRESS_TEST.originalFetch,
            metrics: [],
            enabled: window.__DEV_STRESS_TEST.enabled
        };

        console.log('🔄 dev-stress-test: State reset');
    }
}
