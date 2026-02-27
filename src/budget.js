import fs from 'fs';
import path from 'path';
import os from 'os';

const DATA_DIR = path.join(os.homedir(), '.claude-costs');
const BUDGET_FILE = path.join(DATA_DIR, 'budget.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function readBudget() {
  ensureDataDir();
  if (!fs.existsSync(BUDGET_FILE)) {
    return {};
  }
  try {
    return JSON.parse(fs.readFileSync(BUDGET_FILE, 'utf8'));
  } catch {
    return {};
  }
}

export function writeBudget(budget) {
  ensureDataDir();
  fs.writeFileSync(BUDGET_FILE, JSON.stringify(budget, null, 2), 'utf8');
}

/**
 * Check whether spending exceeds any budget thresholds.
 * @param {object} totals - { daily, weekly, monthly } spend in USD
 * @returns {string[]} array of warning messages (empty if all ok)
 */
export function checkBudget(totals) {
  const budget = readBudget();
  const warnings = [];

  if (budget.daily != null && totals.daily > budget.daily) {
    const pct = ((totals.daily / budget.daily) * 100).toFixed(0);
    warnings.push(
      `Daily budget exceeded: $${totals.daily.toFixed(4)} / $${budget.daily.toFixed(2)} (${pct}%)`
    );
  } else if (budget.daily != null && totals.daily >= budget.daily * 0.8) {
    const pct = ((totals.daily / budget.daily) * 100).toFixed(0);
    warnings.push(
      `Daily budget at ${pct}%: $${totals.daily.toFixed(4)} / $${budget.daily.toFixed(2)}`
    );
  }

  if (budget.weekly != null && totals.weekly > budget.weekly) {
    const pct = ((totals.weekly / budget.weekly) * 100).toFixed(0);
    warnings.push(
      `Weekly budget exceeded: $${totals.weekly.toFixed(4)} / $${budget.weekly.toFixed(2)} (${pct}%)`
    );
  } else if (budget.weekly != null && totals.weekly >= budget.weekly * 0.8) {
    const pct = ((totals.weekly / budget.weekly) * 100).toFixed(0);
    warnings.push(
      `Weekly budget at ${pct}%: $${totals.weekly.toFixed(4)} / $${budget.weekly.toFixed(2)}`
    );
  }

  if (budget.monthly != null && totals.monthly > budget.monthly) {
    const pct = ((totals.monthly / budget.monthly) * 100).toFixed(0);
    warnings.push(
      `Monthly budget exceeded: $${totals.monthly.toFixed(4)} / $${budget.monthly.toFixed(2)} (${pct}%)`
    );
  } else if (budget.monthly != null && totals.monthly >= budget.monthly * 0.8) {
    const pct = ((totals.monthly / budget.monthly) * 100).toFixed(0);
    warnings.push(
      `Monthly budget at ${pct}%: $${totals.monthly.toFixed(4)} / $${budget.monthly.toFixed(2)}`
    );
  }

  return warnings;
}
