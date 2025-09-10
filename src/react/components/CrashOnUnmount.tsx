import React, { useEffect } from 'react';

export interface CrashOnUnmountProps {
  /**
   * Custom error message
   * @default "CrashOnUnmount: Intentional error during unmount"
   */
  message?: string;
  /**
   * Children to render
   */
  children: React.ReactNode;
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
   * Delay before throwing error (in ms)
   * @default 0
   */
  delay?: number;
}

/**
 * CrashOnUnmount Component
 * 
 * Throws an error when the component is unmounted.
 * Useful for testing cleanup in Error Boundaries and useEffect cleanup.
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <CrashOnUnmount>
 *   <YourComponent />
 * </CrashOnUnmount>
 * 
 * // With custom message and delay
 * <CrashOnUnmount 
 *   message="Cleanup failed!" 
 *   delay={100}
 * >
 *   <YourComponent />
 * </CrashOnUnmount>
 * 
 * // With callback
 * <CrashOnUnmount
 *   onBeforeError={(msg) => analytics.track('unmount_error', { msg })}
 * >
 *   <YourComponent />
 * </CrashOnUnmount>
 * ```
 */
export const CrashOnUnmount: React.FC<CrashOnUnmountProps> = ({
  message = "CrashOnUnmount: Intentional error during unmount",
  children,
  onBeforeError,
  logError = true,
  delay = 0
}) => {
  useEffect(() => {
    // Return cleanup function that throws error
    return () => {
      // Only crash in development or if explicitly enabled
      if (process.env.NODE_ENV !== 'development' && !window.__DEV_STRESS_TEST?.enabled) {
        console.warn('dev-stress-test: CrashOnUnmount disabled in production. Use enableDevStress() to override.');
        return;
      }

      const throwError = () => {
        if (onBeforeError) {
          onBeforeError(message);
        }

        if (logError) {
          console.error('🔥 CrashOnUnmount triggered:', message);
        }

        throw new Error(message);
      };

      if (delay > 0) {
        setTimeout(throwError, delay);
      } else {
        throwError();
      }
    };
  }, [message, onBeforeError, logError, delay]);

  return <>{children}</>;
};

export default CrashOnUnmount;
