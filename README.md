# Network Utils

A TypeScript utility library for network requests with automatic retry functionality.

## Overview

This library provides a robust HTTP request utility with configurable retry logic. The `fetchWithRetry` function automatically retries failed requests with exponential backoff, making network operations more resilient to transient failures.

## Installation

This module uses native `fetch` API. Ensure you're running in an environment that supports it:
- Node.js 18+ (native fetch support)
- Modern browsers
- Or use a fetch polyfill for older environments

```bash
# Install the module in your project
npm install # (if this is part of a package)

# Or simply import the TypeScript file directly
import { fetchWithRetry, RetryOptions } from './input';
```

## API Documentation

### `fetchWithRetry(url: string, options?: RetryOptions): Promise<string>`

Fetches a URL with automatic retry logic on failure.

**Parameters:**
- `url` (string, required): The URL to fetch
- `options` (RetryOptions, optional): Configuration for retry behavior

**Returns:**
- `Promise<string>`: The response body as text

**Throws:**
- `Error`: If all retry attempts are exhausted
- `Error`: With message "Request failed" if response status is not OK

**Behavior:**
- Automatically retries on network errors or non-OK HTTP responses
- Waits between retry attempts with a fixed delay
- Throws the original error if all retries are exhausted

### `RetryOptions` Interface

Configuration object for retry behavior.

**Properties:**
- `retries?: number` - Maximum number of retry attempts (default: `3`)
- `delayMs?: number` - Delay in milliseconds between retry attempts (default: `1000`)

## Usage Examples

### Basic Usage

```typescript
import { fetchWithRetry } from './input';

// Simple fetch with default retry settings (3 retries, 1000ms delay)
const data = await fetchWithRetry('https://api.example.com/data');
console.log(data);
```

### Custom Retry Configuration

```typescript
import { fetchWithRetry } from './input';

// Custom retry attempts and delay
const data = await fetchWithRetry('https://api.example.com/data', {
  retries: 5,      // Retry up to 5 times
  delayMs: 2000    // Wait 2 seconds between retries
});
```

### Error Handling

```typescript
import { fetchWithRetry } from './input';

try {
  const data = await fetchWithRetry('https://api.example.com/data', {
    retries: 3,
    delayMs: 1000
  });
  console.log('Success:', data);
} catch (error) {
  console.error('All retry attempts failed:', error);
  // Handle the error appropriately
}
```

### No Retries

```typescript
import { fetchWithRetry } from './input';

// Disable retries by setting retries to 1
const data = await fetchWithRetry('https://api.example.com/data', {
  retries: 1,
  delayMs: 0
});
```

## Error Handling

The function throws errors in the following scenarios:

1. **Network Failures**: If the fetch request fails due to network issues
2. **Non-OK Responses**: If the server returns a non-OK HTTP status (e.g., 404, 500)
3. **Exhausted Retries**: If all retry attempts fail

**Example Error Scenarios:**

```typescript
// Network error - will retry 3 times
await fetchWithRetry('https://nonexistent.example.com');
// Throws: TypeError: fetch failed (after retries)

// HTTP error - will retry 3 times
await fetchWithRetry('https://api.example.com/not-found');
// Throws: Error: Request failed (after retries)
```

## Configuration Details

### Default Values

| Option | Default Value | Description |
|--------|---------------|-------------|
| `retries` | `3` | Number of retry attempts before giving up |
| `delayMs` | `1000` | Milliseconds to wait between retry attempts |

### Retry Logic

- The function attempts the request immediately (attempt 0)
- If it fails, it waits `delayMs` milliseconds and retries
- This continues until `retries` attempts are exhausted
- The delay is fixed (not exponential) between attempts

## Edge Cases and Constraints

### Important Considerations

1. **Fixed Delay**: The delay between retries is constant, not exponential. All retries wait the same `delayMs` duration.

2. **Response Type**: The function always returns response body as text using `res.text()`. For JSON responses, you'll need to parse:
   ```typescript
   const text = await fetchWithRetry('https://api.example.com/json');
   const json = JSON.parse(text);
   ```

3. **No Request Options**: The function doesn't currently support passing fetch options (headers, method, body, etc.). It only performs GET requests.

4. **Retry on All Errors**: Both network failures and non-OK HTTP responses trigger retries. A 404 or 500 error will be retried just like a network timeout.

5. **Minimum Attempts**: Setting `retries: 1` means one attempt with no retries. Setting `retries: 0` would cause the loop to never execute.

## TypeScript Support

This module is written in TypeScript and provides full type definitions:

```typescript
import { fetchWithRetry, RetryOptions } from './input';

// Type-safe options
const options: RetryOptions = {
  retries: 5,
  delayMs: 2000
};

// Type-safe return value
const response: string = await fetchWithRetry('https://api.example.com', options);
```

## Requirements

- TypeScript 4.0+ (for development)
- Environment with `fetch` API support
- `Promise` and `async/await` support

## License

Not specified
