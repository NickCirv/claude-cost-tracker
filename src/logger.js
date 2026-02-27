import fs from 'fs';
import path from 'path';
import os from 'os';
import { calculateCost, resolveModel } from './models.js';

const DATA_DIR = path.join(os.homedir(), '.claude-costs');
const USAGE_FILE = path.join(DATA_DIR, 'usage.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function readUsage() {
  ensureDataDir();
  if (!fs.existsSync(USAGE_FILE)) {
    return { entries: [] };
  }
  try {
    const raw = fs.readFileSync(USAGE_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { entries: [] };
  }
}

function writeUsage(data) {
  ensureDataDir();
  fs.writeFileSync(USAGE_FILE, JSON.stringify(data, null, 2), 'utf8');
}

/**
 * Append a usage entry to the JSON store.
 * @param {object} opts
 * @param {string} opts.model - raw model string from CLI
 * @param {number} opts.inputTokens
 * @param {number} opts.outputTokens
 * @param {string} [opts.session] - optional session label
 * @returns {object} the appended entry
 */
export function logUsage({ model, inputTokens, outputTokens, session }) {
  const modelKey = resolveModel(model);
  const cost = calculateCost(modelKey, inputTokens, outputTokens);

  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    timestamp: new Date().toISOString(),
    model: modelKey,
    inputTokens,
    outputTokens,
    cost: parseFloat(cost.toFixed(6)),
    session: session || null,
  };

  const data = readUsage();
  data.entries = [...data.entries, entry];
  writeUsage(data);

  return entry;
}

export function getUsageFilePath() {
  return USAGE_FILE;
}
