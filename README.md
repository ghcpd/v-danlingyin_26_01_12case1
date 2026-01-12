# Network Utils

Small utilities for network requests. This package currently exposes one function: `fetchWithRetry`, a tiny wrapper around the platform `fetch` API that retries a failing request a fixed number of times and returns the response body as text.

## What this repository contains

- `input.ts` — TypeScript source that exports `fetchWithRetry(url, options?)` and the `RetryOptions` interface.

## Requirements

- A runtime that provides the global `fetch` function (for example: browser environments or Node.js 18+).
- If you run this code in an older Node.js version, you must supply a global `fetch` implementation (for example using a polyfill such as `node-fetch` or `undici`).

## API

### RetryOptions
Type: `{ retries?: number; delayMs?: number }`

- `retries` — maximum number of attempts (default: 3).
- `delayMs` — delay between attempts in milliseconds (default: 1000).

### fetchWithRetry(url: string, options?: RetryOptions): Promise<string>

- Calls the platform `fetch(url)` and returns `res.text()` when a response with `res.ok === true` is received.
- If `fetch` throws or the response is not `ok`, the call is retried until the configured `retries` count is reached.
- Each failed attempt waits `delayMs` milliseconds before the next try.
- If all attempts fail the promise rejects with the last thrown error.

Notes:
- A non-OK HTTP response is treated as a failure (the code throws `new Error("Request failed")`) and counts toward the retry limit.
- The function does not implement timeouts, exponential backoff, or cancellation — callers that need those features must implement them externally.

## Usage examples

Import and call from TypeScript:

```ts
import { fetchWithRetry } from "./input";

async function example() {
  try {
    const body = await fetchWithRetry("https://example.com/data", { retries: 3, delayMs: 500 });
    console.log("Response text:", body);
  } catch (err) {
    console.error("Request failed after retries:", err);
  }
}
```

Browser usage requires no additional setup. In Node.js, ensure a global `fetch` is available before calling `fetchWithRetry`.

## Behaviour and edge cases

- The implementation attempts up to `retries` times (a `retries` value of 3 means up to 3 attempts).
- Because the function returns `res.text()`, binary responses or streaming use cases are not supported by this helper.

## Where to look in the source

See `input.ts` for the exact implementation and default values used by the helper.
