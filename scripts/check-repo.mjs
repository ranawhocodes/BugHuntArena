#!/usr/bin/env node
/**
 * check-repo.mjs — Verifies repo size is under budget and only main branch exists.
 * Per spec Section 2.1 and 12.
 */

import { execSync } from 'node:child_process';

const MAX_REPO_SIZE_MB = 8;
const WARN_REPO_SIZE_MB = 3;

let exitCode = 0;

// Check branches
try {
  const branches = execSync('git branch -a', { encoding: 'utf-8' })
    .split('\n')
    .map((b) => b.trim().replace('* ', ''))
    .filter((b) => b && !b.includes('HEAD'));

  const allowed = ['main', 'remotes/origin/main'];
  const extra = branches.filter((b) => !allowed.includes(b));

  if (extra.length > 0) {
    console.error(`❌ Extra branches found: ${extra.join(', ')}`);
    console.error('   Only main is allowed. Delete extras before pushing.');
    exitCode = 1;
  } else {
    console.log('✅ Branch check passed — only main exists.');
  }
} catch {
  console.log('⚠️  Branch check skipped (not a git repo yet).');
}

// Check repo size
try {
  const sizeOutput = execSync('git count-objects -vH', { encoding: 'utf-8' });
  const sizeMatch = sizeOutput.match(/size-pack:\s*([\d.]+)\s*(\w+)/);

  if (sizeMatch) {
    let sizeMB = parseFloat(sizeMatch[1]);
    const unit = sizeMatch[2].toLowerCase();

    if (unit === 'kib' || unit === 'kbytes') sizeMB /= 1024;
    else if (unit === 'gib') sizeMB *= 1024;

    if (sizeMB > MAX_REPO_SIZE_MB) {
      console.error(`❌ Repo size ${sizeMB.toFixed(2)} MB exceeds ${MAX_REPO_SIZE_MB} MB limit.`);
      exitCode = 1;
    } else if (sizeMB > WARN_REPO_SIZE_MB) {
      console.warn(`⚠️  Repo size ${sizeMB.toFixed(2)} MB — approaching ${MAX_REPO_SIZE_MB} MB limit.`);
    } else {
      console.log(`✅ Repo size check passed — ${sizeMB.toFixed(2)} MB (limit ${MAX_REPO_SIZE_MB} MB).`);
    }
  }
} catch {
  console.log('⚠️  Repo size check skipped.');
}

process.exit(exitCode);
