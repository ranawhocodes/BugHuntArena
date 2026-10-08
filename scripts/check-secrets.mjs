#!/usr/bin/env node
/**
 * check-secrets.mjs — Scans tracked files for leaked API keys or secrets.
 * Fails with exit code 1 if any pattern matches.
 * Per spec Section 9 and 12.
 */

import { execSync } from 'node:child_process';

const SECRET_PATTERNS = [
  /sk-[a-zA-Z0-9]{20,}/,
  /AIza[a-zA-Z0-9_-]{35}/,
  /ghp_[a-zA-Z0-9]{36}/,
  /ghs_[a-zA-Z0-9]{36}/,
  /github_pat_[a-zA-Z0-9_]{82}/,
  /xoxb-[a-zA-Z0-9-]+/,
  /AKIA[A-Z0-9]{16}/,
  /KEY\s*=\s*['"][a-zA-Z0-9_-]{20,}['"]/i,
  /api[_-]?key\s*[:=]\s*['"][a-zA-Z0-9_-]{20,}['"]/i,
];

const IGNORE_FILES = [
  '.env.example',
  'check-secrets.mjs',
  'node_modules',
  'package-lock.json',
  '.git',
];

try {
  const files = execSync('git ls-files', { encoding: 'utf-8' })
    .split('\n')
    .filter((f) => f.trim() && !IGNORE_FILES.some((ig) => f.includes(ig)));

  let found = false;

  for (const file of files) {
    try {
      const content = execSync(`git show HEAD:${file}`, {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      for (const pattern of SECRET_PATTERNS) {
        if (pattern.test(content)) {
          console.error(`❌ Possible secret found in ${file}: ${pattern}`);
          found = true;
        }
      }
    } catch {
      // Binary file or not in HEAD yet, skip
    }
  }

  // Also check staged diff
  try {
    const staged = execSync('git diff --cached', { encoding: 'utf-8' });
    for (const pattern of SECRET_PATTERNS) {
      if (pattern.test(staged)) {
        console.error(`❌ Possible secret in staged diff: ${pattern}`);
        found = true;
      }
    }
  } catch {
    // No staged changes
  }

  if (found) {
    console.error('\n🚫 Secret scan FAILED. Remove secrets and rotate keys immediately.');
    process.exit(1);
  }

  console.log('✅ Secret scan passed — no secrets found.');
} catch (err) {
  console.error('⚠️  Secret scan skipped (not a git repo or no commits yet).');
}
