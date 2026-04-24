import { ParsedSQL, ParsedSelect, ParsedUpdate, ParsedDelete } from './parser.js';

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
  const setActions = ast.set.map(s => `      set ${s.field} = ${s.expr}`).join('\n');
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
 * Simple helper to convert SQL syntax to MorphQL syntax.
 * Focuses on operators: = becomes ==.
 */
function sqlToMorphQL(expr: string): string {
  // Replace = with ==, but be careful not to touch ==, !=, <=, >=
  // We use a regex that looks for = NOT preceded by !, <, >, = and NOT followed by =
  return expr.replace(/(?<![!<>=])=(?!=)/g, '==');
}
