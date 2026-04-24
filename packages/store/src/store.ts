import { compile } from '@morphql/core';
import { parseSQL, ParsedSQL } from './parser.js';
import { transpile } from './transpiler.js';
import { StorageAdapter } from './types.js';

export interface MutationResult {
  type: 'insert' | 'update' | 'delete';
  table: string;
}

export class Store {
  constructor(private adapter: StorageAdapter) {}

  async query(sql: string, variables: Record<string, any> = {}): Promise<any[] | MutationResult> {
    const ast = parseSQL(sql);

    if (ast.type === 'select') {
      return this.executeSelect(ast, variables);
    }

    if (ast.type === 'insert') {
      return this.executeInsert(ast);
    }

    // UPDATE or DELETE — transpile to MorphQL
    const table = ast.type === 'update' ? ast.table : ast.from;
    const mqlQuery = transpile(ast);
    const rawData = await this.adapter.read(table);
    const engine = await compile(mqlQuery);
    const result = engine(rawData) as any;
    const newData = result.data || [];
    await this.adapter.write(table, newData);
    return { type: ast.type, table };
  }

  private async executeSelect(ast: any, variables: Record<string, any>): Promise<any[]> {
    const mqlQuery = transpile(ast);
    const rawData = await this.adapter.read(ast.from);
    const engine = await compile(mqlQuery);
    const result = engine(rawData) as any;
    return result.data || [];
  }

  private async executeInsert(ast: any): Promise<MutationResult> {
    const existing = await this.adapter.read(ast.into);
    let newRecord: any;

    if (ast.jsonValue) {
      newRecord = JSON.parse(ast.jsonValue);
      // Resolve $auto placeholders in JSON values
      resolveAutoIncrements(newRecord, existing);
    } else {
      // Build object from columns + values
      newRecord = {};
      for (let i = 0; i < ast.columns!.length; i++) {
        const raw = ast.values![i];
        // Detect auto(), autoincrement(), or $auto in SQL VALUES
        if (/^(auto|autoincrement)\(\)$/i.test(raw.trim()) || raw.trim() === '$auto') {
          newRecord[ast.columns![i]] = nextId(existing);
        } else {
          newRecord[ast.columns![i]] = parseValue(raw);
        }
      }
    }

    existing.push(newRecord);
    await this.adapter.write(ast.into, existing);
    return { type: 'insert', table: ast.into };
  }
}

/** Compute next autoincrement id from existing records */
function nextId(existing: any[]): number {
  if (existing.length === 0) return 1;
  return Math.max(0, ...existing.map(r => (typeof r.id === 'number' ? r.id : 0))) + 1;
}

/** 
 * Walk a JSON object and replace "$auto" string values with the next id.
 * Escaped "\$auto" becomes the literal string "$auto".
 */
function resolveAutoIncrements(obj: any, existing: any[]): void {
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (val === '$auto') {
      obj[key] = nextId(existing);
    } else if (typeof val === 'string' && val === '\\$auto') {
      // Escaped: store the literal "$auto"
      obj[key] = '$auto';
    } else if (val && typeof val === 'object' && !Array.isArray(val)) {
      resolveAutoIncrements(val, existing);
    }
  }
}

/** Parse a SQL value literal into a JS value */
function parseValue(raw: string): any {
  // Remove surrounding quotes
  if ((raw.startsWith("'") && raw.endsWith("'")) || (raw.startsWith('"') && raw.endsWith('"'))) {
    return raw.slice(1, -1);
  }
  if (raw.toLowerCase() === 'null') return null;
  if (raw.toLowerCase() === 'true') return true;
  if (raw.toLowerCase() === 'false') return false;
  const num = Number(raw);
  if (!isNaN(num)) return num;
  return raw;
}
