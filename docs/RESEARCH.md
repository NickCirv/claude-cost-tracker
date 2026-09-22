# claude-cost-tracker — documentation research

Reviewed 21 September 2026. Public GitHub source only.

## Revision and scope

- Commit: [`0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc`](https://github.com/NickCirv/claude-cost-tracker/commit/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc).
- Tree: `519c63572e2a3af5ddb3930709f3eb372f1938c0`; truncated: `false`.
- Capture: 11 of 11 eligible text files; all eligible text files.
- Method: package and entrypoint inspection, implementation-interface review, targeted behavior/limitation inspection, and test-source review. This is not an exhaustive correctness or security audit.
- Commands run against repository code: **none**. External services, deployment and npm publication were not verified.

## Claim and evidence map

| Documentation claim | Pinned evidence | Assessment |
| --- | --- | --- |
| Runtime, executable and development commands | [package.json](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/package.json) | Source declaration inspected; runtime unverified |
| Keeps a manually entered local ledger of model-token usage and estimated cost. | [bin/track.js](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/bin/track.js) · [src/index.js](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/src/index.js) | Implementation interfaces inspected; behavior not executed |
| Input/output token logging; session labels; spending reports; daily, weekly and monthly budget thresholds. | [bin/track.js](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/bin/track.js), [src/budget.js](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/src/budget.js), [src/index.js](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/src/index.js), [src/logger.js](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/src/logger.js), [src/models.js](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/src/models.js), [src/reporter.js](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/src/reporter.js) | Source-backed scope, not a test result |
| This is a local estimator, not a provider invoice or automatic usage reconciliation. Embedded rates can become stale and token input must be accurate. Clear commands remove recorded data. | [bin/track.js](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/bin/track.js), [src/budget.js](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/src/budget.js), [src/index.js](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/src/index.js), [src/logger.js](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/src/logger.js), [src/models.js](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/src/models.js), [src/reporter.js](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/src/reporter.js) | Material limits documented; service compatibility remains open |
| Existing checks | [test/smoke.test.js](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/test/smoke.test.js) | Test source read; no passing-run claim |

## Documentation inventory and disposition

| Existing document | Decision |
| --- | --- |
| [README.md](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/README.md) | Rewritten with source-specific purpose, direct checkout setup, limitations and verification status. Old section fragments retained where practical. |

Added `docs/REFERENCE.md` for the observed implementation and command surface, and this research record. Protected license and attribution files remain in their original locations without edits. No source or product UI was changed.

## Quality dimensions

| Dimension | Status | Evidence / next step |
| --- | --- | --- |
| Pinned provenance | Verified | Captured commit, tree and per-file hashes recorded below |
| Interface documentation | Partially verified | Source inspection only; run clean-checkout quickstart |
| Runtime behavior | Unverified | No repository execution in this review |
| Test results | Unverified | Existing tests were not run |
| Deployment / package availability | Unverified | No remote publish or live-service check |
| Visual / link checks | Unverified | Portfolio renderer and independent QA are separate from this authoring step |

## Unresolved issues

This is a local estimator, not a provider invoice or automatic usage reconciliation. Embedded rates can become stale and token input must be accurate. Clear commands remove recorded data.

## Captured source inventory

This lists captured provenance, not a claim that every line received a full audit. Binary/generated/excluded files are outside the eligible text capture.

| File | SHA-256 | Bytes |
| --- | --- | --- |
| [LICENSE](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/LICENSE) | `68729cab364d82364078b08d8580ccfa51dc69c81a7d64e8d8d47a1da6c9349d` | 1072 |
| [README.md](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/README.md) | `07797df38854127862fba440ff720e218a5eca80d7355d1e2bc6f308d2b3314e` | 6251 |
| [package.json](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/package.json) | `1377b0dc64c62dac3efa6f93b00b643ce081f050d50728e7e1335b2c095a57d3` | 751 |
| [.github/workflows/ci.yml](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/.github/workflows/ci.yml) | `433fbf65635a767ef5cd787147104c248d0cea6bbd6523c6c862f915e0e3206a` | 384 |
| [bin/track.js](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/bin/track.js) | `fbea1fd01485b412365a6e838bb23bedec509bc84415b452946ef5da71dec529` | 7239 |
| [src/budget.js](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/src/budget.js) | `56cd3fd0d13217451112dd5ea5ce305ecb7c06c8941552c261babf4377716f05` | 2551 |
| [src/index.js](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/src/index.js) | `a9ed5020a6fcd4e3f025513244212e70797917db37644f9c1aeb5c325b992c4b` | 315 |
| [src/logger.js](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/src/logger.js) | `d241db7079cdd81084b4d1a024ee0b93401b8349a9d63ab34b029e002cecc428` | 1654 |
| [src/models.js](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/src/models.js) | `b405fb283e7148ae7a1df96b52c5379d03f3e01ecd83890b924dd0b1ba4e3a0b` | 1699 |
| [src/reporter.js](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/src/reporter.js) | `787336a0e677bd27e912c19075b99134328c06e45776835d9d0057f4b8aec350` | 7869 |
| [test/smoke.test.js](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/test/smoke.test.js) | `a5ca41d6b1d7d7424691ca0ce09bcb6b3c007d15581ebad5bf8add0b777ee62a` | 461 |
