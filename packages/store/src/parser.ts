export interface ParsedSQL {
  select: { alias: string; expr: string }[];
  hasWildcard: boolean;
  from: string;
  where?: string;
  orderBy?: string;
  orderDesc?: boolean;
  limit?: string;
}

export function parseSQL(sql: string): ParsedSQL {
  const result: ParsedSQL = {
    select: [],
    hasWildcard: false,
    from: ''
  };

  const lowerSQL = sql.toLowerCase();
  
  const fromIdx = lowerSQL.indexOf(' from ');
  const whereIdx = lowerSQL.indexOf(' where ');
  const orderIdx = lowerSQL.indexOf(' orderby ');
  const orderByIdx = lowerSQL.indexOf(' order by ') > -1 ? lowerSQL.indexOf(' order by ') : orderIdx;
  const limitIdx = lowerSQL.indexOf(' limit ');

  const getIdx = (idx: number) => idx === -1 ? sql.length : idx;

  const selectClause = sql.substring(7, fromIdx).trim();
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

    result.select.push({ alias: part, expr: part });
  }

  let nextIdx = Math.min(getIdx(whereIdx), getIdx(orderByIdx), getIdx(limitIdx));
  result.from = sql.substring(fromIdx + 6, nextIdx).trim();

  if (whereIdx !== -1) {
    nextIdx = Math.min(getIdx(orderByIdx), getIdx(limitIdx));
    result.where = sql.substring(whereIdx + 7, nextIdx).trim();
  }

  if (orderByIdx !== -1) {
    nextIdx = getIdx(limitIdx);
    const orderClause = sql.substring(orderByIdx + (orderIdx !== -1 ? 9 : 10), nextIdx).trim();
    const parts = orderClause.split(/\s+/);
    result.orderBy = parts[0];
    result.orderDesc = parts.length > 1 && parts[1].toLowerCase() === 'desc';
  }

  if (limitIdx !== -1) {
    result.limit = sql.substring(limitIdx + 7).trim();
  }

  return result;
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
