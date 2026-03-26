import { compile, type AnalyzeResult } from '@morphql/core';
import { StagedQueryManager, type StagedQuery } from './StagedQueryManager.js';

export interface InlineQueryDef {
  query: string;
  meta?: Record<string, any>;
}

export type QueryRef = string | InlineQueryDef;

export class QueryRegistry {
  private readonly manager = new StagedQueryManager();
  private readonly inlineCache = new Map<string, StagedQuery>();

  async loadDirectory(dir: string): Promise<void> {
    await this.manager.loadFromDirectory(dir);
  }

  async add(name: string, def: InlineQueryDef): Promise<void> {
    await this.manager.loadFromArray([{ name, query: def.query, meta: def.meta }]);
  }

  resolve(ref: string): StagedQuery;
  resolve(ref: InlineQueryDef): Promise<StagedQuery>;
  resolve(ref: QueryRef): StagedQuery | Promise<StagedQuery> {
    if (typeof ref === 'string') {
      return this.resolveByName(ref);
    }
    return this.resolveInline(ref);
  }

  getAll(): StagedQuery[] {
    return this.manager.getAll();
  }

  private resolveByName(name: string): StagedQuery {
    const query = this.manager.get(name);
    if (!query) {
      const available = this.manager
        .getAll()
        .map((q) => q.name)
        .join(', ');
      throw new Error(
        `Query not found: "${name}". Available queries: ${available || '(none)'}`,
      );
    }
    return query;
  }

  private async resolveInline(def: InlineQueryDef): Promise<StagedQuery> {
    const cached = this.inlineCache.get(def.query);
    if (cached) return cached;

    const engine = await compile(def.query, { analyze: true });
    if (!engine.analysis) {
      throw new Error(`Failed to analyze inline query: ${def.query.slice(0, 60)}...`);
    }

    const staged: StagedQuery = {
      name: `_inline_${this.inlineCache.size}`,
      query: def.query,
      engine,
      analysis: engine.analysis,
      meta: def.meta,
    };

    this.inlineCache.set(def.query, staged);
    return staged;
  }
}
