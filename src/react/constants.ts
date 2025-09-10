import { ErrorType } from './types';

export const ERROR_CONFIG: Record<ErrorType, {
  label: string;
  description: string;
  color: string;
  darkColor: string;
  icon: string;
  category: 'network' | 'runtime' | 'performance' | 'storage' | 'browser';
  severity: 'low' | 'medium' | 'high' | 'critical';
  canStop: boolean;
}> = {
  network: {
    label: 'Network Failure',
    description: 'Simulate network request failures and connectivity issues',
    color: '#475569',
    darkColor: '#64748b',
    icon: '🌐',
    category: 'network',
    severity: 'medium',
    canStop: false,
  },
  js: {
    label: 'JavaScript Error',
    description: 'Throw synchronous JavaScript runtime errors',
    color: '#dc2626',
    darkColor: '#ef4444',
    icon: '⚠️',
    category: 'runtime',
    severity: 'high',
    canStop: false,
  },
  unhandled: {
    label: 'Unhandled Promise',
    description: 'Create unhandled promise rejections',
    color: '#7c2d12',
    darkColor: '#ea580c',
    icon: '🔮',
    category: 'runtime',
    severity: 'high',
    canStop: false,
  },
  timeout: {
    label: 'Timeout Error',
    description: 'Simulate delayed execution and timeout scenarios',
    color: '#0891b2',
    darkColor: '#06b6d4',
    icon: '⏱️',
    category: 'runtime',
    severity: 'medium',
    canStop: false,
  },
  misconfig: {
    label: 'Configuration Error',
    description: 'Simulate application misconfiguration issues',
    color: '#059669',
    darkColor: '#10b981',
    icon: '⚙️',
    category: 'runtime',
    severity: 'medium',
    canStop: false,
  },
  memory: {
    label: 'Memory Leak',
    description: 'Create progressive memory consumption leak',
    color: '#b91c1c',
    darkColor: '#dc2626',
    icon: '🧠',
    category: 'performance',
    severity: 'critical',
    canStop: true,
  },
  'infinite-loop': {
    label: 'Infinite Loop',
    description: 'Block main thread with infinite recursion',
    color: '#991b1b',
    darkColor: '#b91c1c',
    icon: '♾️',
    category: 'performance',
    severity: 'critical',
    canStop: true,
  },
  'dom-error': {
    label: 'DOM Error',
    description: 'Access non-existent DOM elements and properties',
    color: '#c2410c',
    darkColor: '#ea580c',
    icon: '🏗️',
    category: 'browser',
    severity: 'medium',
    canStop: false,
  },
  'undefined-access': {
    label: 'Undefined Access',
    description: 'Access properties on undefined or null objects',
    color: '#7c3aed',
    darkColor: '#8b5cf6',
    icon: '❓',
    category: 'runtime',
    severity: 'high',
    canStop: false,
  },
  'react-render-error': {
    label: 'React Render Error',
    description: 'Throw errors during React component rendering',
    color: '#1d4ed8',
    darkColor: '#3b82f6',
    icon: '⚛️',
    category: 'runtime',
    severity: 'high',
    canStop: false,
  },
  'effect-error': {
    label: 'Effect Error',
    description: 'Simulate React useEffect hook errors',
    color: '#0d9488',
    darkColor: '#14b8a6',
    icon: '🎣',
    category: 'runtime',
    severity: 'medium',
    canStop: false,
  },
  'slow-network': {
    label: 'Slow Network',
    description: 'Simulate degraded network conditions and latency',
    color: '#92400e',
    darkColor: '#d97706',
    icon: '🐌',
    category: 'network',
    severity: 'low',
    canStop: true,
  },
  'cors-error': {
    label: 'CORS Error',
    description: 'Trigger cross-origin request security failures',
    color: '#374151',
    darkColor: '#6b7280',
    icon: '🚫',
    category: 'network',
    severity: 'medium',
    canStop: false,
  },
  'storage-error': {
    label: 'Storage Error',
    description: 'Exhaust browser storage capacity limits',
    color: '#4b5563',
    darkColor: '#6b7280',
    icon: '💾',
    category: 'storage',
    severity: 'medium',
    canStop: false,
  },
  'sw-error': {
    label: 'Service Worker Error',
    description: 'Fail service worker registration and updates',
    color: '#374151',
    darkColor: '#6b7280',
    icon: '👷',
    category: 'browser',
    severity: 'low',
    canStop: false,
  },
};

export const ANIMATION_CONFIG = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const SHADOWS = {
  light: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    glow: '0 0 20px rgba(59, 130, 246, 0.15)',
  },
  dark: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
    glow: '0 0 20px rgba(96, 165, 250, 0.25)',
  },
};
