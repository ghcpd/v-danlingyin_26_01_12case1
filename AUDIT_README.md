Audit: Documentation completeness for this repository

What I reviewed

- `input.ts` — implementation of `fetchWithRetry` and `RetryOptions`.
- Existing `README.md` (which previously contained only a title).

What was missing

- A concise project overview, runtime requirements (presence of a global `fetch`), a precise API reference (options, defaults, return type, failure behavior), usage examples, and notes about edge cases.

Files I added/generated

- `README_backup.md` — exact copy of the original README (kept unchanged).
- `README.md` — expanded documentation covering overview, requirements, API, usage examples, and edge cases.
- `report.json` — structured audit listing each missing documentation item and evidence.
- `doc_validation.md` — mapping of missing items to README sections and brief validation instructions.

How to verify documentation completeness

1. Open `input.ts` and `README.md` side-by-side.
2. Confirm the README's API section matches the implementation: defaults (`retries = 3`, `delayMs = 1000`), use of the global `fetch`, that non-OK responses are treated as failures, and that the helper returns `res.text()` on success.
3. Run or import the helper in your environment: if you target Node.js older than v18, ensure a global `fetch` is provided as noted in the README.

Notes

- No source code was modified. Documentation additions are strictly based on the existing implementation and do not introduce or claim any additional features.