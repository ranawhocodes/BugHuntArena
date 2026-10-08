import type { Language } from '../content/types';

export interface CodeToken {
  type: 'keyword' | 'string' | 'number' | 'comment' | 'fn' | 'operator' | 'plain';
  text: string;
}

const PYTHON_KEYWORDS = new Set([
  'def',
  'return',
  'for',
  'in',
  'if',
  'elif',
  'else',
  'while',
  'break',
  'continue',
  'import',
  'from',
  'as',
  'global',
  'nonlocal',
  'pass',
  'lambda',
  'try',
  'except',
  'finally',
  'raise',
  'with',
  'True',
  'False',
  'None',
  'is',
  'not',
  'and',
  'or',
]);

const JS_KEYWORDS = new Set([
  'function',
  'return',
  'const',
  'let',
  'var',
  'if',
  'else',
  'for',
  'while',
  'do',
  'break',
  'continue',
  'switch',
  'case',
  'default',
  'try',
  'catch',
  'finally',
  'throw',
  'new',
  'async',
  'await',
  'class',
  'extends',
  'super',
  'import',
  'export',
  'from',
  'typeof',
  'instanceof',
  'true',
  'false',
  'null',
  'undefined',
  'this',
]);

/**
 * Tokenizes a single line of code into styled tokens.
 */
export function tokenizeLine(line: string, language: Language): CodeToken[] {
  const tokens: CodeToken[] = [];
  let i = 0;
  const len = line.length;
  const keywords = language === 'python' ? PYTHON_KEYWORDS : JS_KEYWORDS;

  while (i < len) {
    // 1. Comments
    if (
      (language === 'python' && line[i] === '#') ||
      (language === 'javascript' && line[i] === '/' && line[i + 1] === '/')
    ) {
      tokens.push({ type: 'comment', text: line.slice(i) });
      break;
    }

    // 2. Strings ('...', "...", `...`)
    if (line[i] === '"' || line[i] === "'" || line[i] === '`') {
      const quote = line[i];
      let str = quote;
      i++;
      while (i < len && line[i] !== quote) {
        if (line[i] === '\\' && i + 1 < len) {
          str += line[i] + line[i + 1];
          i += 2;
        } else {
          str += line[i];
          i++;
        }
      }
      if (i < len) {
        str += line[i];
        i++;
      }
      tokens.push({ type: 'string', text: str });
      continue;
    }

    // 3. Numbers
    if (/\d/.test(line[i])) {
      let num = '';
      while (i < len && /[\d.]/.test(line[i])) {
        num += line[i];
        i++;
      }
      tokens.push({ type: 'number', text: num });
      continue;
    }

    // 4. Identifiers & Keywords
    if (/[a-zA-Z_$]/.test(line[i])) {
      let id = '';
      while (i < len && /[a-zA-Z0-9_$]/.test(line[i])) {
        id += line[i];
        i++;
      }

      // Check if function call (lookahead for '(')
      let lookahead = i;
      while (lookahead < len && line[lookahead] === ' ') lookahead++;
      const isFn = lookahead < len && line[lookahead] === '(';

      if (keywords.has(id)) {
        tokens.push({ type: 'keyword', text: id });
      } else if (isFn) {
        tokens.push({ type: 'fn', text: id });
      } else {
        tokens.push({ type: 'plain', text: id });
      }
      continue;
    }

    // 5. Operators & punctuation
    if (/[=+\-*/%&|^~<>!?:]/.test(line[i])) {
      let op = '';
      while (i < len && /[=+\-*/%&|^~<>!?:]/.test(line[i])) {
        op += line[i];
        i++;
      }
      tokens.push({ type: 'operator', text: op });
      continue;
    }

    // 6. Whitespace and other characters
    tokens.push({ type: 'plain', text: line[i] });
    i++;
  }

  return tokens;
}
