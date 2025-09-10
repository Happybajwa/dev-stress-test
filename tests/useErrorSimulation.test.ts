import { renderHook, act } from '@testing-library/react';
import { useErrorSimulation } from '../src/react/hooks/useErrorSimulation';
import { enableDevStress, resetDevStress } from '../src/react/utils/globalUtils';

// Mock fetch for testing
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock XMLHttpRequest
const mockXHR = {
    open: jest.fn(),
    send: jest.fn(),
    setRequestHeader: jest.fn(),
    addEventListener: jest.fn(),
};
(global as any).XMLHttpRequest = jest.fn(() => mockXHR);

describe('useErrorSimulation Hook', () => {
    let cleanupFunctions: (() => void)[] = [];

    beforeEach(() => {
        // Reset and enable global state properly
        resetDevStress();
        enableDevStress();

        // Clear mocks
        jest.clearAllMocks();
        mockFetch.mockClear();

        // Reset console methods
        jest.spyOn(console, 'error').mockImplementation(() => { });
        jest.spyOn(console, 'warn').mockImplementation(() => { });
        jest.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterEach(() => {
        // Clean up all async operations
        cleanupFunctions.forEach(cleanup => cleanup());
        cleanupFunctions = [];

        // Restore console methods
        jest.restoreAllMocks();
    });

    afterAll(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
    });

    describe('Hook Initialization', () => {
        it('should initialize with empty state', () => {
            const { result } = renderHook(() => useErrorSimulation());

            expect(result.current.logs).toEqual([]);
            expect(result.current.metrics).toEqual([]);
            expect(result.current.runningTests.size).toBe(0);
            expect(typeof result.current.simulateError).toBe('function');
            expect(typeof result.current.stopError).toBe('function');
            expect(typeof result.current.stopAllErrors).toBe('function');
            expect(typeof result.current.clearLogs).toBe('function');
            expect(typeof result.current.startError).toBe('function');
        }); it('should initialize global state', () => {
            renderHook(() => useErrorSimulation());

            expect((window as any).__DEV_STRESS_TEST).toBeDefined();
            expect((window as any).__DEV_STRESS_TEST.slowNetwork).toBe(false);
            expect((window as any).__DEV_STRESS_TEST.networkFailureActive).toBe(false);
            expect((window as any).__DEV_STRESS_TEST.corsErrorActive).toBe(false);
        });
    });

    describe('Network Error Simulation', () => {
        it('should trigger network failure', async () => {
            const onError = jest.fn();
            const { result } = renderHook(() => useErrorSimulation({ onError }));

            await act(async () => {
                result.current.simulateError('network');
                // Wait a bit for the async operation to start
                await new Promise(resolve => setTimeout(resolve, 50));
            });

            expect(result.current.runningTests.has('network')).toBe(true);
            expect((window as any).__DEV_STRESS_TEST.networkFailureActive).toBe(true);

            // Make a fetch request to trigger the error
            await act(async () => {
                try {
                    await fetch('/test-url');
                } catch (error) {
                    // Expected to fail
                }
            });

            expect(onError).toHaveBeenCalledWith('network', expect.any(Number));
        });

        it('should stop network failure', async () => {
            const { result } = renderHook(() => useErrorSimulation());

            // Start network failure
            await act(async () => {
                result.current.simulateError('network');
            });

            // Stop network failure
            await act(async () => {
                result.current.stopError('network');
            });

            expect(result.current.runningTests.has('network')).toBe(false);
            expect((window as any).__DEV_STRESS_TEST.networkFailureActive).toBe(false);
        });

        it('should intercept fetch requests during network failure', async () => {
            const { result } = renderHook(() => useErrorSimulation());

            await act(async () => {
                result.current.simulateError('network');
            });

            // Try to make a fetch request
            try {
                await fetch('/api/test');
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                expect((error as Error).message).toContain('Network request failed');
            }
        });
    });

    describe('CORS Error Simulation', () => {
        it('should trigger CORS errors', async () => {
            const onError = jest.fn();
            const { result } = renderHook(() => useErrorSimulation({ onError }));

            await act(async () => {
                result.current.simulateError('cors-error');
                // Wait a bit for the async operation to start
                await new Promise(resolve => setTimeout(resolve, 50));
            });

            expect(result.current.runningTests.has('cors-error')).toBe(true);
            expect((window as any).__DEV_STRESS_TEST.corsErrorActive).toBe(true);
            
            // Make a fetch request to trigger the CORS error
            await act(async () => {
                try {
                    await fetch('/test-cors-url');
                } catch (error) {
                    // Expected to fail
                }
            });

            expect(onError).toHaveBeenCalledWith('cors-error', expect.any(Number));
        });

        it('should stop CORS errors', async () => {
            const { result } = renderHook(() => useErrorSimulation());

            await act(async () => {
                result.current.simulateError('cors-error');
            });

            await act(async () => {
                result.current.stopError('cors-error');
            });

            expect(result.current.runningTests.has('cors-error')).toBe(false);
            expect((window as any).__DEV_STRESS_TEST.corsErrorActive).toBe(false);
        });
    });

    describe('Memory Leak Simulation', () => {
        it('should start memory leak simulation', async () => {
            const onError = jest.fn();
            const { result } = renderHook(() => useErrorSimulation({ onError }));

            await act(async () => {
                result.current.simulateError('memory');
                // Wait for the interval to fire at least once (500ms + buffer)
                await new Promise(resolve => setTimeout(resolve, 600));
            });

            expect(result.current.runningTests.has('memory')).toBe(true);
            expect((window as any).__DEV_STRESS_TEST.memoryLeakIntervals.length).toBeGreaterThan(0);
            expect(onError).toHaveBeenCalledWith('memory', expect.any(Number));
        });

        it('should stop memory leak simulation', async () => {
            const { result } = renderHook(() => useErrorSimulation());

            await act(async () => {
                result.current.simulateError('memory');
            });

            await act(async () => {
                result.current.stopError('memory');
            });

            expect(result.current.runningTests.has('memory')).toBe(false);
            expect((window as any).__DEV_STRESS_TEST.memoryLeakIntervals.length).toBe(0);
        });
    });

    describe('JavaScript Error Simulation', () => {
        it('should trigger JavaScript errors', async () => {
            const onError = jest.fn();
            
            const { result } = renderHook(() => useErrorSimulation({ onError }));

            // Start the simulation outside of act since it's meant to throw unhandled errors
            result.current.simulateError('js');
            
            // Wait for the setTimeout to execute and callback to be called
            await new Promise(resolve => setTimeout(resolve, 200));

            expect(onError).toHaveBeenCalledWith('js', expect.any(Number));
        });
    });

    describe('Infinite Loop Simulation', () => {
        it('should start infinite loop simulation', async () => {
            const onError = jest.fn();
            const { result } = renderHook(() => useErrorSimulation({ onError }));

            await act(async () => {
                result.current.simulateError('infinite-loop');
                // Wait for the recursive loop to execute a few times
                await new Promise(resolve => setTimeout(resolve, 100));
            });

            expect(result.current.runningTests.has('infinite-loop')).toBe(true);
            expect((window as any).__DEV_STRESS_TEST.infiniteLoopRunning).toBe(true);
            expect(onError).toHaveBeenCalledWith('infinite-loop', expect.any(Number));
        });

        it('should stop infinite loop simulation', async () => {
            const { result } = renderHook(() => useErrorSimulation());

            await act(async () => {
                result.current.simulateError('infinite-loop');
            });

            await act(async () => {
                result.current.stopError('infinite-loop');
            });

            expect(result.current.runningTests.has('infinite-loop')).toBe(false);
            expect((window as any).__DEV_STRESS_TEST.infiniteLoopRunning).toBe(false);
        });
    });

    describe('Logging and Metrics', () => {
        it('should create logs when errors are triggered', async () => {
            const { result } = renderHook(() => useErrorSimulation({ showLogs: true }));

            await act(async () => {
                result.current.simulateError('network');
            });

            expect(result.current.logs.length).toBeGreaterThan(0);
            expect(result.current.logs[0].type).toBe('network');
            expect(result.current.logs[0].level).toBe('info');
        });

        it('should create metrics when errors are triggered', async () => {
            const { result } = renderHook(() => useErrorSimulation({ enableMetrics: true }));

            await act(async () => {
                result.current.simulateError('network');
                // Wait a bit for the async operation to start
                await new Promise(resolve => setTimeout(resolve, 50));
            });

            expect(result.current.metrics.length).toBeGreaterThan(0);
            expect(result.current.metrics[0].type).toBe('network');
            expect(result.current.metrics[0].status).toBe('running');
        });

        it('should clear logs', async () => {
            const { result } = renderHook(() => useErrorSimulation());

            await act(async () => {
                result.current.simulateError('network');
            });

            expect(result.current.logs.length).toBeGreaterThan(0);

            await act(async () => {
                result.current.clearLogs();
            });

            expect(result.current.logs.length).toBe(0);
        });

        it('should disable logging when enableLogging is false', async () => {
            const { result } = renderHook(() => useErrorSimulation({ enableLogging: false }));

            await act(async () => {
                result.current.simulateError('network');
            });

            expect(result.current.logs.length).toBe(0);
        });
    });

    describe('Callback Functions', () => {
        it('should call onErrorTriggered callback', async () => {
            const onErrorTriggered = jest.fn();
            const { result } = renderHook(() => useErrorSimulation({ onErrorTriggered }));

            await act(async () => {
                result.current.simulateError('network');
            });

            expect(onErrorTriggered).toHaveBeenCalledWith('network', expect.any(Number));
        });

        it('should call onErrorStopped callback', async () => {
            const onErrorStopped = jest.fn();
            const { result } = renderHook(() => useErrorSimulation({ onErrorStopped }));

            await act(async () => {
                result.current.simulateError('network');
            });

            await act(async () => {
                result.current.stopError('network');
            });

            expect(onErrorStopped).toHaveBeenCalledWith('network', expect.any(Number));
        });
    });

    describe('Stop All Errors', () => {
        it('should stop all running errors', async () => {
            const { result } = renderHook(() => useErrorSimulation());

            // Start multiple errors
            await act(async () => {
                result.current.simulateError('network');
                result.current.simulateError('cors-error');
                result.current.simulateError('memory');
                // Wait for async operations to start properly
                await new Promise(resolve => setTimeout(resolve, 100));
            });

            expect(result.current.runningTests.size).toBe(3);

            // Stop all errors
            await act(async () => {
                result.current.stopAllErrors();
            });

            expect(result.current.runningTests.size).toBe(0);
        });
    });
});
