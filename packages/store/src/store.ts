import { compile } from '@morphql/core';
import { parseSQL } from './parser.js';
import { transpile } from './transpiler.js';
import { StorageAdapter } from './types.js';

export class Store {
  constructor(private adapter: StorageAdapter) {}

  async query(sql: string, variables: Record<string, any> = {}): Promise<any[]> {
    const ast = parseSQL(sql);
    const mqlQuery = transpile(ast);
    
    const rawData = await this.adapter.read(ast.from);
    
    const engine = await compile(mqlQuery);
    const result = engine(rawData, variables) as any;
    
    return result.data || [];
  }
}
