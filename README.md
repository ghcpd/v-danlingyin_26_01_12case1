# Network Utils 🔧

**Network helper utilities for simple fetch requests with retry support.**

---

## Overview ✅

This small module exports `fetchWithRetry`, a TypeScript async function that performs an HTTP fetch and retries on failure.

It is intentionally minimal and is intended to be used as a helper in larger projects where a simple retry policy is required.

---

## Requirements ⚠️

- A JavaScript runtime that provides a global `fetch` implementation (e.g. browsers or Node.js 18+).
- TypeScript-aware build environment if you want type checking.

> If you run this in Node.js versions prior to 18 you must provide a `fetch` polyfill (not included here).

---

## Installation / Use

There is no package published in this repository. To use:

- Copy `input.ts` into your project, or import it by relative path.

Example:

```ts
import { fetchWithRetry } from './input';

(async () => {
  try {
    const body = await fetchWithRetry('https://example.com/data', { retries: 3, delayMs: 1000 });
    console.log(body);
  } catch (err) {
    console.error('Request failed:', err);
  }
})();
```

---

## API Reference 🔍

### fetchWithRetry(url: string, options?: RetryOptions): Promise<string>

- `url` (string): The URL to fetch.
- `options` (optional): `RetryOptions` object.

`RetryOptions` fields:
- `retries?: number` — number of attempts (default: `3`).
- `delayMs?: number` — delay between retries in milliseconds (default: `1000`).

Returns: a `Promise<string>` that resolves to the response body text on success.

Errors:
- If the `fetch` call returns a response with `res.ok === false`, the function throws `Error("Request failed")` and will retry according to the configured `retries`.
- If `fetch` itself rejects (network error, DNS, etc.), that rejection will be retried and eventually re-thrown when retries are exhausted.
- If retries are exhausted, the function rethrows the last error encountered.

Important edge case (documented behavior):
- If `options.retries` is set to `0` the function's loop body does not execute and it throws `Error("Unreachable")`. Do not set `retries: 0` unless you expect the function to throw immediately.

---

## Behavior & Edge Cases ⚠️

- Default behavior: `retries = 3`, `delayMs = 1000`.
- On a non-OK HTTP response the function throws `Error("Request failed")` and will retry.
- The function uses `setTimeout` to wait `delayMs` milliseconds between attempts.
- All errors thrown by `fetch` (or the custom "Request failed") will be propagated if the final attempt fails.

---

## Testing / Validation ✏️

This repository does not include tests. To validate behavior locally, create small scripts that call `fetchWithRetry` against deterministic endpoints (e.g., local test server returning specific status codes) and assert expected retries and final outcomes.

---

## Other notes

- There is no LICENSE or CONTRIBUTING file in this repository.
- The code is intentionally minimal — keep that in mind when integrating in larger applications.

---

If you need more examples or a published package, add an issue or a feature request to the project.

