#!/usr/bin/env node
/**
 * xDS conformance check.
 *
 *   npx xds-eval [path]            human-readable report
 *   npx xds-eval [path] --json     machine-readable, for an agent
 *   npx xds-eval [path] --rubric   print the judgement rubric and exit
 *
 * Exits 1 when an error-severity rule fires, so it can gate a build the same
 * way the token audit does.
 */
import fs from 'node:fs';
import path from 'node:path';
import { RULES, RUBRIC } from './rules.mjs';

const args = process.argv.slice(2);
const flags = new Set(args.filter(a => a.startsWith('--')));
const root = path.resolve(args.find(a => !a.startsWith('--')) ?? '.');

const SKIP_DIR = new Set(['node_modules', '.next', '.git', 'dist', 'build', 'coverage', '.turbo']);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') && entry.name !== '.storybook') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIR.has(entry.name)) walk(full, out);
    } else out.push(full);
  }
  return out;
}

function findings() {
  const out = [];
  for (const file of walk(root)) {
    const rel = path.relative(root, file) || path.basename(file);
    const text = (() => {
      try { return fs.readFileSync(file, 'utf8'); } catch { return null; }
    })();
    if (text === null || text.includes('\u0000')) continue;

    for (const rule of RULES) {
      if (!rule.files.test(file)) continue;
      if (rule.exempt?.test(file)) continue;
      // A file can opt out of one rule, on the line above, with a reason.
      // xds-eval-disable XDS-03 — the reason, in words
      const disabled = new RegExp(`xds-eval-disable\\s+${rule.id}\\b`).test(text);
      if (disabled) continue;

      if (rule.multiline) {
        const re = new RegExp(rule.test.source, 'g');
        let m;
        while ((m = re.exec(text)) !== null) {
          // `assert` is how a rule decides on the whole match rather than on
          // the pattern alone — a lookahead cannot see past the first `>`.
          if (rule.assert && !rule.assert(m[0])) continue;
          out.push(finding(rule, rel, lineOf(text, m.index), m[0].split('\n')[0].trim()));
        }
        continue;
      }
      text.split('\n').forEach((line, i) => {
        if (line.includes('xds-eval-disable-line')) return;
        if (rule.ignoreIf?.test(line)) return;
        const m = line.match(rule.test);
        if (!m) return;
        if (rule.assert && !rule.assert(m[0])) return;
        out.push(finding(rule, rel, i + 1, line.trim()));
      });
    }
  }
  return out;
}

const finding = (rule, file, line, evidence) => ({
  id: rule.id, severity: rule.severity, title: rule.title,
  file, line, evidence: evidence.slice(0, 160), rule: rule.rule, fix: rule.fix,
});

const lineOf = (text, index) => text.slice(0, index).split('\n').length;

/* ------------------------------------------------------------------ */

if (flags.has('--rubric')) {
  if (flags.has('--json')) {
    console.log(JSON.stringify(RUBRIC, null, 2));
  } else {
    console.log('\nxDS review rubric — what the checker cannot decide.\n');
    for (const r of RUBRIC) {
      console.log(`${r.id}  ${r.area}`);
      console.log(`  ${r.question}`);
      console.log(`  pass  ${r.pass}`);
      console.log(`  fail  ${r.fail}\n`);
    }
  }
  process.exit(0);
}

const results = findings();
const errors = results.filter(f => f.severity === 'error');
const warns = results.filter(f => f.severity === 'warn');

if (flags.has('--json')) {
  console.log(JSON.stringify({
    root, checked: RULES.length, errors: errors.length, warnings: warns.length,
    findings: results, rubric: RUBRIC,
  }, null, 2));
} else {
  console.log(`\nxDS conformance · ${path.relative(process.cwd(), root) || '.'}\n`);
  if (!results.length) {
    console.log('  No findings. Run --rubric for the twelve questions a machine cannot answer.\n');
  }
  const byRule = new Map();
  for (const f of results) {
    if (!byRule.has(f.id)) byRule.set(f.id, []);
    byRule.get(f.id).push(f);
  }
  for (const [id, list] of byRule) {
    const f = list[0];
    console.log(`  ${f.severity === 'error' ? 'ERROR' : ' WARN'}  ${id}  ${f.title}  (${list.length})`);
    console.log(`         ${f.rule}`);
    for (const hit of list.slice(0, 5)) {
      console.log(`         ${hit.file}:${hit.line}  ${hit.evidence}`);
    }
    if (list.length > 5) console.log(`         … and ${list.length - 5} more`);
    console.log(`         fix: ${f.fix}\n`);
  }
  console.log(`  ${errors.length} error${errors.length === 1 ? '' : 's'}, ${warns.length} warning${warns.length === 1 ? '' : 's'}.`);
  console.log('  The rubric (xds-eval --rubric) covers what this cannot decide.\n');
}

process.exit(errors.length ? 1 : 0);
