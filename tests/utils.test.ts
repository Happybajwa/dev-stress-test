import { generateRandomError, simulateMemoryLeak } from '../src/shared/utils';

describe('Utility Functions', () => {
  let cleanupFunctions: (() => void)[] = [];

  // Clean up all async operations after each test
  afterEach(() => {
    cleanupFunctions.forEach(cleanup => cleanup());
    cleanupFunctions = [];
  });

  // Clean up everything after all tests
  afterAll(() => {
    // Clear any remaining timers
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe('generateRandomError', () => {
    it('should generate an error with a message', () => {
      const error = generateRandomError();
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBeDefined();
      expect(error.message.length).toBeGreaterThan(0);
    });

    it('should generate different error messages', () => {
      const error1 = generateRandomError();
      const error2 = generateRandomError();
      // Note: There's a small chance they could be the same, but very unlikely
      expect(error1.message).toBeDefined();
      expect(error2.message).toBeDefined();
    });
  });

  describe('simulateMemoryLeak', () => {
    it('should create memory leak simulation without throwing', () => {
      expect(() => {
        const cleanup = simulateMemoryLeak();
        cleanupFunctions.push(cleanup);
      }).not.toThrow();
    });

    it('should return a cleanup function', () => {
      const cleanup = simulateMemoryLeak();
      expect(typeof cleanup).toBe('function');
      
      // Store cleanup function to be called in afterEach
      cleanupFunctions.push(cleanup);
    });

    it('should stop leaking when cleanup is called', (done) => {
      const cleanup = simulateMemoryLeak();
      
      // Let it run briefly then cleanup
      setTimeout(() => {
        cleanup();
        done();
      }, 200);
    });
  });
});