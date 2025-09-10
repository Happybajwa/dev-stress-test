import '@testing-library/jest-dom';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

// Setup global fetch mock
global.fetch = jest.fn();

// Setup window.location mock - only if not already defined
if (!window.location) {
  Object.defineProperty(window, 'location', {
    value: {
      href: 'http://localhost',
      search: '',
      pathname: '/',
    },
    writable: true
  });
}

// Clean up global state before each test
beforeEach(() => {
  // Clear all mocks
  jest.clearAllMocks();
  
  // Reset global state
  delete (window as any).__DEV_STRESS_TEST;
  
  // Reset console mocks
  (console.log as jest.Mock).mockClear();
  (console.error as jest.Mock).mockClear();
  (console.warn as jest.Mock).mockClear();
});
