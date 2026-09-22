# claude-cost-tracker — implementation reference

Source revision: `0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc`. This reference records source declarations; it is not a transcript of a successful run.

## Entrypoint and runtime

[package.json](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/package.json) declares `bin/track.js`. Node.js `>=18.0.0` and npm.

Executable mapping: `claude-cost-tracker` → `./bin/track.js`.

## Supported workflow

Input/output token logging; session labels; spending reports; daily, weekly and monthly budget thresholds.

This is a local estimator, not a provider invoice or automatic usage reconciliation. Embedded rates can become stale and token input must be accurate. Clear commands remove recorded data.

## Declared command interface

Options belong to the preceding command in the linked source; they are not necessarily global.

| Kind | Declaration | Source description | Source |
| --- | --- | --- | --- |
| command | `log` | Log a usage event manually | [bin/track.js](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/bin/track.js) |
| option | `--tokens <n>` | Total tokens (treated as input). Use --input and --output for split. | [bin/track.js](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/bin/track.js) |
| option | `--input <n>` | Input tokens (overrides --tokens) | [bin/track.js](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/bin/track.js) |
| option | `--output <n>` | Output tokens (default: 20% of total) | [bin/track.js](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/bin/track.js) |
| option | `--session <label>` | Optional session label (e.g. "feature-build") | [bin/track.js](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/bin/track.js) |
| command | `report` | Show spending report | [bin/track.js](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/bin/track.js) |
| option | `--days <n>` | Number of days for daily chart | [bin/track.js](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/bin/track.js) |
| command | `budget` | Set or view budget thresholds | [bin/track.js](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/bin/track.js) |
| option | `--daily <amount>` | Daily budget in USD | [bin/track.js](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/bin/track.js) |
| option | `--weekly <amount>` | Weekly budget in USD | [bin/track.js](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/bin/track.js) |
| option | `--monthly <amount>` | Monthly budget in USD | [bin/track.js](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/bin/track.js) |
| option | `--clear` | Clear all budget settings | [bin/track.js](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/bin/track.js) |
| command | `models` | Show cost comparison table for all supported models | [bin/track.js](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/bin/track.js) |
| command | `clear` | Delete all usage data (irreversible) | [bin/track.js](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/bin/track.js) |
| option | `--yes` | Skip confirmation prompt | [bin/track.js](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/bin/track.js) |
| command | `where` | Show path to usage data file | [bin/track.js](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/bin/track.js) |

## Option defaults

These are literal defaults or parsers declared by the command builder; flags belong to their command as shown above.

| Option | Declared default / parser |
| --- | --- |
| `--tokens <n>` | `parseInt` |
| `--input <n>` | `parseInt` |
| `--output <n>` | `parseInt` |
| `--days <n>` | `parseInt, 14` |
| `--daily <amount>` | `parseFloat` |
| `--weekly <amount>` | `parseFloat` |
| `--monthly <amount>` | `parseFloat` |

## Package scripts

| Script | Exact command |
| --- | --- |
| `start` | `node bin/track.js` |
| `report` | `node bin/track.js report` |
| `models` | `node bin/track.js models` |
| `test` | `node --test` |

## Implementation sources

[src/index.js](https://github.com/NickCirv/claude-cost-tracker/blob/0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc/src/index.js).

## Verification boundary

No repository code, tests, network operation, hook installer or migration was executed for this review. Source inspection supports the documented interface; runtime correctness and external-service compatibility remain unverified.
