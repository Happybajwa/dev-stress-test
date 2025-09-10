import React, { useEffect } from 'react';

export interface CrashOnEffectProps {
  /**
   * Custom error message
   * @default "CrashOnEffect: Intentional async error in useEffect"
   */
  message?: string;
  /**
   * Children to render
   */
  children: React.ReactNode;
  /**
   * Delay before throwing error (in ms)
   * @default 1000
   */
  delay?: number;
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
   * Whether to crash on mount, dependency change, or both
   * @default "mount"
   */
  trigger?: 'mount' | 'update' | 'both';
  /**
   * Dependencies to watch for updates (when trigger includes 'update')
   */
  dependencies?: React.DependencyList;
}

/**
 * CrashOnEffect Component
 * 
 * Throws an error asynchronously inside useEffect after an optional delay.
 * Useful for testing async error handling and cleanup.
 * 
 * @example
 * ```tsx
 * // Basic usage - crash 1 second after mount
 * <CrashOnEffect>
 *   <YourComponent />
 * </CrashOnEffect>
 * 
 * // Immediate crash on mount
 * <CrashOnEffect delay={0}>
 *   <YourComponent />
 * </CrashOnEffect>
 * 
 * // Crash on dependency updates
 * <CrashOnEffect 
 *   trigger="update" 
 *   dependencies={[someValue]}
 *   delay={500}
 * >
 *   <YourComponent />
 * </CrashOnEffect>
 * ```
 */
export const CrashOnEffect: React.FC<CrashOnEffectProps> = ({
  message = "CrashOnEffect: Intentional async error in useEffect",
  children,
  delay = 1000,
  onBeforeError,
  logError = true,
  trigger = 'mount',
  dependencies = []
}) => {
  const [mountCount, setMountCount] = React.useState(0);

  useEffect(() => {
    // Only crash in development or if explicitly enabled
    if (process.env.NODE_ENV !== 'development' && !window.__DEV_STRESS_TEST?.enabled) {
      console.warn('dev-stress-test: CrashOnEffect disabled in production. Use enableDevStress() to override.');
      return;
    }

    // Determine if we should crash based on trigger
    const shouldCrash = 
      (trigger === 'mount' && mountCount === 0) ||
      (trigger === 'update' && mountCount > 0) ||
      (trigger === 'both');

    if (!shouldCrash) {
      setMountCount(prev => prev + 1);
      return;
    }

    const timeoutId = setTimeout(() => {
      if (onBeforeError) {
        onBeforeError(message);
      }

      if (logError) {
        console.error('⏰ CrashOnEffect triggered:', {
          message,
          delay,
          trigger,
          mountCount
        });
      }

      throw new Error(message);
    }, delay);

    setMountCount(prev => prev + 1);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
    };
  }, trigger === 'mount' ? [] : dependencies);

  return <>{children}</>;
};

export default CrashOnEffect;
