export type ParsedSQL = ParsedSelect | ParsedInsert | ParsedUpdate | ParsedDelete;

export interface ParsedSelect {
  type: 'select';
  select: { alias: string; expr: string }[];
  hasWildcard: boolean;
  from: string;
  where?: string;
  orderBy?: string;
  orderDesc?: boolean;
  limit?: string;
}

export interface ParsedInsert {
  type: 'insert';
  into: string;
  /** For SQL syntax: column names */
  columns?: string[];
  /** For SQL syntax: value expressions (as raw strings) */
  values?: string[];
  /** For JSON syntax: the raw JSON string */
  jsonValue?: string;
}

export interface ParsedUpdate {
  type: 'update';
  table: string;
  set: { field: string; expr: string }[];
  where?: string;
}

export interface ParsedDelete {
  type: 'delete';
  from: string;
  where?: string;
}

export function parseSQL(sql: string): ParsedSQL {
  const trimmed = sql.trim();
  const firstWord = trimmed.split(/\s+/)[0].toLowerCase();

  switch (firstWord) {
    case 'select': return parseSelect(trimmed);
    case 'insert': return parseInsert(trimmed);
    case 'update': return parseUpdate(trimmed);
    case 'delete': return parseDelete(trimmed);
    default: throw new Error(`Unsupported SQL statement: ${firstWord}`);
  }
}

function parseSelect(sql: string): ParsedSelect {
  const result: ParsedSelect = {
    type: 'select',
    select: [],
    hasWildcard: false,
    from: ''
  };

  const masked = maskStringsAndParens(sql);
  
  const fromMatch = masked.match(/\bfrom\b/);
  const whereMatch = masked.match(/\bwhere\b/);
  const orderMatch = masked.match(/\border\s+by\b/) || masked.match(/\borderby\b/);
  const limitMatch = masked.match(/\blimit\b/);

  const fromIdx = fromMatch ? fromMatch.index! : -1;
  const whereIdx = whereMatch ? whereMatch.index! : -1;
  const orderByIdx = orderMatch ? orderMatch.index! : -1;
  const limitIdx = limitMatch ? limitMatch.index! : -1;

  const getIdx = (idx: number) => idx === -1 ? sql.length : idx;

  const selectMatch = masked.match(/^\s*select\s+/);
  const selectStart = selectMatch ? selectMatch.index! + selectMatch[0].length : sql.toLowerCase().indexOf('select') + 6;

  const selectClause = sql.substring(selectStart, getIdx(fromIdx)).trim();
  const selectParts = smartSplit(selectClause, ',');
  
  for (let part of selectParts) {
    part = part.trim();
    if (part === '*') {
      result.hasWildcard = true;
      continue;
    }

    let aliasMatch = part.match(/^(.*?)\s+as\s+([a-zA-Z0-9_]+)$/i);
    if (aliasMatch) {
      result.select.push({ expr: aliasMatch[1].trim(), alias: aliasMatch[2] });
      continue;
    }
    
    aliasMatch = part.match(/^([a-zA-Z0-9_]+)\s*=\s*(.*)$/i);
    if (aliasMatch) {
      result.select.push({ alias: aliasMatch[1].trim(), expr: aliasMatch[2].trim() });
      continue;
    }

    // fallback for 'expr alias' without AS
    aliasMatch = part.match(/^(.*?)\s+([a-zA-Z0-9_]+)$/i);
    if (aliasMatch && !part.includes('(') && !part.includes('"') && !part.includes("'")) {
       result.select.push({ expr: aliasMatch[1].trim(), alias: aliasMatch[2] });
       continue;
    }

    result.select.push({ alias: part, expr: part });
  }

  let nextIdx = Math.min(getIdx(whereIdx), getIdx(orderByIdx), getIdx(limitIdx));
  if (fromIdx !== -1) {
    result.from = sql.substring(fromIdx + fromMatch![0].length, nextIdx).trim();
  }

  if (whereIdx !== -1) {
    nextIdx = Math.min(getIdx(orderByIdx), getIdx(limitIdx));
    result.where = sql.substring(whereIdx + whereMatch![0].length, nextIdx).trim();
  }

  if (orderByIdx !== -1) {
    nextIdx = getIdx(limitIdx);
    const orderClause = sql.substring(orderByIdx + orderMatch![0].length, nextIdx).trim();
    const parts = orderClause.split(/\s+/);
    result.orderBy = parts[0];
    result.orderDesc = parts.length > 1 && parts[1].toLowerCase() === 'desc';
  }

  if (limitIdx !== -1) {
    result.limit = sql.substring(limitIdx + limitMatch![0].length).trim();
  }

  return result;
}

function parseInsert(sql: string): ParsedInsert {
  // Try JSON syntax first: INSERT INTO table { ... }
  const jsonMatch = sql.match(/^\s*insert\s+into\s+(\w+)\s+(\{[\s\S]*\})\s*$/i);
  if (jsonMatch) {
    // Validate the JSON is parseable
    try {
      JSON.parse(jsonMatch[2]);
    } catch {
      throw new Error(`Invalid JSON in INSERT statement: ${jsonMatch[2]}`);
    }
    return { type: 'insert', into: jsonMatch[1], jsonValue: jsonMatch[2] };
  }

  // SQL syntax: INSERT INTO table (col1, col2) VALUES (val1, val2)
  // We use a more robust approach to handle nested parens like auto()
  const headerMatch = sql.match(/^\s*insert\s+into\s+(\w+)\s*/i);
  if (!headerMatch) {
    throw new Error('Invalid INSERT syntax. Use: INSERT INTO table (cols) VALUES (vals) or INSERT INTO table { json }');
  }
  const tableName = headerMatch[1];
  const rest = sql.substring(headerMatch[0].length);

  // Extract balanced paren groups: (cols) VALUES (vals)
  const colGroup = extractParenGroup(rest);
  if (!colGroup) {
    throw new Error('Invalid INSERT syntax. Use: INSERT INTO table (cols) VALUES (vals) or INSERT INTO table { json }');
  }
  
  const afterCols = rest.substring(colGroup.end).trim();
  const valuesMatch = afterCols.match(/^\s*values\s*/i);
  if (!valuesMatch) {
    throw new Error('Invalid INSERT syntax: missing VALUES keyword');
  }

  const valRest = afterCols.substring(valuesMatch[0].length);
  const valGroup = extractParenGroup(valRest);
  if (!valGroup) {
    throw new Error('Invalid INSERT syntax: missing VALUES (...)');
  }

  const columns = colGroup.content.split(',').map(c => c.trim());
  const values = smartSplit(valGroup.content, ',').map(v => v.trim());

  return { type: 'insert', into: tableName, columns, values };
}

function parseUpdate(sql: string): ParsedUpdate {
  const masked = maskStringsAndParens(sql);

  const tableMatch = masked.match(/^\s*update\s+(\w+)\s+set\s+/i);
  if (!tableMatch) {
    throw new Error('Invalid UPDATE syntax. Use: UPDATE table SET field = expr WHERE ...');
  }
  const table = tableMatch[1];

  const setStart = tableMatch[0].length;
  const whereMatch = masked.match(/\bwhere\b/);
  const whereIdx = whereMatch ? whereMatch.index! : sql.length;

  const setClause = sql.substring(setStart, whereIdx).trim();
  const setParts = smartSplit(setClause, ',');
  const setFields = setParts.map(part => {
    const eqIdx = part.indexOf('=');
    if (eqIdx === -1) throw new Error(`Invalid SET clause: ${part}`);
    return { field: part.substring(0, eqIdx).trim(), expr: part.substring(eqIdx + 1).trim() };
  });

  const where = whereIdx < sql.length
    ? sql.substring(whereIdx + whereMatch![0].length).trim()
    : undefined;

  return { type: 'update', table, set: setFields, where };
}

function parseDelete(sql: string): ParsedDelete {
  const masked = maskStringsAndParens(sql);
  const match = masked.match(/^\s*delete\s+from\s+(\w+)/i);
  if (!match) {
    throw new Error('Invalid DELETE syntax. Use: DELETE FROM table WHERE ...');
  }
  const from = match[1];

  const whereMatch = masked.match(/\bwhere\b/);
  const where = whereMatch
    ? sql.substring(whereMatch.index! + whereMatch[0].length).trim()
    : undefined;

  return { type: 'delete', from, where };
}

/** Extract the content of the first balanced parenthesis group from a string */
function extractParenGroup(str: string): { content: string; end: number } | null {
  const start = str.indexOf('(');
  if (start === -1) return null;
  
  let depth = 0;
  let inQuotes = false;
  let quoteChar = '';

  for (let i = start; i < str.length; i++) {
    const char = str[i];
    if (inQuotes) {
      if (char === quoteChar && str[i - 1] !== '\\') inQuotes = false;
    } else if (char === '"' || char === "'") {
      inQuotes = true;
      quoteChar = char;
    } else if (char === '(') {
      depth++;
    } else if (char === ')') {
      depth--;
      if (depth === 0) {
        return { content: str.substring(start + 1, i), end: i + 1 };
      }
    }
  }
  return null;
}

function maskStringsAndParens(sql: string): string {
  let masked = '';
  let inQuotes = false;
  let quoteChar = '';
  let parenDepth = 0;

  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    if (inQuotes) {
      masked += ' '; 
      if (char === quoteChar && sql[i-1] !== '\\') inQuotes = false;
    } else {
      if (char === '"' || char === "'") {
        inQuotes = true;
        quoteChar = char;
        masked += ' ';
      } else if (char === '(') {
        parenDepth++;
        masked += ' '; 
      } else if (char === ')') {
        parenDepth--;
        masked += ' '; 
      } else if (parenDepth > 0) {
        masked += ' '; 
      } else {
        masked += char.toLowerCase();
      }
    }
  }
  return masked;
}

function smartSplit(str: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  let quoteChar = '';
  let parenDepth = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];

    if (inQuotes) {
      current += char;
      if (char === quoteChar && str[i-1] !== '\\') inQuotes = false;
    } else {
      if (char === '"' || char === "'") {
        inQuotes = true;
        quoteChar = char;
        current += char;
      } else if (char === '(') {
        parenDepth++;
        current += char;
      } else if (char === ')') {
        parenDepth--;
        current += char;
      } else if (char === delimiter && parenDepth === 0) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
  }
  
  if (current) result.push(current);
  return result;
}
