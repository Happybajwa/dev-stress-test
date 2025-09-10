import React from 'react';
import { ErrorButtonPanel, useErrorSimulation, ErrorType } from '../src/react';

// Example 1: Enterprise-level usage
export const EnterpriseExample: React.FC = () => {
  return (
    <div style={{ 
      padding: '2rem',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      minHeight: '100vh',
      fontFamily: '"Inter", system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 700, 
            background: 'linear-gradient(135deg, #1e293b, #475569)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem'
          }}>
            Development Stress Test
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: '#64748b', 
            maxWidth: '600px', 
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Enterprise-grade error simulation tool for comprehensive application testing.
            Simulate real-world error conditions to ensure your application handles edge cases gracefully.
          </p>
        </header>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(226, 232, 240, 0.8)'
          }}>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 600, 
              color: '#1e293b', 
              marginBottom: '1rem' 
            }}>
              🎯 Comprehensive Testing
            </h3>
            <p style={{ color: '#64748b', lineHeight: 1.6 }}>
              Test 15 different error scenarios including network failures, memory leaks, 
              infinite loops, and React-specific errors. Each test provides detailed 
              descriptions and real-time status monitoring.
            </p>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(226, 232, 240, 0.8)'
          }}>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 600, 
              color: '#1e293b', 
              marginBottom: '1rem' 
            }}>
              🎨 Professional Design
            </h3>
            <p style={{ color: '#64748b', lineHeight: 1.6 }}>
              Enterprise-level UI with glassmorphism design, consistent sizing, 
              professional color palette, and smooth animations. Built with accessibility 
              and user experience in mind.
            </p>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(226, 232, 240, 0.8)'
          }}>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 600, 
              color: '#1e293b', 
              marginBottom: '1rem' 
            }}>
              📊 Real-time Monitoring
            </h3>
            <p style={{ color: '#64748b', lineHeight: 1.6 }}>
              Track running tests with visual indicators, comprehensive logging with 
              timestamps, and performance metrics. Monitor test duration and execution 
              status in real-time.
            </p>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          textAlign: 'center'
        }}>
          <h3 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 600, 
            color: '#1e293b', 
            marginBottom: '1rem' 
          }}>
            Try the Interactive Panel
          </h3>
          <p style={{ 
            color: '#64748b', 
            marginBottom: '2rem',
            maxWidth: '600px',
            margin: '0 auto 2rem auto'
          }}>
            Click the floating button in the top-right corner to access the stress testing panel.
            Each button provides detailed information about the error type and its severity.
          </p>
        </div>
      </div>
      
      <ErrorButtonPanel
        position="top-right"
        theme="auto"
        env="dev"
        enableLogging={true}
        enableMetrics={true}
        onErrorTriggered={(type, timestamp) => {
          console.log(`✅ Enterprise Test: ${type} triggered at ${new Date(timestamp).toISOString()}`);
        }}
        onErrorStopped={(type, timestamp) => {
          console.log(`⏹️ Enterprise Test: ${type} stopped at ${new Date(timestamp).toISOString()}`);
        }}
      />
    </div>
  );
};

// Example 2: Custom hook with professional styling
export const CustomHookExample: React.FC = () => {
  const {
    simulateError,
    stopError,
    logs,
    runningTests,
    clearLogs,
  } = useErrorSimulation({
    enableLogging: true,
    onErrorTriggered: (type, timestamp) => {
      console.log(`Custom Enterprise Hook: ${type} triggered`);
    },
  });

  const criticalErrors: ErrorType[] = ['memory', 'infinite-loop', 'js', 'react-render-error'];
  const networkErrors: ErrorType[] = ['network', 'slow-network', 'cors-error'];
  const performanceErrors: ErrorType[] = ['timeout', 'storage-error'];

  const ErrorSection: React.FC<{ title: string; errors: ErrorType[]; color: string }> = ({ title, errors, color }) => (
    <div style={{
      background: 'white',
      borderRadius: '1rem',
      padding: '1.5rem',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(226, 232, 240, 0.8)'
    }}>
      <h3 style={{ 
        fontSize: '1.2rem', 
        fontWeight: 600, 
        color: '#1e293b', 
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: color
        }} />
        {title}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {errors.map((type) => (
          <div key={type} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              onClick={() => simulateError(type)}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                background: runningTests.has(type) ? color : 'white',
                color: runningTests.has(type) ? 'white' : '#374151',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '14px',
              }}
              onMouseOver={(e) => {
                if (!runningTests.has(type)) {
                  e.currentTarget.style.background = `${color}10`;
                  e.currentTarget.style.borderColor = `${color}40`;
                }
              }}
              onMouseOut={(e) => {
                if (!runningTests.has(type)) {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.8)';
                }
              }}
            >
              {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
            
            {runningTests.has(type) && ['memory', 'slow-network', 'infinite-loop'].includes(type) && (
              <button
                onClick={() => stopError(type as any)}
                style={{
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  background: 'rgba(254, 242, 242, 0.8)',
                  color: '#dc2626',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                Stop
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ 
      padding: '2rem',
      background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
      minHeight: '100vh',
      fontFamily: '"Inter", system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 700, 
            color: '#1e293b',
            marginBottom: '0.5rem'
          }}>
            Custom Hook Implementation
          </h1>
          <p style={{ 
            fontSize: '1.1rem', 
            color: '#64748b', 
            maxWidth: '600px', 
            margin: '0 auto'
          }}>
            Advanced usage demonstrating custom error simulation hooks with categorized testing
          </p>
        </header>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <ErrorSection 
            title="Critical Errors" 
            errors={criticalErrors} 
            color="#dc2626" 
          />
          <ErrorSection 
            title="Network Issues" 
            errors={networkErrors} 
            color="#0891b2" 
          />
          <ErrorSection 
            title="Performance Tests" 
            errors={performanceErrors} 
            color="#7c2d12" 
          />
        </div>

        {/* Status and Logs */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(226, 232, 240, 0.8)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h3 style={{ 
              fontSize: '1.2rem', 
              fontWeight: 600, 
              color: '#1e293b',
              margin: 0
            }}>
              Test Monitoring ({logs.length} logs)
            </h3>
            
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {runningTests.size > 0 && (
                <div style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '0.5rem',
                  color: '#047857',
                  fontSize: '14px',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#10b981',
                    animation: 'pulse 2s infinite'
                  }} />
                  {runningTests.size} Active Tests
                </div>
              )}
              
              {logs.length > 0 && (
                <button
                  onClick={clearLogs}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(107, 114, 128, 0.3)',
                    background: 'white',
                    color: '#6b7280',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                  }}
                >
                  Clear Logs
                </button>
              )}
            </div>
          </div>
          
          <div style={{ 
            maxHeight: '300px',
            overflowY: 'auto',
            fontSize: '14px'
          }}>
            {logs.length === 0 ? (
              <p style={{ 
                color: '#9ca3af', 
                fontStyle: 'italic', 
                textAlign: 'center',
                padding: '2rem'
              }}>
                No test logs yet. Start a stress test to see detailed monitoring information.
              </p>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    padding: '0.75rem',
                    marginBottom: '0.5rem',
                    background: log.level === 'error' ? '#fef2f2' : '#f0f9ff',
                    border: `1px solid ${log.level === 'error' ? '#fecaca' : '#bae6fd'}`,
                    borderRadius: '0.5rem',
                    fontFamily: '"JetBrains Mono", Monaco, monospace',
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: '0.25rem'
                  }}>
                    <span style={{ 
                      fontWeight: 600,
                      color: log.level === 'error' ? '#dc2626' : '#0891b2'
                    }}>
                      [{log.type.toUpperCase()}]
                    </span>
                    <span style={{ 
                      fontSize: '12px', 
                      color: '#6b7280'
                    }}>
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div style={{ color: '#374151' }}>{log.message}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseExample;
