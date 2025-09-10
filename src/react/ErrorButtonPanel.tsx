import React, { useMemo, useState, useRef, useEffect } from 'react';
import { DevStressPanelProps, ErrorType } from './types';
import { ERROR_CONFIG } from './constants';
import { useErrorSimulation } from './hooks/useErrorSimulation';
import { useTheme } from './hooks/useTheme';
import './ErrorButtonPanel.css';

const ErrorButton: React.FC<{
  type: ErrorType;
  onClick: () => void;
  onStop?: () => void;
  isRunning: boolean;
  isDark: boolean;
}> = ({ type, onClick, onStop, isRunning, isDark }) => {
  const config = ERROR_CONFIG[type];

  return (
    <div
      className={`error-button ${isDark ? 'dark' : 'light'} ${isRunning ? 'running' : ''}`}
      onClick={onClick}
    >
      <div className="button-content">
        <div className="button-icon">{config.icon}</div>
        <div className="button-text">
          <p className="button-label">{config.label}</p>
          <p className="button-description">{config.description}</p>
        </div>
      </div>
      <div className="button-actions">
        <div className={`severity-badge severity-${config.severity}`}>
          {config.severity}
        </div>
        {config.canStop && isRunning && onStop && (
          <button
            className={`stop-button ${isDark ? 'dark' : 'light'}`}
            onClick={(e) => {
              e.stopPropagation();
              onStop();
            }}
            title={`Stop ${config.label}`}
          >
            ⏹
          </button>
        )}
      </div>
    </div>
  );
};

const StatusIndicator: React.FC<{
  runningCount: number;
  totalLogs: number;
  isDark: boolean;
}> = ({ runningCount, totalLogs, isDark }) => {
  if (runningCount === 0 && totalLogs === 0) return null;

  return (
    <div className={`status-indicator ${isDark ? 'dark' : 'light'}`}>
      {runningCount > 0 && (
        <div className="status-item">
          <div className="status-dot running" />
          <span>{runningCount} running</span>
        </div>
      )}
      {totalLogs > 0 && (
        <div className="status-item">
          <span>📝 {totalLogs} logs</span>
        </div>
      )}
    </div>
  );
};

const DevStressPanel: React.FC<DevStressPanelProps> = ({
  onError,
  isDarkMode: propIsDarkMode,
  showLogs = true,
  maxLogs = 100,
  position = 'bottom-right',
  className = '',
  style = {},
  errorTypes = [
    'js',
    'network',
    'memory',
    'infinite-loop',
    'slow-network',
    'unhandled',
    'timeout',
    'dom-error',
    'undefined-access',
    'react-render-error',
    'cors-error',
    'storage-error',
  ],
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { isDark, toggleTheme } = useTheme(propIsDarkMode ? 'dark' : 'light');
  const { runningErrors, logs, totalLogs, startError, stopError, clearLogs } =
    useErrorSimulation({
      onError,
      showLogs,
      maxLogs,
    });

  const availableErrorTypes = useMemo(() => {
    return errorTypes.filter((type) => ERROR_CONFIG[type]);
  }, [errorTypes]);

  const runningCount = Object.keys(runningErrors).length;

  // Professional Warning Icon SVG - Using custom assets/warning-circle.svg
  const WarningIcon = () => (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}
    >
      <path
        d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2ZM11,7a1,1,0,0,1,2,0v6a1,1,0,0,1-2,0Zm1,12a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,12,19Z"
        fill="#1f2937"
        stroke="rgba(31,41,59,0.8)"
        strokeWidth="0.3"
      />
    </svg>
  );

  // Close Icon SVG
  const CloseIcon = () => (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 6L6 18M6 6L18 18"
        stroke="#1f2937"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );

  return (
    <>
      {/* Toggle Button - Always visible */}
      <button
        className={`error-panel-toggle ${isDark ? 'dark' : 'light'} position-${position}`}
        onClick={() => setIsVisible(!isVisible)}
        title={isVisible ? 'Hide Error Panel' : 'Show Error Panel'}
      >
        {isVisible ? <CloseIcon /> : <WarningIcon />}
        {runningCount > 0 && (
          <div className="running-indicator">{runningCount}</div>
        )}
      </button>

      {/* Main Panel - Only visible when toggled */}
      {isVisible && (
        <div
          className={`error-button-panel ${isDark ? 'dark' : 'light'} position-${position} ${className}`}
          style={style}
        >
          <div className="panel-header">
            <h3 className="panel-title">Error Simulation Panel</h3>
            <div className="panel-header-actions">
              <button
                className="theme-toggle"
                onClick={toggleTheme}
                title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
              >
                {isDark ? '☀️' : '🌙'}
              </button>
              <button
                className="close-button"
                onClick={() => setIsVisible(false)}
                title="Close panel"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="buttons-container">
            {availableErrorTypes.map((type) => {
              const config = ERROR_CONFIG[type];
              return (
                <ErrorButton
                  key={type}
                  type={type}
                  onClick={() => startError(type)}
                  onStop={
                    config.canStop
                      ? () => {
                          if (
                            type === 'memory' ||
                            type === 'infinite-loop' ||
                            type === 'slow-network'
                          ) {
                            stopError(type);
                          }
                        }
                      : undefined
                  }
                  isRunning={runningErrors.has(type)}
                  isDark={isDark}
                />
              );
            })}
          </div>

          <StatusIndicator
            runningCount={runningCount}
            totalLogs={totalLogs}
            isDark={isDark}
          />

          {showLogs && logs.length > 0 && (
            <div className={`logs-section ${isDark ? 'dark' : 'light'}`}>
              <div className="logs-header">
                <span className="logs-title">Recent Logs ({logs.length})</span>
                <button
                  className="clear-logs-button"
                  onClick={clearLogs}
                  title="Clear all logs"
                >
                  🗑️
                </button>
              </div>
              <div className="logs-container">
                {logs
                  .slice(-5)
                  .reverse()
                  .map((log, index) => (
                    <div
                      key={`${log.timestamp}-${index}`}
                      className="log-entry"
                    >
                      <span className="log-time">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      <span className={`log-type log-type-${log.type}`}>
                        {ERROR_CONFIG[log.type]?.label || log.type}
                      </span>
                      <span className="log-message">{log.message}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default DevStressPanel;
export { DevStressPanel };
// Backwards compatibility
export { DevStressPanel as ErrorButtonPanel };
