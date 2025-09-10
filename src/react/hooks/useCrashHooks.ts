import { useRef } from 'react';

/**
 * useRandomError Hook
 * 
 * Provides a function that randomly throws errors based on probability.
 * Useful for simulating unpredictable failures in functional logic.
 * 
 * @param probability - Chance of error (0-1), default 0.1
 * @param message - Custom error message
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const throwRandomError = useRandomError(0.2, "Something went wrong!");
 *   
 *   const handleClick = () => {
 *     // 20% chance this will throw an error
 *     throwRandomError();
 *     // ... rest of your logic
 *   };
 *   
 *   return <button onClick={handleClick}>Click me</button>;
 * }
 * ```
 */
export function useRandomError(
  probability: number = 0.1,
  message: string = "useRandomError: Simulated random error"
): () => void {
  const lastErrorTime = useRef(0);
  const cooldown = 1000; // 1 second cooldown between errors

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

  return () => {
    // Only throw in development or if explicitly enabled
    if (process.env.NODE_ENV !== 'development' && !window.__DEV_STRESS_TEST?.enabled) {
      console.warn('dev-stress-test: useRandomError disabled in production. Use enableDevStress() to override.');
      return;
    }

    // Check cooldown
    const now = Date.now();
    if (now - lastErrorTime.current < cooldown) {
      return;
    }

    // Check probability
    if (getRandom() <= probability) {
      lastErrorTime.current = now;
      console.error('🎲 useRandomError triggered:', message);
      throw new Error(message);
    }
  };
}

/**
 * useCrashOnUpdate Hook
 * 
 * Throws an error during re-render cycles after the initial mount.
 * 
 * @param message - Custom error message
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const [count, setCount] = useState(0);
 *   
 *   // Will crash on the second render (first update)
 *   useCrashOnUpdate("Component crashed during update!");
 *   
 *   return (
 *     <button onClick={() => setCount(c => c + 1)}>
 *       Count: {count}
 *     </button>
 *   );
 * }
 * ```
 */
export function useCrashOnUpdate(
  message: string = "useCrashOnUpdate: Intentional error during re-render"
): void {
  const renderCount = useRef(0);
  
  renderCount.current += 1;

  // Only crash on updates (not first render)
  if (renderCount.current > 1) {
    // Only crash in development or if explicitly enabled
    if (process.env.NODE_ENV !== 'development' && !window.__DEV_STRESS_TEST?.enabled) {
      console.warn('dev-stress-test: useCrashOnUpdate disabled in production. Use enableDevStress() to override.');
      return;
    }

    console.error('🔄 useCrashOnUpdate triggered:', message);
    throw new Error(message);
  }
}

/**
 * useCrashOnMount Hook
 * 
 * Throws an error immediately during the first render (mount).
 * 
 * @param message - Custom error message
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   // Will crash immediately when component mounts
 *   useCrashOnMount("Component failed to initialize!");
 *   
 *   return <div>This will never render</div>;
 * }
 * ```
 */
export function useCrashOnMount(
  message: string = "useCrashOnMount: Intentional error during mount"
): void {
  // Only crash in development or if explicitly enabled
  if (process.env.NODE_ENV !== 'development' && !window.__DEV_STRESS_TEST?.enabled) {
    console.warn('dev-stress-test: useCrashOnMount disabled in production. Use enableDevStress() to override.');
    return;
  }

  console.error('🚀 useCrashOnMount triggered:', message);
  throw new Error(message);
}
