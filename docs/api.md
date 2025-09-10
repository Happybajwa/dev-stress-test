# API Reference

## React Components

### DevStressTest

A React component for simulating various errors and stress conditions in development.

```tsx
import { DevStressTest } from 'dev-stress-test/react';

function App() {
  return (
    <div>
      <DevStressTest
        errorType="render"
        delay={1000}
        message="Custom error message"
        silent={false}
      />
    </div>
  );
}
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `errorType` | `string` | `'render'` | Type of error to simulate |
| `delay` | `number` | `0` | Delay in milliseconds before triggering error |
| `message` | `string` | `undefined` | Custom error message |
| `silent` | `boolean` | `false` | Whether to suppress console output |

## Node.js Functions

### simulateError

Simulate various types of errors in Node.js applications.

```javascript
import { simulateError } from 'dev-stress-test/node';

// Simulate an uncaught exception
simulateError('uncaught-exception', {
  delay: 5000,
  message: 'Custom error message'
});
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `type` | `string` | Type of error to simulate |
| `options` | `ErrorSimulationOptions` | Configuration options |

#### Error Types

- `uncaught-exception` - Throws an uncaught exception
- `unhandled-rejection` - Creates an unhandled promise rejection
- `memory-leak` - Simulates a memory leak
- `async` - Simulates async operation errors

## Shared Utilities

### generateRandomError

Generate a random error for testing purposes.

```typescript
import { generateRandomError } from 'dev-stress-test/shared/utils';

const error = generateRandomError();
console.error(error.message);
```

### simulateMemoryLeak

Create a controlled memory leak for testing.

```typescript
import { simulateMemoryLeak } from 'dev-stress-test/shared/utils';

const cleanup = simulateMemoryLeak();

// Later, clean up the leak
cleanup();
```
