// Pricing data — USD per 1M tokens (current as of Feb 2026)
export const MODELS = {
  haiku: {
    name: 'Claude Haiku',
    id: 'haiku',
    aliases: ['claude-haiku', 'claude-3-haiku', 'haiku-3', 'claude-haiku-4'],
    inputPer1M: 0.25,
    outputPer1M: 1.25,
  },
  sonnet: {
    name: 'Claude Sonnet',
    id: 'sonnet',
    aliases: ['claude-sonnet', 'claude-3-sonnet', 'claude-3-5-sonnet', 'sonnet-4', 'claude-sonnet-4'],
    inputPer1M: 3.0,
    outputPer1M: 15.0,
  },
  opus: {
    name: 'Claude Opus',
    id: 'opus',
    aliases: ['claude-opus', 'claude-3-opus', 'opus-4', 'claude-opus-4'],
    inputPer1M: 15.0,
    outputPer1M: 75.0,
  },
};

/**
 * Resolve a user-supplied model string to a canonical key.
 * Returns the canonical key or throws if unrecognized.
 */
export function resolveModel(input) {
  const normalized = input.toLowerCase().trim();

  for (const [key, model] of Object.entries(MODELS)) {
    if (
      key === normalized ||
      model.name.toLowerCase() === normalized ||
      model.aliases.includes(normalized)
    ) {
      return key;
    }
  }

  throw new Error(
    `Unknown model: "${input}". Valid models: ${Object.keys(MODELS).join(', ')}`
  );
}

/**
 * Calculate cost in USD for a given model and token counts.
 * @param {string} modelKey - canonical model key
 * @param {number} inputTokens
 * @param {number} outputTokens
 * @returns {number} cost in USD
 */
export function calculateCost(modelKey, inputTokens, outputTokens) {
  const model = MODELS[modelKey];
  if (!model) throw new Error(`Unknown model key: ${modelKey}`);
  return (
    (inputTokens / 1_000_000) * model.inputPer1M +
    (outputTokens / 1_000_000) * model.outputPer1M
  );
}
