// Main exports for dev-stress-test React library

// Components
export { default as DevStressPanel, ErrorButtonPanel } from './ErrorButtonPanel';
export { default as CrashButton } from './components/CrashButton';
export { default as RandomError } from './components/RandomError';
export { default as CrashOnUnmount } from './components/CrashOnUnmount';
export { default as CrashOnEffect } from './components/CrashOnEffect';

// Hooks
export { useErrorSimulation } from './hooks/useErrorSimulation';
export { useTheme } from './hooks/useTheme';
export { 
  useRandomError, 
  useCrashOnUpdate, 
  useCrashOnMount 
} from './hooks/useCrashHooks';

// Testing Utilities
export { 
  simulateError,
  wrapWithErrorBoundary,
  MockErrorBoundary,
  enableTestMode,
  disableTestMode,
  setTestRandomSeed
} from './testing';

// Global Utilities
export {
  enableDevStress,
  disableDevStress,
  isDevStressEnabled,
  setRandomSeed,
  clearRandomSeed,
  getErrorMetrics,
  clearErrorMetrics,
  getDevStressStatus,
  resetDevStress
} from './utils/globalUtils';

// Types
export type {
  DevStressPanelProps,
  ErrorButtonPanelProps, // Backwards compatibility
  ErrorType,
  ButtonPosition,
  Theme,
  ErrorMetrics,
  ErrorLog,
  UseErrorSimulationOptions
} from './types';

// Constants
export { ERROR_CONFIG } from './constants';

// Re-export shared utilities
export { generateRandomError, simulateMemoryLeak } from '../shared/utils';
