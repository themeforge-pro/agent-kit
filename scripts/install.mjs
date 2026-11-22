#!/usr/bin/env node
// Copy the kit's skills to where an AI coding tool looks for them.
// The skills are the same files for every tool (Agent Skills format: a folder with SKILL.md).
//
//   node scripts/install.mjs claude        → ~/.claude/skills/
//   node scripts/install.mjs codex         → ~/.codex/skills/
//   node scripts/install.mjs antigravity   → ~/.gemini/config/skills/
//   add --project to install into the current project instead:
//     claude → ./.claude/skills/   codex, antigravity → ./.agents/skills/
//   add --skill <name> to install one skill only.
//
// Node 18+, no dependencies. Existing skills with the same name are replaced.

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const tool = args.find((a) => !a.startsWith('--') && args[args.indexOf(a) - 1] !== '--skill');
const project = args.includes('--project');
const only = args.includes('--skill') ? args[args.indexOf('--skill') + 1] : null;

const targets = {
  claude: project ? path.join(process.cwd(), '.claude', 'skills') : path.join(os.homedir(), '.claude', 'skills'),
  codex: project ? path.join(process.cwd(), '.agents', 'skills') : path.join(os.homedir(), '.codex', 'skills'),
  antigravity: project ? path.join(process.cwd(), '.agents', 'skills') : path.join(os.homedir(), '.gemini', 'config', 'skills'),
};

if (!tool || !targets[tool]) {
  console.error('Usage: node scripts/install.mjs <claude|codex|antigravity> [--project] [--skill <name>]');
  process.exit(2);
}

const src = path.join(ROOT, 'skills');
const skills = readdirSync(src).filter((d) => statSync(path.join(src, d)).isDirectory() && (!only || d === only));
if (skills.length === 0) {
  console.error(only ? `No skill named ${only}.` : 'No skills found.');
  process.exit(1);
}

const dest = targets[tool];
mkdirSync(dest, { recursive: true });
for (const s of skills) {
  const to = path.join(dest, s);
  if (existsSync(to)) rmSync(to, { recursive: true, force: true });
  cpSync(path.join(src, s), to, { recursive: true });
  console.log(`installed ${s} → ${to}`);
}
console.log(`\nDone. Restart ${tool === 'claude' ? 'Claude Code' : tool === 'codex' ? 'Codex' : 'Antigravity'} or open a new session to load the skills.`);
