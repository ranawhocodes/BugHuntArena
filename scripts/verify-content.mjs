#!/usr/bin/env node
/**
 * verify-content.mjs — Runs each puzzle's buggy and fixed code,
 * verifying that outputs match actualOutput and expectedOutput.
 * Per spec Section 11 and 14.
 */

import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const contentDir = join(__dirname, '..', 'src', 'content');

/**
 * Run code with a 3-second timeout and return trimmed stdout.
 */
function runCode(language, code, timeout = 3000) {
  const cmd = language === 'python' ? 'python3' : 'node';
  const flag = language === 'python' ? '-c' : '-e';

  try {
    const output = execSync(`${cmd} ${flag} ${JSON.stringify(code)}`, {
      encoding: 'utf-8',
      timeout,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return output.trim();
  } catch (err) {
    if (err.stderr) return `ERROR: ${err.stderr.trim()}`;
    return `TIMEOUT`;
  }
}

let total = 0;
let passed = 0;
let failed = 0;

for (const lang of ['python', 'javascript']) {
  const filePath = join(contentDir, `${lang}.json`);

  let puzzles;
  try {
    puzzles = JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch {
    console.log(`⚠️  No content file found: ${filePath}, skipping.`);
    continue;
  }

  for (const puzzle of puzzles) {
    total++;
    const buggyCode = puzzle.code.join('\n');
    const fixedCode = puzzle.code
      .map((line, i) => {
        if (i + 1 === puzzle.bugLine) {
          const correctOption = puzzle.fixOptions.find((o) => o.correct);
          return correctOption ? correctOption.text : line;
        }
        return line;
      })
      .join('\n');

    const buggyOutput = runCode(puzzle.language, buggyCode);
    const fixedOutput = runCode(puzzle.language, fixedCode);

    let pass = true;

    if (buggyOutput !== puzzle.actualOutput) {
      console.error(`❌ ${puzzle.id}: buggy output mismatch`);
      console.error(`   Expected: "${puzzle.actualOutput}"`);
      console.error(`   Got:      "${buggyOutput}"`);
      pass = false;
    }

    if (fixedOutput !== puzzle.expectedOutput) {
      console.error(`❌ ${puzzle.id}: fixed output mismatch`);
      console.error(`   Expected: "${puzzle.expectedOutput}"`);
      console.error(`   Got:      "${fixedOutput}"`);
      pass = false;
    }

    if (pass) {
      console.log(`✅ ${puzzle.id}: verified`);
      passed++;
    } else {
      failed++;
    }
  }
}

console.log(`\n📊 Content verification: ${passed}/${total} passed, ${failed} failed.`);

if (failed > 0) {
  process.exit(1);
}
