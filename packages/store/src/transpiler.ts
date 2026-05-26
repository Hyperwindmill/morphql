import { ParsedSQL, ParsedSelect, ParsedUpdate, ParsedDelete } from './parser.js';
import { decodeStringEscapes } from './escape.js';

export function transpile(ast: ParsedSQL): string {
  switch (ast.type) {
    case 'select': return transpileSelect(ast);
    case 'update': return transpileUpdate(ast);
    case 'delete': return transpileDelete(ast);
    case 'insert': throw new Error('INSERT statements are not transpiled to MorphQL');
  }
}

function transpileSelect(ast: ParsedSelect): string {
  const actions: string[] = [];

  if (ast.hasWildcard) {
    actions.push('    clone()');
  }

  for (const field of ast.select) {
    if (field.alias === field.expr) {
      actions.push(`    set ${field.alias}`);
    } else {
      actions.push(`    set ${field.alias} = ${field.expr}`);
    }
  }

  let clauses = 'from source';
  if (ast.where) clauses += ` where ${sqlToMorphQL(ast.where)}`;
  if (ast.orderBy) clauses += ` orderby ${ast.orderBy} ${ast.orderDesc ? 'desc' : 'asc'}`;
  if (ast.limit) clauses += ` limit ${ast.limit}`;

  return `from object to object
transform
  section multiple data(
${actions.join('\n')}
  ) ${clauses}
`;
}

function transpileUpdate(ast: ParsedUpdate): string {
  const setActions = ast.set.map(s => `      set ${s.field} = ${escapeSQLStringForMorphQL(s.expr)}`).join('\n');
  const whereGuard = ast.where ? `    if (${sqlToMorphQL(ast.where)}) (\n${setActions}\n    )` : setActions;

  return `from object to object
transform
  section multiple data(
    clone()
${whereGuard}
  ) from source
`;
}

function transpileDelete(ast: ParsedDelete): string {
  const whereClause = ast.where ? ` where !(${sqlToMorphQL(ast.where)})` : '';
  return `from object to object
transform
  section multiple data(
    clone()
  ) from source${whereClause}
`;
}

/**
 * Re-emit a SQL string literal as a valid MorphQL string literal.
 * Decodes the SQL value, then escapes special characters so that
 * MorphQL's StringLiteral regex /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/
 * can lex it without errors (in particular, raw newlines are rejected).
 *
 * Only touches single- or double-quoted string literals.
 * Non-string expressions (numbers, identifiers, arithmetic) are returned unchanged.
 */
function escapeSQLStringForMorphQL(expr: string): string {
  const trimmed = expr.trim();
  // Require the SAME quote char on both ends — guards against malformed
  // mixed-quote input slipping through unescaped.
  const isSingle = trimmed.length >= 2 && trimmed[0] === "'" && trimmed[trimmed.length - 1] === "'";
  const isDouble = trimmed.length >= 2 && trimmed[0] === '"' && trimmed[trimmed.length - 1] === '"';

  if (!isSingle && !isDouble) {
    // Not a string literal — pass through unchanged
    return expr;
  }

  const quoteChar = isSingle ? "'" : '"';
  // Unwrap the quotes and decode SQL-level JS-style escape sequences
  const inner = trimmed.slice(1, -1);
  const decoded = decodeStringEscapes(inner);

  // Re-escape in order: backslash first, then quote char, then whitespace control chars
  // This makes the value safe for MorphQL's StringLiteral regex.
  const escaped = decoded
    .replace(/\\/g, '\\\\')
    .replace(new RegExp(quoteChar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '\\' + quoteChar)
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');

  return quoteChar + escaped + quoteChar;
}

/**
 * Simple helper to convert SQL syntax to MorphQL syntax.
 * - = becomes ==
 * - AND -> &&, OR -> ||  (outside string literals)
 * - IS NOT NULL -> != null, IS NULL -> == null  (outside string literals)
 */
function sqlToMorphQL(expr: string): string {
  // Build a list of [start, end] ranges that are inside string literals,
  // so we only replace operators that live OUTSIDE strings.
  const stringRanges: [number, number][] = [];
  let inStr = false;
  let strChar = '';
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (inStr) {
      if (ch === strChar && expr[i - 1] !== '\\') {
        stringRanges[stringRanges.length - 1][1] = i;
        inStr = false;
      }
    } else if (ch === '"' || ch === "'") {
      inStr = true;
      strChar = ch;
      stringRanges.push([i, expr.length - 1]); // placeholder end
    }
  }

  function insideString(idx: number): boolean {
    return stringRanges.some(([s, e]) => idx >= s && idx <= e);
  }

  // We apply replacements token-by-token rather than naively via .replace(regex).
  // Strategy: rebuild the string, consuming known multi-word tokens greedily.
  let result = '';
  let i = 0;
  while (i < expr.length) {
    if (insideString(i)) {
      result += expr[i++];
      continue;
    }

    // IS NOT NULL  (7+ chars)
    if (/^IS\s+NOT\s+NULL\b/i.test(expr.slice(i))) {
      const m = expr.slice(i).match(/^IS\s+NOT\s+NULL\b/i)!;
      result += '!= null';
      i += m[0].length;
      continue;
    }

    // IS NULL
    if (/^IS\s+NULL\b/i.test(expr.slice(i))) {
      const m = expr.slice(i).match(/^IS\s+NULL\b/i)!;
      result += '== null';
      i += m[0].length;
      continue;
    }

    // AND  (word boundary)
    if (/^AND\b/i.test(expr.slice(i)) && (i === 0 || /\s/.test(expr[i - 1]))) {
      const m = expr.slice(i).match(/^AND\b/i)!;
      result += '&&';
      i += m[0].length;
      continue;
    }

    // OR  (word boundary)
    if (/^OR\b/i.test(expr.slice(i)) && (i === 0 || /\s/.test(expr[i - 1]))) {
      const m = expr.slice(i).match(/^OR\b/i)!;
      result += '||';
      i += m[0].length;
      continue;
    }

    // = -> == (not preceded/followed by = ! < >)
    if (
      expr[i] === '=' &&
      !insideString(i) &&
      (i === 0 || !/[!<>=]/.test(expr[i - 1])) &&
      expr[i + 1] !== '='
    ) {
      result += '==';
      i++;
      continue;
    }

    result += expr[i++];
  }

  return result;
}
