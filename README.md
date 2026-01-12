# Network Utils

Utility functions for network requests with built-in retry logic.

## Overview

This module provides a robust HTTP fetch utility with automatic retry functionality. It's designed to handle transient network failures by retrying failed requests with configurable delays.

## Installation

This is a TypeScript module. To use it in your project:

1. Copy `input.ts` to your project
2. Ensure you have TypeScript configured in your project
3. Ensure the fetch API is available in your environment:
   - **Browsers**: Native support in all modern browsers
   - **Node.js**: Native support in Node.js 18+
   - **Node.js < 18**: Install a fetch polyfill like `node-fetch`

```bash
# If using Node.js < 18
npm install node-fetch
```

## Usage

### Basic Example

```typescript
import { fetchWithRetry } from './input';

// Simple fetch with default retry settings (3 attempts, 1000ms delay)
try {
  const data = await fetchWithRetry('https://api.example.com/data');
  console.log('Response:', data);
} catch (error) {
  console.error('Request failed after retries:', error);
}
```

### Custom Retry Configuration

```typescript
import { fetchWithRetry, RetryOptions } from './input';

const options: RetryOptions = {
  retries: 5,      // Total number of attempts (not additional retries)
  delayMs: 2000    // Delay between retry attempts in milliseconds
};

try {
  const data = await fetchWithRetry('https://api.example.com/data', options);
  console.log('Response:', data);
} catch (error) {
  console.error('Request failed:', error);
}
```

### With Error Handling

```typescript
import { fetchWithRetry } from './input';

async function getData() {
  try {
    const result = await fetchWithRetry('https://api.example.com/data', {
      retries: 3,
      delayMs: 1500
    });
    
    // Parse the response if needed (result is a string)
    const jsonData = JSON.parse(result);
    return jsonData;
  } catch (error) {
    // Handle failure after all retries exhausted
    console.error('Failed to fetch data:', error.message);
    throw error;
  }
}
```

## API Reference

### `fetchWithRetry(url, options?)`

Performs an HTTP GET request with automatic retry logic.

**Parameters:**

- `url` (string, required): The URL to fetch
- `options` (RetryOptions, optional): Configuration object for retry behavior

**Returns:**

- `Promise<string>`: Resolves with the response body as text

**Throws:**

- `Error`: Throws when all retry attempts are exhausted or on non-recoverable errors

**Behavior:**

- Makes HTTP GET requests using the native fetch API
- Retries automatically on any error (network failures, non-OK status codes)
- Waits for the specified delay (`delayMs`) between retry attempts
- The delay is **fixed** (not exponential backoff)
- Throws the last error received if all retries are exhausted

### `RetryOptions`

Configuration interface for retry behavior.

**Properties:**

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `retries` | number | No | 3 | Total number of attempts (including the first attempt). Must be ≥ 1. |
| `delayMs` | number | No | 1000 | Delay in milliseconds between retry attempts. Fixed delay, not exponential. |

**Example:**

```typescript
interface RetryOptions {
  retries?: number;   // Default: 3
  delayMs?: number;   // Default: 1000
}
```

## Error Handling

The `fetchWithRetry` function throws errors in the following scenarios:

1. **Non-OK HTTP Response**: When the server responds with a non-2xx status code
   - Error message: `"Request failed"`
   - The function will retry based on the retry configuration

2. **Network Failures**: When the request cannot be completed (timeout, DNS failure, etc.)
   - The native fetch error is thrown
   - The function will retry based on the retry configuration

3. **Retries Exhausted**: When all retry attempts fail
   - The last error encountered is thrown
   - No more retries will be attempted

**Important Notes:**

- The `retries` parameter specifies **total attempts**, not additional retries
  - `retries: 3` means the request will be attempted up to 3 times
  - `retries: 1` means no retries (single attempt only)
- Errors are thrown after retries are exhausted, so always wrap calls in try-catch
- All errors trigger a retry (network errors and HTTP errors are treated the same)

## Return Value

The function returns a `Promise<string>` containing the response body as plain text.

**Important:** The response is returned as text, not parsed JSON. If you need JSON data, parse it manually:

```typescript
const textResponse = await fetchWithRetry('https://api.example.com/data');
const jsonData = JSON.parse(textResponse);
```

## Environment Requirements

- **TypeScript**: Any modern version with async/await support
- **JavaScript Runtime**:
  - Modern browsers with native fetch support
  - Node.js 18+ (native fetch)
  - Node.js < 18 requires a fetch polyfill

## Retry Behavior Details

### How Retries Work

1. The function attempts the request
2. If it fails (error thrown or non-OK status), it checks if retries remain
3. If retries remain, it waits for `delayMs` milliseconds
4. It then attempts the request again
5. This continues until success or all attempts are exhausted

### Example Timeline

With `retries: 3` and `delayMs: 1000`:

- **Attempt 1** (0ms): Request fails
- **Wait** 1000ms
- **Attempt 2** (1000ms): Request fails
- **Wait** 1000ms
- **Attempt 3** (2000ms): Request fails
- **Throw Error** (3000ms): All retries exhausted

### Delay Characteristics

- The delay is **fixed**, not exponential
- Same delay between all retry attempts
- No jitter or randomization
- Delay only occurs between attempts (not before the first attempt)

## Examples

### Fetching JSON Data

```typescript
import { fetchWithRetry } from './input';

async function fetchUserData(userId: string) {
  const url = `https://api.example.com/users/${userId}`;
  
  try {
    const responseText = await fetchWithRetry(url, {
      retries: 3,
      delayMs: 1000
    });
    
    const userData = JSON.parse(responseText);
    return userData;
  } catch (error) {
    console.error(`Failed to fetch user ${userId}:`, error);
    return null;
  }
}
```

### With Different Configurations for Critical vs Non-Critical Requests

```typescript
import { fetchWithRetry, RetryOptions } from './input';

// Critical data - more retries, longer delays
const criticalOptions: RetryOptions = {
  retries: 5,
  delayMs: 3000
};

// Non-critical data - fewer retries, shorter delays
const standardOptions: RetryOptions = {
  retries: 2,
  delayMs: 500
};

async function fetchData() {
  // Critical request
  const criticalData = await fetchWithRetry(
    'https://api.example.com/critical',
    criticalOptions
  );
  
  // Non-critical request
  const extraData = await fetchWithRetry(
    'https://api.example.com/extra',
    standardOptions
  );
}
```

## Limitations

- Only supports HTTP GET requests (via the fetch API default behavior)
- No support for custom headers, POST data, or other fetch options
- No exponential backoff (delay is fixed)
- No circuit breaker pattern (will always retry up to the limit)
- Returns response as text only (no automatic JSON parsing)
- Retries on all errors (doesn't distinguish between retryable and non-retryable errors)

## License

No license specified.
