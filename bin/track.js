#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { logUsage, getUsageFilePath } from '../src/logger.js';
import { printReport } from '../src/reporter.js';
import { readBudget, writeBudget } from '../src/budget.js';
import { MODELS, resolveModel } from '../src/models.js';

const program = new Command();

program
  .name('claude-cost-tracker')
  .description('Track and visualize Claude Code API spending — local, no external API.')
  .version('1.0.0');

// ── log ────────────────────────────────────────────────────────────────────────

program
  .command('log')
  .description('Log a usage event manually')
  .option('--tokens <n>', 'Total tokens (treated as input). Use --input and --output for split.', parseInt)
  .option('--input <n>', 'Input tokens (overrides --tokens)', parseInt)
  .option('--output <n>', 'Output tokens (default: 20% of total)', parseInt)
  .requiredOption('--model <model>', 'Model: haiku | sonnet | opus')
  .option('--session <label>', 'Optional session label (e.g. "feature-build")')
  .action((opts) => {
    try {
      if (opts.input == null && opts.tokens == null) {
        console.error(chalk.red('Error: provide --tokens or --input (and optionally --output).'));
        process.exit(1);
      }
      const inputTokens = opts.input ?? opts.tokens;
      const outputTokens = opts.output ?? Math.round(inputTokens * 0.2);
      const model = opts.model;
      const session = opts.session || null;

      const entry = logUsage({ model, inputTokens, outputTokens, session });

      const resolvedModel = resolveModel(model);
      const modelInfo = MODELS[resolvedModel];

      console.log(
        chalk.green('Logged') +
        ` ${chalk.bold(modelInfo.name)} — ` +
        chalk.dim(`${inputTokens.toLocaleString()} in / ${outputTokens.toLocaleString()} out`) +
        ` — cost: ${chalk.yellow('$' + entry.cost.toFixed(6))}` +
        (session ? chalk.dim(` [${session}]`) : '')
      );
    } catch (err) {
      console.error(chalk.red('Error: ' + err.message));
      process.exit(1);
    }
  });

// ── report ─────────────────────────────────────────────────────────────────────

program
  .command('report')
  .description('Show spending report')
  .option('--days <n>', 'Number of days for daily chart', parseInt, 14)
  .action((opts) => {
    printReport({ days: opts.days });
  });

// ── budget ─────────────────────────────────────────────────────────────────────

program
  .command('budget')
  .description('Set or view budget thresholds')
  .option('--daily <amount>', 'Daily budget in USD', parseFloat)
  .option('--weekly <amount>', 'Weekly budget in USD', parseFloat)
  .option('--monthly <amount>', 'Monthly budget in USD', parseFloat)
  .option('--clear', 'Clear all budget settings')
  .action((opts) => {
    if (opts.clear) {
      writeBudget({});
      console.log(chalk.green('Budget cleared.'));
      return;
    }

    const current = readBudget();
    const updated = { ...current };

    if (opts.daily != null) updated.daily = opts.daily;
    if (opts.weekly != null) updated.weekly = opts.weekly;
    if (opts.monthly != null) updated.monthly = opts.monthly;

    writeBudget(updated);

    console.log(chalk.bold('\n  Budget saved:\n'));
    if (updated.daily != null) console.log(`  Daily   $${updated.daily.toFixed(2)}`);
    if (updated.weekly != null) console.log(`  Weekly  $${updated.weekly.toFixed(2)}`);
    if (updated.monthly != null) console.log(`  Monthly $${updated.monthly.toFixed(2)}`);

    if (Object.keys(updated).length === 0) {
      console.log(chalk.dim('  No budgets set. Use --daily, --weekly, --monthly.'));
    }
    console.log('');
  });

// ── models ─────────────────────────────────────────────────────────────────────

program
  .command('models')
  .description('Show cost comparison table for all supported models')
  .action(() => {
    const line = '─'.repeat(70);
    console.log(`\n${chalk.bold.white(line)}`);
    console.log(`  ${chalk.bold.white('Model Cost Comparison')} ${chalk.dim('(USD, current pricing)')}`);
    console.log(chalk.bold.white(line));
    console.log(
      chalk.bold(
        `  ${'Model'.padEnd(18)}  ${'Input /1M'.padEnd(14)}  ${'Output /1M'.padEnd(14)}  ${'1K in + 200 out'}`
      )
    );
    console.log(chalk.dim('  ' + '─'.repeat(66)));

    const colors = { haiku: chalk.cyan, sonnet: chalk.blue, opus: chalk.magenta };

    for (const [key, model] of Object.entries(MODELS)) {
      const color = colors[key] || chalk.white;
      const sample = ((1000 / 1_000_000) * model.inputPer1M + (200 / 1_000_000) * model.outputPer1M);
      console.log(
        `  ${color(model.name.padEnd(18))}  ` +
        `${chalk.yellow('$' + model.inputPer1M.toFixed(2)).padEnd(22)}  ` +
        `${chalk.yellow('$' + model.outputPer1M.toFixed(2)).padEnd(22)}  ` +
        chalk.dim('~$' + sample.toFixed(5))
      );
    }

    console.log('');
    console.log(chalk.dim('  Aliases accepted: haiku, sonnet, opus (and common claude-* variants)'));
    console.log('');
  });

// ── clear ──────────────────────────────────────────────────────────────────────

program
  .command('clear')
  .description('Delete all usage data (irreversible)')
  .option('--yes', 'Skip confirmation prompt')
  .action(async (opts) => {
    if (!opts.yes) {
      process.stdout.write(chalk.red('This will delete all usage data. Type yes to confirm: '));
      const answer = await new Promise((resolve) => {
        process.stdin.once('data', (d) => resolve(d.toString().trim()));
      });
      if (answer !== 'yes') {
        console.log('Aborted.');
        return;
      }
    }

    const { default: fs } = await import('fs');
    const { default: path } = await import('path');
    const { default: os } = await import('os');
    const usageFile = path.join(os.homedir(), '.claude-costs', 'usage.json');

    if (fs.existsSync(usageFile)) {
      fs.writeFileSync(usageFile, JSON.stringify({ entries: [] }, null, 2));
      console.log(chalk.green('Usage data cleared.'));
    } else {
      console.log(chalk.dim('No data file found.'));
    }
  });

// ── where ──────────────────────────────────────────────────────────────────────

program
  .command('where')
  .description('Show path to usage data file')
  .action(() => {
    console.log(getUsageFilePath());
  });

program.parse(process.argv);
