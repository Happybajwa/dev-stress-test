export type ErrorType =
  | 'network'
  | 'js'
  | 'unhandled'
  | 'timeout'
  | 'misconfig'
  | 'memory'
  | 'infinite-loop'
  | 'dom-error'
  | 'undefined-access'
  | 'react-render-error'
  | 'effect-error'
  | 'slow-network'
  | 'cors-error'
  | 'storage-error'
  | 'sw-error';

export type ButtonPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'center';

export type Theme = 'light' | 'dark' | 'auto';

export type Env = 'dev' | 'uat' | 'prod';

export interface DevStressPanelProps {
  position?: ButtonPosition;
  errorTypes?: ErrorType[];
  env?: Env;
  showInProd?: boolean;
  showInUat?: boolean;
  theme?: Theme;
  enableLogging?: boolean;
  enableMetrics?: boolean;
  onErrorTriggered?: (type: ErrorType, timestamp: number) => void;
  onErrorStopped?: (type: ErrorType, timestamp: number) => void;
  className?: string;
  style?: React.CSSProperties;
  onError?: (type: ErrorType, timestamp: number) => void;
  isDarkMode?: boolean;
  showLogs?: boolean;
  maxLogs?: number;
}

// Keep backwards compatibility
export interface ErrorButtonPanelProps extends DevStressPanelProps {}

export interface ErrorMetrics {
  type: ErrorType;
  triggeredAt: number;
  stoppedAt?: number;
  duration?: number;
  status: 'running' | 'stopped' | 'error';
}

export interface ErrorLog {
  id: string;
  type: ErrorType;
  message: string;
  timestamp: number;
  level: 'info' | 'warning' | 'error';
}

declare global {
  interface Window {
    __DEV_STRESS_TEST?: {
      slowNetwork: boolean;
      networkFailureActive: boolean;
      corsErrorActive: boolean;
      memoryLeakIntervals: NodeJS.Timeout[];
      infiniteLoopRunning: boolean;
      originalFetch: typeof fetch;
      metrics: ErrorMetrics[];
      enabled?: boolean;
      randomSeed?: number;
    };
  }

  interface XMLHttpRequest {
    _devStressUrl?: string;
  }
}

export interface UseErrorSimulationOptions {
  onError?: (type: ErrorType, timestamp: number) => void;
  showLogs?: boolean;
  maxLogs?: number;
  enableLogging?: boolean;
  enableMetrics?: boolean;
  onErrorTriggered?: (type: ErrorType, timestamp: number) => void;
  onErrorStopped?: (type: ErrorType, timestamp: number) => void;
}
