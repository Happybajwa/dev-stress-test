import React from 'react';

export interface CrashButtonProps {
  /**
   * Custom error message to throw when button is clicked
   * @default "CrashButton: Intentional error for testing"
   */
  message?: string;
  /**
   * Button text content
   * @default "Crash App"
   */
  children?: React.ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Custom styles
   */
  style?: React.CSSProperties;
  /**
   * Callback fired before throwing the error
   */
  onBeforeCrash?: (message: string) => void;
  /**
   * Whether to log the error to console before throwing
   * @default true
   */
  logError?: boolean;
}

/**
 * CrashButton Component
 * 
 * A button that throws an error when clicked, useful for testing Error Boundaries
 * and error handling in development.
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <CrashButton>Crash the app!</CrashButton>
 * 
 * // With custom error message
 * <CrashButton message="Custom crash message">
 *   Test Error Boundary
 * </CrashButton>
 * 
 * // With callback
 * <CrashButton
 *   onBeforeCrash={(msg) => console.log('About to crash with:', msg)}
 * >
 *   Controlled Crash
 * </CrashButton>
 * ```
 */
export const CrashButton: React.FC<CrashButtonProps> = ({
  message = "CrashButton: Intentional error for testing",
  children = "Crash App",
  className = "",
  style = {},
  onBeforeCrash,
  logError = true,
  ...props
}) => {
  const handleClick = () => {
    // Only crash in development or if explicitly enabled
    if (process.env.NODE_ENV !== 'development' && !window.__DEV_STRESS_TEST?.enabled) {
      console.warn('dev-stress-test: CrashButton disabled in production. Use enableDevStress() to override.');
      return;
    }

    if (onBeforeCrash) {
      onBeforeCrash(message);
    }

    if (logError) {
      console.error('🚨 CrashButton triggered:', message);
    }

    // Throw the error
    throw new Error(message);
  };

  return (
    <button
      onClick={handleClick}
      className={`dev-stress-crash-button ${className}`}
      style={{
        padding: '8px 16px',
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 500,
        transition: 'all 0.2s ease',
        ...style
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default CrashButton;
