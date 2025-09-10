import {
    enableDevStress,
    disableDevStress,
    isDevStressEnabled,
    setRandomSeed,
    clearRandomSeed,
    getErrorMetrics,
    clearErrorMetrics,
    getDevStressStatus,
    resetDevStress
} from '../src/react/utils/globalUtils';

describe('Global Utilities', () => {
    beforeEach(() => {
        // Reset global state before each test
        resetDevStress();
    });

    afterEach(() => {
        // Clean up after each test
        resetDevStress();
    });

    describe('enableDevStress and disableDevStress', () => {
        it('should enable dev stress test globally', () => {
            enableDevStress();
            expect(window.__DEV_STRESS_TEST?.enabled).toBe(true);
        });

        it('should disable dev stress test globally', () => {
            enableDevStress();
            expect(window.__DEV_STRESS_TEST?.enabled).toBe(true);

            disableDevStress();
            expect(window.__DEV_STRESS_TEST?.enabled).toBe(false);
        });

        it('should initialize global state when enabling', () => {
            enableDevStress();

            expect(window.__DEV_STRESS_TEST).toBeDefined();
            expect(window.__DEV_STRESS_TEST?.enabled).toBe(true);
            expect(window.__DEV_STRESS_TEST?.networkFailureActive).toBe(false);
            expect(window.__DEV_STRESS_TEST?.corsErrorActive).toBe(false);
            expect(window.__DEV_STRESS_TEST?.memoryLeakIntervals).toEqual([]);
            expect(window.__DEV_STRESS_TEST?.infiniteLoopRunning).toBe(false);
            expect(window.__DEV_STRESS_TEST?.metrics).toEqual([]);
        });
    });

    describe('Random Seed Management', () => {
        it('should set random seed', () => {
            const seed = 12345;
            setRandomSeed(seed);

            expect(window.__DEV_STRESS_TEST?.randomSeed).toBe(seed);

            const status = getDevStressStatus();
            expect(status.hasRandomSeed).toBe(true);
        });

        it('should clear random seed', () => {
            setRandomSeed(12345);
            clearRandomSeed();

            expect(window.__DEV_STRESS_TEST?.randomSeed).toBeUndefined();

            const status = getDevStressStatus();
            expect(status.hasRandomSeed).toBe(false);
        });
    });

    describe('Error Metrics', () => {
        it('should track error metrics', () => {
            enableDevStress();

            // Simulate adding some metrics
            const mockMetrics = [
                { type: 'network' as const, triggeredAt: Date.now(), status: 'running' as const },
                { type: 'cors-error' as const, triggeredAt: Date.now(), status: 'stopped' as const, duration: 1000 }
            ];

            // Add metrics to global state
            if (window.__DEV_STRESS_TEST) {
                window.__DEV_STRESS_TEST.metrics = mockMetrics;
            }

            const metrics = getErrorMetrics();
            expect(metrics).toEqual(mockMetrics);
        });

        it('should clear error metrics', () => {
            enableDevStress();

            // Add some metrics
            if (window.__DEV_STRESS_TEST) {
                window.__DEV_STRESS_TEST.metrics = [
                    { type: 'network' as const, triggeredAt: Date.now(), status: 'running' as const }
                ];
            }

            clearErrorMetrics();

            const metrics = getErrorMetrics();
            expect(metrics).toEqual([]);
        });

        it('should return empty array when global state is not initialized', () => {
            const metrics = getErrorMetrics();
            expect(metrics).toEqual([]);
        });
    });

    describe('getDevStressStatus', () => {
        it('should return current status when enabled', () => {
            enableDevStress();
            setRandomSeed(12345);

            const status = getDevStressStatus();

            expect(status.enabled).toBe(true);
            expect(status.hasRandomSeed).toBe(true);
            expect(status.metricsCount).toBe(0);
            expect(status.activeErrors.slowNetwork).toBe(false);
            expect(status.activeErrors.infiniteLoop).toBe(false);
            expect(status.activeErrors.memoryLeaks).toBe(0);
            expect(typeof status.environment).toBe('string');
        });

        it('should show active errors when they are running', () => {
            enableDevStress();

            // Simulate active tests
            if (window.__DEV_STRESS_TEST) {
                window.__DEV_STRESS_TEST.slowNetwork = true;
                window.__DEV_STRESS_TEST.infiniteLoopRunning = true;
                // Mock setTimeout to return number for testing
                const mockInterval = setTimeout(() => { }, 1000) as any;
                window.__DEV_STRESS_TEST.memoryLeakIntervals = [mockInterval, mockInterval, mockInterval];
            }

            const status = getDevStressStatus();

            expect(status.activeErrors.slowNetwork).toBe(true);
            expect(status.activeErrors.infiniteLoop).toBe(true);
            expect(status.activeErrors.memoryLeaks).toBe(3);

            // Clean up
            if (window.__DEV_STRESS_TEST) {
                window.__DEV_STRESS_TEST.memoryLeakIntervals.forEach(clearTimeout);
            }
        });

        it('should show metrics count', () => {
            enableDevStress();

            // Add some metrics
            if (window.__DEV_STRESS_TEST) {
                window.__DEV_STRESS_TEST.metrics = [
                    { type: 'network' as const, triggeredAt: Date.now(), status: 'running' as const },
                    { type: 'cors-error' as const, triggeredAt: Date.now(), status: 'stopped' as const }
                ];
            }

            const status = getDevStressStatus();
            expect(status.metricsCount).toBe(2);
        });
    });

    describe('resetDevStress', () => {
        it('should reset all dev stress state', () => {
            enableDevStress();
            setRandomSeed(12345);

            // Set up some active state
            if (window.__DEV_STRESS_TEST) {
                window.__DEV_STRESS_TEST.slowNetwork = true;
                window.__DEV_STRESS_TEST.infiniteLoopRunning = true;
                const mockInterval = setTimeout(() => { }, 1000) as any;
                window.__DEV_STRESS_TEST.memoryLeakIntervals = [mockInterval];
                window.__DEV_STRESS_TEST.metrics = [
                    { type: 'network' as const, triggeredAt: Date.now(), status: 'running' as const }
                ];
            }

            resetDevStress();

            expect(window.__DEV_STRESS_TEST?.slowNetwork).toBe(false);
            expect(window.__DEV_STRESS_TEST?.infiniteLoopRunning).toBe(false);
            expect(window.__DEV_STRESS_TEST?.memoryLeakIntervals).toEqual([]);
            expect(window.__DEV_STRESS_TEST?.metrics).toEqual([]);

            const metrics = getErrorMetrics();
            expect(metrics).toEqual([]);
        });

        it('should clean up intervals', async () => {
            enableDevStress();

            // Set up some intervals using real setInterval so they have proper node IDs
            const mockInterval1 = setInterval(() => { }, 10000); // Very long interval that won't fire
            const mockInterval2 = setInterval(() => { }, 10000);

            if (window.__DEV_STRESS_TEST) {
                window.__DEV_STRESS_TEST.memoryLeakIntervals = [mockInterval1, mockInterval2];
            }

            // Mock clearInterval after setting up intervals to avoid counting setup calls
            const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

            resetDevStress();

            // Check that the specific intervals were cleared
            expect(clearIntervalSpy.mock.calls.some(call => call[0] === mockInterval1)).toBe(true);
            expect(clearIntervalSpy.mock.calls.some(call => call[0] === mockInterval2)).toBe(true);

            clearIntervalSpy.mockRestore();

            // Clean up any remaining intervals (though they should already be cleared)
            clearInterval(mockInterval1);
            clearInterval(mockInterval2);
        });

        it('should preserve original fetch reference', () => {
            enableDevStress();
            const originalFetch = window.__DEV_STRESS_TEST?.originalFetch;

            resetDevStress();

            expect(window.__DEV_STRESS_TEST?.originalFetch).toBe(originalFetch);
        });

        it('should preserve enabled state', () => {
            enableDevStress();
            expect(window.__DEV_STRESS_TEST?.enabled).toBe(true);

            resetDevStress();

            expect(window.__DEV_STRESS_TEST?.enabled).toBe(true);

            // Test disabled state too
            disableDevStress();
            expect(window.__DEV_STRESS_TEST?.enabled).toBe(false);

            resetDevStress();

            expect(window.__DEV_STRESS_TEST?.enabled).toBe(false);
        });
    });

    describe('isDevStressEnabled', () => {
        it('should return true when enabled globally', () => {
            enableDevStress();
            expect(isDevStressEnabled()).toBe(true);
        });

        it('should return false when disabled globally', () => {
            enableDevStress();
            disableDevStress();
            expect(isDevStressEnabled()).toBe(false);
        });

        it('should return true in development environment by default', () => {
            const originalEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'development';

            expect(isDevStressEnabled()).toBe(true);

            process.env.NODE_ENV = originalEnv;
        });

        it('should return false in production environment by default', () => {
            const originalEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'production';

            expect(isDevStressEnabled()).toBe(false);

            process.env.NODE_ENV = originalEnv;
        });
    });
});
