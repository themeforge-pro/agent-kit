#!/usr/bin/env node
// Check the kit's skills: one SKILL.md per folder, valid for Claude Code, Codex and
// Antigravity alike (they all read the same Agent Skills format: YAML front matter with
// `name` and `description`, Markdown body). Node 18+, no dependencies.
//
//   node scripts/check-skills.mjs            # exit 1 on any problem

import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKILLS = path.join(ROOT, 'skills');

const problems = [];
const say = (where, what) => problems.push(`${where}: ${what}`);

function frontMatter(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(text);
  if (!m) return null;
  const out = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = /^([a-z_-]+):\s*(.*)$/i.exec(line);
    if (kv) out[kv[1]] = kv[2].trim();
  }
  return { fields: out, body: text.slice(m[0].length) };
}

const dirs = readdirSync(SKILLS).filter((d) => statSync(path.join(SKILLS, d)).isDirectory());
if (dirs.length === 0) say('skills/', 'no skills');

for (const d of dirs) {
  const file = path.join(SKILLS, d, 'SKILL.md');
  const where = `skills/${d}/SKILL.md`;
  if (!existsSync(file)) { say(`skills/${d}`, 'SKILL.md is missing'); continue; }
  const text = readFileSync(file, 'utf8');
  const fm = frontMatter(text);
  if (!fm) { say(where, 'no YAML front matter'); continue; }
  const { name, description } = fm.fields;
  if (!name) say(where, 'front matter has no name');
  else {
    if (name !== d) say(where, `name "${name}" differs from the folder "${d}"`);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name) || name.length > 64) say(where, 'name must be lowercase-hyphenated, at most 64 characters');
  }
  if (!description) say(where, 'front matter has no description');
  else if (description.length > 1024) say(where, `description is ${description.length} characters (max 1024)`);
  if (fm.body.trim().length < 200) say(where, 'the body is almost empty');
}

if (problems.length) {
  console.error(problems.join('\n'));
  console.error(`\n${problems.length} problem(s).`);
  process.exit(1);
}
console.log(`OK: ${dirs.length} skills (${dirs.join(', ')}).`);
