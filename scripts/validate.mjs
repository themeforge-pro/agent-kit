#!/usr/bin/env node
// Check a folder of HTML pages against the ThemeForge generator, free and without an account.
//
//   node scripts/validate.mjs <site-folder> [--api https://themeforge.pro]
//
// Sends every .html file of the folder (subfolders included) in ONE request to
// POST /api/validate-markup and prints what the generator would object to, most severe first.
// Exit code: 0 = ok, 1 = errors or warnings, 2 = the request itself failed. Node 18+, no dependencies.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const args = process.argv.slice(2);
const dir = args.find((a) => !a.startsWith('--'));
const apiArg = args.indexOf('--api');
const api = (apiArg >= 0 ? args[apiArg + 1] : 'https://themeforge.pro').replace(/\/$/, '');
if (!dir) {
  console.error('usage: node scripts/validate.mjs <site-folder> [--api https://themeforge.pro]');
  process.exit(2);
}

const files = [];
(function walk(d) {
  for (const name of readdirSync(d)) {
    const p = join(d, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name.toLowerCase().endsWith('.html')) files.push(p);
  }
})(dir);
if (!files.length) {
  console.error(`No .html files in ${dir}`);
  process.exit(2);
}
const pages = files.map((f) => ({ name: relative(dir, f).split(sep).join('/'), html: readFileSync(f, 'utf8') }));

let res;
try {
  res = await fetch(`${api}/api/validate-markup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pages }),
  });
} catch (e) {
  console.error(`Request failed: ${e.message}`);
  process.exit(2);
}
const body = res.status === 429 ? null : await res.json().catch(() => null);
if (res.status === 429) {
  console.error(`Rate limited: try again in ${res.headers.get('retry-after') || 'a few'} seconds.`);
  process.exitCode = 2;
} else if (!body || !body.success) {
  console.error(`The checker refused the request: ${body?.error || res.status}`);
  process.exitCode = 2;
} else {
  report(body.data);
}

function report(r) {
  for (const p of r.pages) {
    console.log(`${p.name.padEnd(28)} ${String(p.fields).padStart(3)} fields  group: ${p.group || '— none (no fields will be created)'}`);
  }
  console.log('');
  for (const i of r.issues) {
    const where = [i.page, i.element, i.line ? `line ${i.line}` : ''].filter(Boolean).join(' · ');
    console.log(`${i.severity.toUpperCase().padEnd(7)} ${i.kind}  ${i.attribute || ''}${i.value ? `="${i.value}"` : ''}  (${where})`);
    console.log(`        ${i.message}`);
  }
  const s = r.summary;
  console.log(`\n${r.ok ? 'OK' : 'NOT OK'}: ${s.error} errors, ${s.warning} warnings, ${s.hint} hints${r.partial ? ' (partial check: see the limits in the reply)' : ''}`);
  // exitCode, not exit(): exiting while fetch keeps its socket open crashes Node on Windows.
  process.exitCode = r.ok && !s.warning ? 0 : 1;
}
