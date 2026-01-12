Missing documentation items added

- Project overview → README: "Small utilities for network requests..."
- Setup / runtime requirements → README: "Requirements" (notes about global `fetch` and Node.js 18+ or polyfills)
- API description → README: "API" (signature, `RetryOptions`, default values, behavior)
- Usage examples → README: "Usage examples" (import + async/await example with try/catch)
- Error handling / edge cases → README: "Behaviour and edge cases" (how non-OK responses are treated; lack of timeout/backoff/cancellation)

How this helps a new developer

- Understand the project: The README now explains purpose and where the implementation lives (`input.ts`).
- Use the exposed API correctly: The README lists the function signature, option names and defaults, return type, and concrete example code so a developer can import and call `fetchWithRetry` without guessing.

To validate: open `input.ts` and confirm the README defaults and behavior statements match the implementation (`retries` default 3, `delayMs` default 1000, uses `fetch`, throws on non-OK responses and returns `res.text()`).