/**
 * Decode JS-string-style backslash escape sequences in a string.
 *
 * The regex consumes backslash pairs left-to-right, so `\\` -> `\`
 * before `\n` can be seen as a newline sequence — exactly like a JS string.
 *
 * The decoded set is deliberately limited to `\\ \' \" \n \r \t` so it stays
 * symmetric with the MorphQL re-escape step in transpiler.ts: every decoded
 * character can be safely re-encoded as a MorphQL string literal. Other
 * sequences (`\b`, `\0`, `\xNN`, `\uNNNN`, `\q`, …) fall through to `default`
 * and yield the bare character — we intentionally do NOT emit raw control
 * bytes into stored values or generated code.
 *
 * NOTE: SQL '' (doubled-quote) unescaping is intentionally OUT OF SCOPE.
 */
export function decodeStringEscapes(s: string): string {
  return s.replace(/\\([\s\S])/g, (_, ch) => {
    switch (ch) {
      case 'n': return '\n';
      case 'r': return '\r';
      case 't': return '\t';
      default: return ch; // \\ -> \, \' -> ', \" -> ", any other \x -> x
    }
  });
}
