![Nicholas Ashkar — claude-cost-tracker](assets/nicholas-ashkar/banner.png)

# claude-cost-tracker

Keeps a manually entered local ledger of model-token usage and estimated cost.













<a id="usage"></a>

<a id="log-a-session"></a>

<a id="log-50k-tokens-on-sonnet-8020-inputoutput-split-assumed"></a>

<a id="tag-a-session-for-grouping-in-the-report"></a>

<a id="view-report"></a>

<a id="show-last-30-days-in-the-chart"></a>

<a id="set-budget-alerts"></a>

<a id="compare-model-costs"></a>

<a id="other"></a>

<a id="flag-reference"></a>

<a id="cost-reference"></a>

<a id="data-storage"></a>

## What it does

- Input/output token logging.
- Session labels.
- Spending reports.
- Daily, weekly and monthly budget thresholds.


<a id="install"></a>

## Quickstart

Prerequisites: Node.js `>=18.0.0` and npm. The checkout below pins the source used for this documentation.

```sh
git clone https://github.com/NickCirv/claude-cost-tracker.git
cd claude-cost-tracker
git checkout 0fdf52c2850ab6c8e494e8ca5e0f0a5d758be6fc
npm install
node bin/track.js models
```

**Expected behavior (illustrative, not captured):** Lists the embedded model identifiers and pricing assumptions.

Examples are source-inspected, **not runtime-tested**. See the research record for verification gaps.


<a id="what-it-is-not"></a>

## Boundaries and data

This is a local estimator, not a provider invoice or automatic usage reconciliation. Embedded rates can become stale and token input must be accurate. Clear commands remove recorded data.


<a id="explicit-inputoutput-split"></a>

## Development

The manifest defines `npm test` as:

```sh
node --test
```

The captured suite is a smoke check, not end-to-end behavior coverage. Examples include “entry is valid JavaScript”, “--help exits 0”. Tests were not run for this documentation revision.

See [implementation and command reference](docs/REFERENCE.md) for the package scripts and inspected interfaces, and [research record](docs/RESEARCH.md) for the pinned source, document decisions and unresolved checks.

## License and contact

See [LICENSE](LICENSE) for the original terms and attribution. Legal text is unchanged.

[Nicholas Ashkar](https://nicholashkar.com/) · [Discuss a project](https://nicholashkar.com/#oxblood-contact)
