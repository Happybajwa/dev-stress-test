# Examples

## React Examples

### Basic Error Simulation

```tsx
import React from 'react';
import { DevStressTest } from 'dev-stress-test/react';

function App() {
  const [showStressTest, setShowStressTest] = React.useState(false);

  return (
    <div>
      <button onClick={() => setShowStressTest(true)}>Simulate Error</button>

      {showStressTest && (
        <DevStressTest
          errorType="render"
          delay={2000}
          message="Simulated render error for testing"
        />
      )}
    </div>
  );
}
```

### Testing Error Boundaries

```tsx
import React from 'react';
import { DevStressTest } from 'dev-stress-test/react';

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <DevStressTest errorType="render" delay={1000} />
    </ErrorBoundary>
  );
}
```

## Node.js Examples

### Express.js Error Testing

```javascript
import express from 'express';
import { simulateError } from 'dev-stress-test/node';

const app = express();

app.get('/test-error', (req, res) => {
  // Simulate an error after 3 seconds
  simulateError('async', {
    delay: 3000,
    message: 'Simulated API error',
  });

  res.json({ message: 'Error will occur in 3 seconds' });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### Memory Leak Testing

```javascript
import { simulateMemoryLeak } from 'dev-stress-test/shared/utils';

// Start memory leak simulation
const cleanup = simulateMemoryLeak();

// Monitor memory usage
setInterval(() => {
  const memUsage = process.memoryUsage();
  console.log('Memory usage:', memUsage.heapUsed / 1024 / 1024, 'MB');
}, 1000);

// Clean up after 30 seconds
setTimeout(() => {
  cleanup();
  console.log('Memory leak cleaned up');
}, 30000);
```

### Testing Promise Rejections

```javascript
import { simulateError } from 'dev-stress-test/node';

async function testUnhandledRejections() {
  // This will create an unhandled promise rejection
  simulateError('unhandled-rejection', {
    delay: 2000,
    message: 'Unhandled promise rejection test',
  });

  // Set up listener for unhandled rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  });
}

testUnhandledRejections();
```

## Testing Examples

### Jest Tests

```javascript
import {
  generateRandomError,
  simulateMemoryLeak,
} from 'dev-stress-test/shared/utils';

describe('Error Simulation', () => {
  test('should generate random errors', () => {
    const error = generateRandomError();
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toContain('Simulated error');
  });

  test('should handle memory leak cleanup', () => {
    const cleanup = simulateMemoryLeak();
    expect(typeof cleanup).toBe('function');

    // Cleanup to prevent actual memory leak in tests
    cleanup();
  });
});
```
