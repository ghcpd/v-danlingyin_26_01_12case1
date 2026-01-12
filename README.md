# Network Utils

Lightweight TypeScript utility that exports a single helper: `fetchWithRetry`.

This repository contains a tiny, dependency-free implementation of an HTTP fetch helper that retries transient failures. The implementation is intentionally small — the README documents exact runtime requirements, public API, behavior, and known edge-cases so a developer can safely import and use the function without reading the source.

## Project status

- Single exported function: `fetchWithRetry` (see API reference).
- No runtime dependencies in the source. The runtime environment must provide a global `fetch` implementation (browser or Node 18+). See "Environment / Installation".

---

## Quick summary (TL;DR)

- Purpose: perform a GET request with simple retry semantics.
- Public surface: `fetchWithRetry(url: string, options?: RetryOptions): Promise<string>`
- Defaults: `retries = 3`, `delayMs = 1000` (1 second)
- Limitations: cannot pass fetch init (method/headers/body) — only the URL is accepted.

---

## Environment / Installation

Requirements
- A JavaScript runtime that provides the global `fetch` API (examples: web browsers, Node.js v18+).
- If your environment does not expose global `fetch`, provide a polyfill or global implementation before importing/using `fetchWithRetry` (the function calls `fetch` directly).

How to use in your codebase
- TypeScript / modern Node (ESM):

  import { fetchWithRetry } from './input';

- CommonJS (require) or bundlers: import the module file path that contains `fetchWithRetry`.

Note: this package does not export bundler/build instructions — integrate the file into your project source or package it yourself.

---

## Usage

Basic example

```ts
import { fetchWithRetry } from './input';

async function example() {
  try {
    const body = await fetchWithRetry('https://example.com/data.json');
    console.log(body);
  } catch (err) {
    // network error or non-2xx response after retries
    console.error('request failed', err);
  }
}
```

With options (override defaults)

```ts
import { fetchWithRetry } from './input';

const text = await fetchWithRetry('https://example.com/', { retries: 5, delayMs: 500 });
```

Node-specific note

- Run the example on Node.js v18+ (which includes global `fetch`) or add a fetch polyfill (for example `node-fetch`) and assign it to global.fetch before calling `fetchWithRetry`.

---

## API reference (behavior must match the source)

Types

- RetryOptions
  - `retries?: number` — maximum number of attempts (default: `3`). Must be a positive integer; passing `0` will skip the retry loop and lead to an internal "unreachable" error (see Known issues / edge cases).
  - `delayMs?: number` — milliseconds to wait between attempts (default: `1000`). Should be a non-negative integer.

Function

- `fetchWithRetry(url: string, options?: RetryOptions): Promise<string>`
  - Performs an HTTP GET to `url` using the global `fetch`.
  - On each attempt:
    - If the fetch call rejects (network error) the call is retried.
    - If the fetch call resolves but `res.ok` is false, the implementation throws `Error('Request failed')` and will retry according to the configured retries.
  - Waits `delayMs` milliseconds between retry attempts.
  - Returns a `Promise<string>` containing the full response body (obtained via `res.text()`) when an attempt succeeds.
  - On final failure, the last thrown error is re-thrown to the caller.

Limitations (explicit)
- Only accepts a URL string — there is no way to pass fetch init options (headers, method, body). The helper always performs a GET.
- No configurable backoff strategy — delay between retries is constant.

---

## Error handling & edge-cases (what to watch for)

- If `retries` is omitted, the function defaults to 3 attempts. If you pass `retries: 0` the current implementation will not enter the retry loop and will throw an internal `Error('Unreachable')` — avoid `0`.
- The function throws when:
  - The fetch promise rejects (network/connection error), or
  - The response is not OK (non-2xx) — in which case the function throws `Error('Request failed')`.
- On failure the function re-throws the last error; callers must catch exceptions.

Evidence (source lines)
- Exported symbol: `export async function fetchWithRetry(...)`
- Defaults: `const retries = options?.retries ?? 3;` and `const delayMs = options?.delayMs ?? 1000;`
- Non-OK handling: `if (!res.ok) { throw new Error("Request failed"); }`
- Retry wait: `await new Promise((r) => setTimeout(r, delayMs));`
- Unreachable guard: final `throw new Error("Unreachable");`

---

## Testing suggestions

- Manual: call the function against a known endpoint that returns 5xx to observe retry behavior, and against a working endpoint to confirm successful return of text.
- Unit tests: wrap global `fetch` with a fake that simulates failures and successes and assert number of attempts and delay behavior.

---

## What this README does NOT add or change

- No new APIs or runtime behavior are introduced — the README documents the existing implementation only.

---

## Missing / recommended repository-level docs (not present in source)

- LICENSE (none present in this repository snapshot)
- CONTRIBUTING / CODE_OF_CONDUCT (not present)

These are optional for small internal utilities but recommended for public packages.

---

## Contact / maintenance

- No maintainers or package metadata included in this snapshot. For small in-repo utilities, import and consume the file directly.

