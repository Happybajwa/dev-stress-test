import React, { useEffect, useState } from 'react';

export interface RandomErrorProps {
  /**
   * Probability of error occurring (0-1)
   * @default 0.1
   */
  probability?: number;
  /**
   * Custom error message
   * @default "RandomError: Simulated random runtime error"
   */
  message?: string;
  /**
   * Children to render
   */
  children: React.ReactNode;
  /**
   * Whether to throw error on render or on update
   * @default "render"
   */
  trigger?: 'render' | 'update' | 'both';
  /**
   * Callback fired before throwing the error
   */
  onBeforeError?: (message: string) => void;
  /**
   * Whether to log the error to console before throwing
   * @default true
   */
  logError?: boolean;
  /**
   * Minimum time between errors (in ms)
   * @default 1000
   */
  cooldown?: number;
}

/**
 * RandomError Component
 * 
 * Wraps children and randomly throws errors based on probability.
 * Useful for testing error boundaries with unpredictable failures.
 * 
 * @example
 * ```tsx
 * // Basic usage - 10% chance of error on each render
 * <RandomError>
 *   <YourComponent />
 * </RandomError>
 * 
 * // Higher probability with custom message
 * <RandomError probability={0.3} message="Random chaos!">
 *   <YourComponent />
 * </RandomError>
 * 
 * // Only error on updates, not initial render
 * <RandomError trigger="update" probability={0.2}>
 *   <YourComponent />
 * </RandomError>
 * ```
 */
export const RandomError: React.FC<RandomErrorProps> = ({
  probability = 0.1,
  message = "RandomError: Simulated random runtime error",
  children,
  trigger = 'render',
  onBeforeError,
  logError = true,
  cooldown = 1000
}) => {
  const [renderCount, setRenderCount] = useState(0);
  const [lastErrorTime, setLastErrorTime] = useState(0);

  // Deterministic random if seed is set
  const getRandom = (): number => {
    if (window.__DEV_STRESS_TEST?.randomSeed !== undefined) {
      // Simple seeded random (LCG algorithm)
      const seed = window.__DEV_STRESS_TEST.randomSeed;
      window.__DEV_STRESS_TEST.randomSeed = (seed * 1664525 + 1013904223) % 4294967296;
      return (window.__DEV_STRESS_TEST.randomSeed / 4294967296);
    }
    return Math.random();
  };

  const shouldThrowError = (): boolean => {
    // Only throw in development or if explicitly enabled
    if (process.env.NODE_ENV !== 'development' && !window.__DEV_STRESS_TEST?.enabled) {
      return false;
    }

    // Check cooldown
    const now = Date.now();
    if (now - lastErrorTime < cooldown) {
      return false;
    }

    // Check probability
    if (getRandom() > probability) {
      return false;
    }

    // Check trigger condition
    if (trigger === 'render' && renderCount === 0) {
      return true;
    } else if (trigger === 'update' && renderCount > 0) {
      return true;
    } else if (trigger === 'both') {
      return true;
    }

    return false;
  };

  // Track renders
  useEffect(() => {
    setRenderCount(prev => prev + 1);
  });

  // Check if we should throw an error
  if (shouldThrowError()) {
    setLastErrorTime(Date.now());
    
    if (onBeforeError) {
      onBeforeError(message);
    }

    if (logError) {
      console.error('🎲 RandomError triggered:', {
        message,
        probability,
        trigger,
        renderCount
      });
    }

    throw new Error(message);
  }

  return <>{children}</>;
};

export default RandomError;
