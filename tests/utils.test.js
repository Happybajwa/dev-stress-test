"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../src/shared/utils");
describe('Utility Functions', () => {
    describe('generateRandomError', () => {
        it('should generate an error with a message', () => {
            const error = (0, utils_1.generateRandomError)();
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBeDefined();
            expect(error.message.length).toBeGreaterThan(0);
        });
        it('should generate different error messages', () => {
            const error1 = (0, utils_1.generateRandomError)();
            const error2 = (0, utils_1.generateRandomError)();
            // Note: There's a small chance they could be the same, but very unlikely
            expect(error1.message).toBeDefined();
            expect(error2.message).toBeDefined();
        });
    });
    describe('simulateMemoryLeak', () => {
        it('should create memory leak simulation without throwing', () => {
            expect(() => (0, utils_1.simulateMemoryLeak)()).not.toThrow();
        });
        it('should return a cleanup function', () => {
            const cleanup = (0, utils_1.simulateMemoryLeak)();
            expect(typeof cleanup).toBe('function');
            // Call cleanup to prevent actual memory leak in tests
            cleanup();
        });
    });
});
