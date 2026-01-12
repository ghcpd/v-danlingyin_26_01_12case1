# Network Utils 🔧

A minimal TypeScript utility that exports a single function `fetchWithRetry` to perform network requests with automatic retries and a configurable delay.

---

## Summary ✅

- **What it is:** A small helper that performs an HTTP request using the global `fetch`, retries on failure, and returns the raw response body as text.
- **Where to look:** Implementation lives in `input.ts` (`export async function fetchWithRetry(url: string, options?: RetryOptions): Promise<string>`).

---

## Requirements ⚠️

- The function relies on a **global `fetch`** being available at runtime.
	- In browsers, `fetch` is typically available.
	- In Node.js, you must run on Node 18+ (which provides `fetch`), or provide a polyfill (e.g., `node-fetch`) or global `fetch` shim before calling `fetchWithRetry`.

---

## Installation / Usage

This is a source file (TypeScript) — import it directly from your codebase or bundle it into your project.

Example (TypeScript):

```ts
import { fetchWithRetry } from './input';

async function run() {
	try {
		const body = await fetchWithRetry('https://example.com/data');
		console.log(body);
	} catch (err) {
		console.error('Request failed after retries:', err);
	}
}
```

---

## API Reference 🔍

### Types

```ts
export interface RetryOptions {
	retries?: number; // optional, default: 3
	delayMs?: number; // optional, default: 1000 (milliseconds)
}
```

### fetchWithRetry(url: string, options?: RetryOptions): Promise<string>

- **Parameters**
	- `url` (string): Request URL passed to `fetch`.
	- `options` (RetryOptions, optional):
		- `retries`: maximum number of attempts (default: `3`). The function will try up to `retries` attempts; when `retries` is 3, it performs up to 3 attempts.
		- `delayMs`: delay in milliseconds between attempts (default: `1000`).

- **Return value**: Resolves to the response body as a `string` (it calls `res.text()` internally).

- **Behavior**:
	- On each attempt, it calls the global `fetch(url)`.
	- If the fetch response has `!res.ok` (HTTP status outside 200–299 range), the function throws `new Error("Request failed")` and counts that as a failed attempt.
	- On thrown errors or network failures, it retries until `attempt >= retries`. Between attempts it waits `delayMs` milliseconds.
	- On the final failed attempt, the function rethrows the last caught error (the original error object).

- **Errors**:
	- Non-OK HTTP responses cause an Error with message `Request failed` to be thrown and retried.
	- If all retries fail, the last error is rethrown to the caller; callers should `try/catch` around `await fetchWithRetry(...)`.

- **Notes**:
	- The function returns raw text. It does **not** parse JSON. If you expect JSON, call `JSON.parse()` yourself on the returned string.
	- There is no validation of `url` or `options`; invalid inputs may result in thrown errors from `fetch` or runtime exceptions.

---

## Usage Examples 💡

Basic usage with defaults:

```ts
try {
	const result = await fetchWithRetry('https://example.com');
	// result is a string containing the response body
} catch (err) {
	// handle failed attempts
}
```

Customizing retries/delay:

```ts
const body = await fetchWithRetry('https://example.com/data', { retries: 5, delayMs: 500 });
```

Handling JSON responses:

```ts
const text = await fetchWithRetry('https://example.com/data.json');
const data = JSON.parse(text);
```

Node compatibility (example polyfill use):

```ts
// If your Node.js runtime does not provide global fetch,
// you can polyfill before importing or calling the function:
import fetch from 'node-fetch';
// @ts-ignore
global.fetch = fetch; // ensure global fetch exists

// then call fetchWithRetry normally
```

---

## Limitations / Edge Cases ⚠️

- The function always treats non-2xx HTTP status as a failure and throws `Request failed` (no status included in the error).
- Returned value is always `string` — callers must handle parsing if they expect structured data.
- The function will rethrow the original error when retries are exhausted (no custom wrapper is applied).

---

## Testing & Contributing

- No tests are included in this repository. If you add tests, consider mocking `fetch` to simulate network failures and non-OK responses.
- Keep behavior unchanged: tests should verify retry count, delay, and that the function rethrows the last error after exhausting retries.

---

## License

No license file is present in this repository; include one if you intend to open-source or share the code with licensing expectations.

---

If anything in this README conflicts with actual behavior in the code, open an issue or submit a PR with a clear code reference and tests. 🎯
