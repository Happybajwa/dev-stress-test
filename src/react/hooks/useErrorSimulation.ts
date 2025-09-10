import { useCallback, useEffect, useRef, useState } from 'react';
import { ErrorType, ErrorMetrics, ErrorLog, UseErrorSimulationOptions } from '../types';

export function useErrorSimulation(options: UseErrorSimulationOptions = {}) {
  const {
    onError,
    showLogs = true,
    maxLogs = 100,
    enableLogging = true,
    enableMetrics = true,
    onErrorTriggered,
    onErrorStopped
  } = options;

  const [logs, setLogs] = useState<ErrorLog[]>([]);
  const [metrics, setMetrics] = useState<ErrorMetrics[]>([]);
  const [runningTests, setRunningTests] = useState<Set<ErrorType>>(new Set());

  const logIdCounter = useRef(0);

  // Initialize global state
  useEffect(() => {
    if (!window.__DEV_STRESS_TEST) {
      window.__DEV_STRESS_TEST = {
        slowNetwork: false,
        networkFailureActive: false,
        corsErrorActive: false,
        memoryLeakIntervals: [],
        infiniteLoopRunning: false,
        originalFetch: fetch,
        metrics: [],
      };
    }
  }, []);

  const addLog = useCallback((type: ErrorType, message: string, level: 'info' | 'warning' | 'error' = 'info') => {
    if (!enableLogging) return;

    const log: ErrorLog = {
      id: `${Date.now()}-${++logIdCounter.current}`,
      type,
      message,
      timestamp: Date.now(),
      level,
    };

    setLogs(prev => [log, ...prev.slice(0, 99)]); // Keep only last 100 logs
  }, [enableLogging]);

  const addMetric = useCallback((type: ErrorType, status: ErrorMetrics['status']) => {
    if (!enableMetrics) return;

    const timestamp = Date.now();

    setMetrics(prev => {
      const existing = prev.find(m => m.type === type && m.status === 'running');

      if (status === 'running') {
        if (existing) return prev; // Already running

        const newMetric: ErrorMetrics = {
          type,
          triggeredAt: timestamp,
          status: 'running',
        };

        return [newMetric, ...prev];
      } else if (status === 'stopped' && existing) {
        return prev.map(m =>
          m === existing
            ? { ...m, stoppedAt: timestamp, duration: timestamp - m.triggeredAt, status: 'stopped' }
            : m
        );
      }

      return prev;
    });
  }, [enableMetrics]);

  const simulateError = useCallback(async (type: ErrorType) => {
    const timestamp = Date.now();

    try {
      // Track running state for all error types
      setRunningTests(prev => new Set([...prev, type]));
      addMetric(type, 'running');

      switch (type) {
        case 'network':
          // Enable persistent network failures with on/off control
          if (!window.__DEV_STRESS_TEST) return;

          window.__DEV_STRESS_TEST.networkFailureActive = true;

          // Override global fetch to make ALL network requests fail
          if (!window.__DEV_STRESS_TEST.originalFetch) {
            window.__DEV_STRESS_TEST.originalFetch = window.fetch;
          }

          window.fetch = async (...args) => {
            if (window.__DEV_STRESS_TEST?.networkFailureActive) {
              // Always fail when network failure is active
              const url = typeof args[0] === 'string' ? args[0] : args[0]?.toString() || 'unknown';
              onError?.('network', Date.now());
              throw new Error(`[DevStressTest] Network request failed: ${url} - Connection refused (ERR_NETWORK_FAILED)`);
            }
            return window.__DEV_STRESS_TEST?.originalFetch(...args) ?? fetch(...args);
          };

          addLog(type, 'Network failures activated - ALL fetch requests will fail until stopped', 'error');
          break;

        case 'cors-error':
          // Simulate aggressive CORS policy violations
          if (!window.__DEV_STRESS_TEST) return;

          window.__DEV_STRESS_TEST.corsErrorActive = true;

          // Override fetch to simulate CORS errors with realistic browser behavior
          if (!window.__DEV_STRESS_TEST.originalFetch) {
            window.__DEV_STRESS_TEST.originalFetch = window.fetch;
          }

          window.fetch = async (...args) => {
            if (window.__DEV_STRESS_TEST?.corsErrorActive) {
              const url = typeof args[0] === 'string' ? args[0] : args[0]?.toString() || 'unknown';

              // Simulate different CORS scenarios
              const corsErrors = [
                `Access to fetch at '${url}' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.`,
                `Access to fetch at '${url}' has been blocked by CORS policy: The request client is not a secure context and the resource is in more-private address space 'local'.`,
                `Access to fetch at '${url}' has been blocked by CORS policy: Request header field 'authorization' is not allowed by Access-Control-Allow-Headers in preflight response.`,
                `Access to fetch at '${url}' has been blocked by CORS policy: Method PUT is not allowed by Access-Control-Allow-Methods in preflight response.`,
                `Access to fetch at '${url}' has been blocked by CORS policy: The value of the 'Access-Control-Allow-Credentials' header in the response is '' which must be 'true' when the request's credentials mode is 'include'.`
              ];

              const randomError = corsErrors[Math.floor(Math.random() * corsErrors.length)];
              const error = new TypeError(randomError);
              (error as any).name = 'TypeError';

              onError?.('cors-error', Date.now());

              // Simulate the way browsers handle CORS - fail silently or with network error
              if (Math.random() < 0.7) {
                throw error;
              } else {
                // Sometimes CORS manifests as a generic network error
                throw new Error(`[DevStressTest] Failed to fetch - CORS policy blocked request to ${url}`);
              }
            }
            return window.__DEV_STRESS_TEST?.originalFetch(...args) ?? fetch(...args);
          };

          // Also intercept XMLHttpRequest for complete coverage
          const originalXHROpen = XMLHttpRequest.prototype.open;
          const originalXHRSend = XMLHttpRequest.prototype.send;

          // Store originals for restoration
          (XMLHttpRequest.prototype as any)._devStressOriginalOpen = originalXHROpen;
          (XMLHttpRequest.prototype as any)._devStressOriginalSend = originalXHRSend;

          XMLHttpRequest.prototype.open = function (method: string, url: string | URL, async?: boolean, username?: string | null, password?: string | null) {
            this._devStressUrl = url.toString();
            return originalXHROpen.call(this, method, url, async !== undefined ? async : true, username, password);
          };

          XMLHttpRequest.prototype.send = function (data?: Document | XMLHttpRequestBodyInit | null) {
            if (window.__DEV_STRESS_TEST?.corsErrorActive) {
              setTimeout(() => {
                const event = new Event('error');
                this.dispatchEvent(event);
                console.error(`[DevStressTest] CORS Error: XMLHttpRequest to ${this._devStressUrl} blocked by CORS policy`);
              }, 50);
              return;
            }
            return originalXHRSend.call(this, data);
          };

          addLog(type, 'CORS errors activated - All cross-origin requests will be blocked', 'error');
          break;

        case 'js':
          // Don't catch this - let it actually break the app
          setTimeout(() => {
            onError?.('js', Date.now());
            // In test environment, don't let the error crash the test
            if (process.env.NODE_ENV === 'test') {
              try {
                throw new Error(`[DevStressTest] Simulated JavaScript Error - ${new Date().toISOString()}`);
              } catch (error) {
                // Log the error but don't let it become unhandled in tests
                if (typeof console !== 'undefined' && console.error) {
                  console.error('DevStressTest JavaScript Error (caught in test):', error);
                }
              }
            } else {
              throw new Error(`[DevStressTest] Simulated JavaScript Error - ${new Date().toISOString()}`);
            }
          }, Math.random() * 100); // Random timing to make it unpredictable
          break;

        case 'unhandled':
          // Create multiple unhandled rejections
          for (let i = 0; i < 3; i++) {
            setTimeout(() => {
              Promise.reject(new Error(`[DevStressTest] Unhandled Promise Rejection #${i + 1} - ${new Date().toISOString()}`));
            }, i * 200 + Math.random() * 100);
          }
          break;

        case 'timeout':
          // Create cascading timeouts that compound the problem
          const timeouts = [100, 0, 50, 200, 10]; // Different timing
          timeouts.forEach((delay, index) => {
            setTimeout(() => {
              throw new Error(`[DevStressTest] Timeout Error Chain #${index + 1} - Operation exceeded time limit - ${new Date().toISOString()}`);
            }, delay);
          });

          // Override setTimeout to make some calls fail
          const originalSetTimeout = window.setTimeout;
          window.setTimeout = function (callback: Function, delay?: number) {
            if (Math.random() < 0.2) { // 20% of setTimeout calls fail
              throw new Error('[DevStressTest] Timer system corrupted - setTimeout failed');
            }
            return originalSetTimeout(callback, delay);
          } as any;

          // Restore after chaos period
          setTimeout(() => {
            window.setTimeout = originalSetTimeout;
          }, 8000);
          break;

        case 'misconfig':
          window.dispatchEvent(
            new CustomEvent('dev-stress-test-misconfig', {
              detail: { message: 'Missing API Key', timestamp }
            })
          );
          break;

        case 'memory': {
          if (!window.__DEV_STRESS_TEST) return;

          const memoryInterval = setInterval(() => {
            // Create memory leak with large arrays
            const leak = new Array(100000).fill(Math.random().toString(36));
            (window as any).__DEV_MEMORY_LEAK = (window as any).__DEV_MEMORY_LEAK || [];
            (window as any).__DEV_MEMORY_LEAK.push(leak);
            onError?.('memory', Date.now());
          }, 500);

          window.__DEV_STRESS_TEST.memoryLeakIntervals.push(memoryInterval);
          break;
        }

        case 'infinite-loop': {
          if (!window.__DEV_STRESS_TEST) return;

          window.__DEV_STRESS_TEST.infiniteLoopRunning = true;
          const recursiveLoop = () => {
            if (!window.__DEV_STRESS_TEST?.infiniteLoopRunning) return;
            onError?.('infinite-loop', Date.now());
            // Use setTimeout to avoid blocking completely
            setTimeout(recursiveLoop, 1);
          };
          recursiveLoop();
          break;
        }

        case 'slow-network': {
          if (!window.__DEV_STRESS_TEST) return;

          window.__DEV_STRESS_TEST.slowNetwork = true;

          // Mock slow fetch
          const originalFetch = window.fetch;
          window.fetch = async (...args) => {
            if (window.__DEV_STRESS_TEST?.slowNetwork) {
              await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));
            }
            return originalFetch(...args);
          };
          break;
        }

        case 'dom-error':
          // Create cascading DOM errors that are hard to debug
          const intervals: NodeJS.Timeout[] = [];

          // Continuously try to access non-existent elements
          for (let i = 0; i < 10; i++) {
            const interval = setInterval(() => {
              try {
                // Different types of DOM failures
                const selectors = [
                  '#user-profile-settings',
                  '.navigation-menu-item',
                  '[data-testid="submit-button"]',
                  'input[name="user-email"]',
                  '.sidebar .user-preferences'
                ];
                const selector = selectors[Math.floor(Math.random() * selectors.length)];
                const element = document.querySelector(selector) as any;

                // Try to manipulate the non-existent element
                element.innerHTML = 'Modified content';
                element.addEventListener('click', () => { });
                element.style.display = 'none';
                element.scrollIntoView();
              } catch (err) {
                // Let the error bubble up
                console.error(`[DevStressTest] DOM Error: Failed to access element - ${err}`);
                throw err;
              }
            }, 500 + Math.random() * 1000);
            intervals.push(interval);
          }

          // Clean up after random time
          setTimeout(() => {
            intervals.forEach(clearInterval);
          }, 8000 + Math.random() * 7000);
          break;

        case 'undefined-access': {
          // Create a cascading failure that's hard to debug
          try {
            const obj: any = null;
            // Multiple property accesses to make debugging harder
            setTimeout(() => {
              console.log(obj.user.profile.settings.theme.primaryColor);
            }, 50);
            setTimeout(() => {
              obj.data.items[0].children.forEach((item: any) => item.process());
            }, 100);
            setTimeout(() => {
              obj.api.endpoints.users.get().then((response: any) => response.json());
            }, 150);
          } catch (err) {
            // Let the errors bubble up naturally
            throw err;
          }
          break;
        }

        case 'react-render-error':
          // Throw immediately without setTimeout to break render cycle
          throw new Error(`[DevStressTest] React Render Error - Component crashed during render - ${new Date().toISOString()}`);

        case 'effect-error':
          // Create multiple effect errors that happen at different times
          for (let i = 0; i < 5; i++) {
            setTimeout(() => {
              throw new Error(`[DevStressTest] useEffect Error #${i + 1} - Effect cleanup failed - ${new Date().toISOString()}`);
            }, i * 300 + Math.random() * 200);
          }
          break;

        case 'storage-error': {
          // Exhaust storage quota and break localStorage completely
          try {
            const largeData = new Array(1000000).fill('x').join(''); // Much larger chunks

            // Fill storage completely
            for (let i = 0; i < 500; i++) {
              localStorage.setItem(`dev-stress-test-${i}`, largeData);
            }

            // Override localStorage to make it always fail
            const originalSetItem = localStorage.setItem;
            const originalGetItem = localStorage.getItem;

            Storage.prototype.setItem = function () {
              throw new Error('[DevStressTest] Storage quota exceeded - Cannot save data');
            };

            Storage.prototype.getItem = function (key: string) {
              if (Math.random() < 0.3) { // 30% chance of failure
                throw new Error(`[DevStressTest] Storage read error - Failed to read ${key}`);
              }
              return originalGetItem.call(this, key);
            };

            // Restore after longer time
            setTimeout(() => {
              Storage.prototype.setItem = originalSetItem;
              Storage.prototype.getItem = originalGetItem;
              // Clean up
              for (let i = 0; i < 500; i++) {
                try {
                  localStorage.removeItem(`dev-stress-test-${i}`);
                } catch { }
              }
            }, 15000 + Math.random() * 10000);

          } catch (err) {
            addLog(type, `Storage completely broken: ${err}`, 'error');
            throw err; // Let it break the app
          }
          break;
        }

        case 'sw-error':
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/dev-stress-test-invalid-sw.js')
              .catch(() => addLog(type, 'Service worker registration failed as expected', 'info'));
          }
          break;
      }

      addLog(type, `Triggered ${type} simulation`, 'info');
      onErrorTriggered?.(type, timestamp);

    } catch (err: any) {
      addLog(type, `Error during simulation: ${err.message}`, 'error');
      throw err; // Re-throw to maintain error behavior
    }
  }, [addLog, addMetric, onErrorTriggered]);

  const stopError = useCallback((type: 'memory' | 'infinite-loop' | 'slow-network' | 'network' | 'cors-error') => {
    const timestamp = Date.now();

    if (!window.__DEV_STRESS_TEST) return;

    switch (type) {
      case 'memory':
        window.__DEV_STRESS_TEST.memoryLeakIntervals.forEach(clearInterval);
        window.__DEV_STRESS_TEST.memoryLeakIntervals = [];
        (window as any).__DEV_MEMORY_LEAK = null;
        break;

      case 'infinite-loop':
        window.__DEV_STRESS_TEST.infiniteLoopRunning = false;
        break;

      case 'slow-network':
        window.__DEV_STRESS_TEST.slowNetwork = false;
        if (window.__DEV_STRESS_TEST.originalFetch) {
          window.fetch = window.__DEV_STRESS_TEST.originalFetch;
        }
        break;

      case 'network':
        window.__DEV_STRESS_TEST.networkFailureActive = false;
        if (window.__DEV_STRESS_TEST.originalFetch) {
          window.fetch = window.__DEV_STRESS_TEST.originalFetch;
        }
        addLog(type, 'Network failures deactivated - fetch requests restored', 'info');
        break;

      case 'cors-error':
        window.__DEV_STRESS_TEST.corsErrorActive = false;
        if (window.__DEV_STRESS_TEST.originalFetch) {
          window.fetch = window.__DEV_STRESS_TEST.originalFetch;
        }
        // Restore XMLHttpRequest if we overrode it
        try {
          // Reset XMLHttpRequest to browser defaults by restoring prototypes
          if ((XMLHttpRequest.prototype as any)._devStressOriginalOpen) {
            XMLHttpRequest.prototype.open = (XMLHttpRequest.prototype as any)._devStressOriginalOpen;
            delete (XMLHttpRequest.prototype as any)._devStressOriginalOpen;
          }
          if ((XMLHttpRequest.prototype as any)._devStressOriginalSend) {
            XMLHttpRequest.prototype.send = (XMLHttpRequest.prototype as any)._devStressOriginalSend;
            delete (XMLHttpRequest.prototype as any)._devStressOriginalSend;
          }
        } catch {
          // If we can't restore, at least disable the override
        }
        addLog(type, 'CORS errors deactivated - cross-origin requests restored', 'info');
        break;
    }

    setRunningTests(prev => {
      const newSet = new Set(prev);
      newSet.delete(type);
      return newSet;
    });

    addMetric(type, 'stopped');
    addLog(type, `Stopped ${type} simulation`, 'info');
    onErrorStopped?.(type, timestamp);
  }, [addLog, addMetric, onErrorStopped]);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const clearMetrics = useCallback(() => {
    setMetrics([]);
  }, []);

  // Cleanup on unmount
  const stopAllErrors = useCallback(async () => {
    const currentRunningTests = Array.from(runningTests);

    for (const errorType of currentRunningTests) {
      if (['network', 'memory', 'infinite-loop', 'slow-network', 'cors-error'].includes(errorType)) {
        await stopError(errorType as 'network' | 'memory' | 'infinite-loop' | 'slow-network' | 'cors-error');
      }
    }

    // Clear the running tests set
    setRunningTests(new Set());

    addLog('network', 'All error simulations stopped', 'info');
    console.log('🧹 dev-stress-test: All errors stopped');

    if (onErrorStopped) {
      onErrorStopped('network', Date.now());
    }
  }, [runningTests, stopError, addLog, onErrorStopped]);

  // Cleanup function
  useEffect(() => {
    return () => {
      if (window.__DEV_STRESS_TEST) {
        // Stop all running simulations
        window.__DEV_STRESS_TEST.memoryLeakIntervals.forEach(clearInterval);
        window.__DEV_STRESS_TEST.infiniteLoopRunning = false;
        window.__DEV_STRESS_TEST.slowNetwork = false;
        if (window.__DEV_STRESS_TEST.originalFetch) {
          window.fetch = window.__DEV_STRESS_TEST.originalFetch;
        }
      }
    };
  }, []);

  return {
    simulateError,
    stopError,
    stopAllErrors,
    logs,
    metrics,
    runningTests,
    clearLogs,
    clearMetrics,
    runningErrors: runningTests,
    totalLogs: logs.length,
    startError: simulateError,
  };
}
