import chalk from 'chalk';
import { readUsage } from './logger.js';
import { MODELS } from './models.js';
import { checkBudget, readBudget } from './budget.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

function toDateStr(isoString) {
  return isoString.slice(0, 10); // 'YYYY-MM-DD'
}

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun
  d.setDate(d.getDate() - day);
  return toDateStr(d.toISOString());
}

function startOfMonth(date) {
  return `${date.slice(0, 7)}-01`;
}

/** Build a bar string scaled to a max width */
function bar(value, max, width = 30) {
  if (max === 0) return ' '.repeat(width);
  const filled = Math.round((value / max) * width);
  const empty = width - filled;
  return chalk.green('█'.repeat(filled)) + chalk.gray('░'.repeat(empty));
}

function formatUSD(n) {
  if (n < 0.001) return chalk.dim('$0.0000');
  if (n < 1) return chalk.yellow(`$${n.toFixed(4)}`);
  return chalk.red(`$${n.toFixed(4)}`);
}

function modelColor(key) {
  if (key === 'haiku') return chalk.cyan;
  if (key === 'sonnet') return chalk.blue;
  if (key === 'opus') return chalk.magenta;
  return chalk.white;
}

// ── Aggregation ───────────────────────────────────────────────────────────────

function aggregate(entries) {
  const now = new Date().toISOString();
  const today = toDateStr(now);
  const weekStart = startOfWeek(now);
  const monthStart = startOfMonth(now);

  const result = {
    daily: {},    // { 'YYYY-MM-DD': { total, byModel } }
    weekly: 0,
    monthly: 0,
    allTime: 0,
    byModel: {},
    todayTotal: 0,
    weeklyTotal: 0,
    monthlyTotal: 0,
    sessions: {},
  };

  for (const entry of entries) {
    const d = toDateStr(entry.timestamp);
    const { model, cost, session, inputTokens, outputTokens } = entry;

    // daily map
    if (!result.daily[d]) result.daily[d] = { total: 0, byModel: {} };
    result.daily[d].total += cost;
    result.daily[d].byModel[model] = (result.daily[d].byModel[model] || 0) + cost;

    // time-window totals
    if (d === today) result.todayTotal += cost;
    if (d >= weekStart) result.weeklyTotal += cost;
    if (d >= monthStart) result.monthlyTotal += cost;
    result.allTime += cost;

    // by-model summary
    if (!result.byModel[model]) {
      result.byModel[model] = { cost: 0, inputTokens: 0, outputTokens: 0, calls: 0 };
    }
    result.byModel[model].cost += cost;
    result.byModel[model].inputTokens += inputTokens;
    result.byModel[model].outputTokens += outputTokens;
    result.byModel[model].calls += 1;

    // sessions
    if (session) {
      if (!result.sessions[session]) result.sessions[session] = 0;
      result.sessions[session] += cost;
    }
  }

  return result;
}

// ── Renderers ─────────────────────────────────────────────────────────────────

function renderHeader(title) {
  const line = '─'.repeat(60);
  return `\n${chalk.bold.white(line)}\n  ${chalk.bold.white(title)}\n${chalk.bold.white(line)}`;
}

function renderBudgetStatus(totals) {
  const budget = readBudget();
  if (Object.keys(budget).length === 0) return '';

  const lines = [chalk.bold('\n  Budget Status')];
  const periods = [
    { key: 'daily', label: 'Today ', value: totals.daily },
    { key: 'weekly', label: 'Week  ', value: totals.weekly },
    { key: 'monthly', label: 'Month ', value: totals.monthly },
  ];

  for (const { key, label, value } of periods) {
    if (budget[key] == null) continue;
    const pct = Math.min(100, (value / budget[key]) * 100);
    const barWidth = 24;
    const filled = Math.round((pct / 100) * barWidth);
    const empty = barWidth - filled;
    const barColor = pct >= 100 ? chalk.red : pct >= 80 ? chalk.yellow : chalk.green;
    const b = barColor('█'.repeat(filled)) + chalk.gray('░'.repeat(empty));
    lines.push(
      `  ${chalk.dim(label)}  ${b}  ${formatUSD(value)} / ${chalk.dim('$' + budget[key].toFixed(2))} ${chalk.dim(`(${pct.toFixed(0)}%)`)}`
    );
  }

  return lines.join('\n');
}

function renderSummary(agg) {
  const totals = {
    daily: agg.todayTotal,
    weekly: agg.weeklyTotal,
    monthly: agg.monthlyTotal,
  };

  const lines = [
    renderHeader('Claude Cost Tracker — Report'),
    '',
    chalk.bold('  Summary'),
    `  Today       ${formatUSD(agg.todayTotal)}`,
    `  This week   ${formatUSD(agg.weeklyTotal)}`,
    `  This month  ${formatUSD(agg.monthlyTotal)}`,
    `  All time    ${formatUSD(agg.allTime)}`,
  ];

  const budgetStatus = renderBudgetStatus(totals);
  if (budgetStatus) lines.push(budgetStatus);

  return lines.join('\n');
}

function renderDailyChart(agg, days = 14) {
  const dates = Object.keys(agg.daily).sort().slice(-days);
  if (dates.length === 0) return '';

  const maxCost = Math.max(...dates.map(d => agg.daily[d].total), 0.0001);

  const lines = [chalk.bold('\n  Daily Spend (last ' + days + ' days)')];

  for (const date of dates) {
    const day = agg.daily[date];
    const b = bar(day.total, maxCost, 28);
    lines.push(`  ${chalk.dim(date)}  ${b}  ${formatUSD(day.total)}`);
  }

  return lines.join('\n');
}

function renderModelBreakdown(agg) {
  const entries = Object.entries(agg.byModel);
  if (entries.length === 0) return '';

  const lines = [chalk.bold('\n  By Model')];
  const maxCost = Math.max(...entries.map(([, v]) => v.cost), 0.0001);

  for (const [key, stats] of entries.sort((a, b) => b[1].cost - a[1].cost)) {
    const model = MODELS[key];
    const label = model ? model.name : key;
    const color = modelColor(key);
    const b = bar(stats.cost, maxCost, 20);
    lines.push(
      `  ${color(label.padEnd(16))}  ${b}  ${formatUSD(stats.cost)}  ${chalk.dim(stats.calls + ' calls')}`
    );
  }

  return lines.join('\n');
}

function renderSessions(agg) {
  const entries = Object.entries(agg.sessions);
  if (entries.length === 0) return '';

  const lines = [chalk.bold('\n  Top Sessions')];
  const sorted = entries.sort((a, b) => b[1] - a[1]).slice(0, 10);
  const maxCost = Math.max(...sorted.map(([, v]) => v), 0.0001);

  for (const [name, cost] of sorted) {
    const b = bar(cost, maxCost, 20);
    lines.push(`  ${chalk.dim(name.slice(0, 20).padEnd(20))}  ${b}  ${formatUSD(cost)}`);
  }

  return lines.join('\n');
}

// ── Budget warnings ───────────────────────────────────────────────────────────

function renderWarnings(agg) {
  const warnings = checkBudget({
    daily: agg.todayTotal,
    weekly: agg.weeklyTotal,
    monthly: agg.monthlyTotal,
  });

  if (warnings.length === 0) return '';

  const lines = [''];
  for (const w of warnings) {
    lines.push(`  ${chalk.bgRed.white(' ALERT ')} ${chalk.red(w)}`);
  }
  return lines.join('\n');
}

// ── Public API ────────────────────────────────────────────────────────────────

export function printReport({ days } = {}) {
  const { entries } = readUsage();
  const agg = aggregate(entries);

  const output = [
    renderSummary(agg),
    renderDailyChart(agg, days || 14),
    renderModelBreakdown(agg),
    renderSessions(agg),
    renderWarnings(agg),
    '',
  ].join('\n');

  process.stdout.write(output);
}

export function getAggregated() {
  const { entries } = readUsage();
  return aggregate(entries);
}
