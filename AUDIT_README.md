Documentation audit — README + artifacts

What I reviewed
- Files inspected: `input.ts`, `README.md` (original), workspace root for repository-level docs.

What was missing (high-level)
- Environment requirements (global `fetch`), usage examples, comprehensive API docs (defaults, return type, errors), and error/edge-case guidance.

What I changed (documentation only)
- Created a comprehensive `README.md` that documents the public API, defaults, behavior, examples, and edge-cases.
- Created `README_backup.md` (unchanged copy of the original README).
- Produced `report.json` (audit of missing items), `doc_validation.md` (mapping + validation steps), and this `AUDIT_README.md`.

Files generated
- `README.md` (expanded, authoritative documentation)
- `README_backup.md` (original README copy)
- `report.json` (structured missing-docs audit)
- `doc_validation.md` (validation checklist & how-to)

How reviewers can verify completeness
1. Open `README.md` and confirm it contains these sections: Quick summary, Environment / Installation, Usage, API reference, Error handling & edge-cases, Testing suggestions.
2. Follow the Basic example in the "Usage" section in an environment with a global `fetch` (browser or Node 18+) to verify it runs as documented.
3. Confirm `README_backup.md` matches the original (it should contain the single-line original README).
4. Confirm `report.json` lists the missing items and that each item maps to a README section (cross-check with `doc_validation.md`).

Suggested next steps for maintainers
- Add a LICENSE if this will be published externally.
- Add a small unit-test file that stubs `fetch` and asserts retry behaviour.

If you want, I can also add a minimal test file or draft a CONTRIBUTING.md — tell me which and I'll add it as separate files.