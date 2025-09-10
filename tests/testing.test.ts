import { simulateError, enableTestMode, disableTestMode } from '../src/react/testing';

// Mock React for testing
const React = require('react');

describe('Testing Utilities', () => {
    beforeEach(() => {
        enableTestMode();
    });

    afterEach(() => {
        disableTestMode();
    });

    describe('enableTestMode and disableTestMode', () => {
        it('should enable test mode', () => {
            enableTestMode();
            expect(process.env.NODE_ENV).toBe('test');
        });

        it('should disable test mode', () => {
            const originalEnv = process.env.NODE_ENV;
            enableTestMode();
            disableTestMode();
            expect(process.env.NODE_ENV).toBe(originalEnv);
        });
    });

    describe('simulateError', () => {
        it('should trigger errors for testing', async () => {
            const TestComponent = () => React.createElement('div', null, 'Test');

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

            try {
                await simulateError(React.createElement(TestComponent), { 
                    message: 'Test error',
                    logError: true // Enable console logging
                });
            } catch (error) {
                // Expected to throw
                expect(error).toBeDefined();
            }

            // Should trigger some error behavior
            expect(consoleSpy).toHaveBeenCalled();

            consoleSpy.mockRestore();
        });

        it('should handle different error types', async () => {
            const TestComponent = () => React.createElement('div', null, 'Test');

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

            try {
                await simulateError(React.createElement(TestComponent), {
                    message: 'Network error',
                    delay: 100,
                    logError: true // Enable console logging
                });
            } catch (error) {
                // Expected to throw
                expect(error).toBeDefined();
            }

            expect(consoleSpy).toHaveBeenCalled();

            consoleSpy.mockRestore();
        });
    });
});
