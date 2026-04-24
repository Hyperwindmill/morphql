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
    } else {
      // Build object from columns + values
      newRecord = {};
      for (let i = 0; i < ast.columns!.length; i++) {
        newRecord[ast.columns![i]] = parseValue(ast.values![i]);
      }
    }

    existing.push(newRecord);
    await this.adapter.write(ast.into, existing);
    return { type: 'insert', table: ast.into };
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
