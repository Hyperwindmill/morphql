import { ParsedSQL } from './parser.js';

export function transpile(ast: ParsedSQL): string {
  const actions: string[] = [];

  if (ast.hasWildcard) {
    actions.push('    clone()');
  }

  for (const field of ast.select) {
    // If the alias is the same as the expression, we can just use `set alias` in morphql
    // actually in morphql `set expr` is valid. Wait, `set a = b` is valid. 
    // If it's a field selection like `id`, it should be `set id = id`.
    // Wait, MorphQL `set` syntax is `set [field] = [expr]`. Or just `set [field]`?
    // According to MorphQL docs, `set a = b` works. `set a` is also valid (sets `a` to `a` from source).
    if (field.alias === field.expr) {
      actions.push(`    set ${field.alias}`);
    } else {
      actions.push(`    set ${field.alias} = ${field.expr}`);
    }
  }

  let clauses = 'from source';
  if (ast.where) clauses += ` where ${ast.where}`;
  if (ast.orderBy) clauses += ` orderby ${ast.orderBy} ${ast.orderDesc ? 'desc' : 'asc'}`;
  if (ast.limit) clauses += ` limit ${ast.limit}`;

  return `from object to object
transform
  section multiple data(
${actions.join('\n')}
  ) ${clauses}
`;
}
