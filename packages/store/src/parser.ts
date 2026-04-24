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

  const masked = maskStringsAndParens(sql);
  
  const fromMatch = masked.match(/\s+from\s+/);
  const whereMatch = masked.match(/\s+where\s+/);
  const orderMatch = masked.match(/\s+order\s+by\s+/) || masked.match(/\s+orderby\s+/);
  const limitMatch = masked.match(/\s+limit\s+/);

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
