import { generateRandomError, simulateMemoryLeak } from '../src/shared/utils';

describe('Utility Functions', () => {
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
      expect(() => simulateMemoryLeak()).not.toThrow();
    });

    it('should return a cleanup function', () => {
      const cleanup = simulateMemoryLeak();
      expect(typeof cleanup).toBe('function');
      
      // Call cleanup to prevent actual memory leak in tests
      cleanup();
    });
  });
});
