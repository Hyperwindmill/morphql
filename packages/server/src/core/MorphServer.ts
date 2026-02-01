import { compile, MorphEngine, MorphQLCache } from '@morphql/core';
import { StagedQueryManager } from './StagedQueryManager.js';
import { OpenAPIGenerator } from './OpenAPIGenerator.js';

/**
 * Options for initializing the MorphServer.
 */
export interface MorphServerOptions {
  /** Directory where staged queries (.morphql) are located. */
  queriesDir?: string;
  /** Optional cache service for compiled queries. */
  cache?: MorphQLCache;
}

/**
 * High-level facade for the MorphQL Server core.
 * Provides easy access to query compilation, execution, and staged query management.
 */
export class MorphServer {
  readonly queries = new StagedQueryManager();
  private cache?: MorphQLCache;
  private queriesDir?: string;

  constructor(options?: MorphServerOptions) {
    this.queriesDir = options?.queriesDir;
    this.cache = options?.cache;
  }

  /**
   * Initializes the server, loading staged queries if a directory was provided.
   */
  async initialize(): Promise<void> {
    if (this.queriesDir) {
      await this.queries.loadFromDirectory(this.queriesDir);
    }
  }

  /**
   * Compiles a MorphQL query and returns an executable engine.
   * @param query The MorphQL query string.
   */
  async compile(query: string): Promise<MorphEngine> {
    return compile(query, { cache: this.cache });
  }

  /**
   * Directly executes a MorphQL query against the provided data.
   * @param query The MorphQL query string.
   * @param data The input data for transformation.
   */
  async execute(query: string, data: unknown): Promise<unknown> {
    const engine = await this.compile(query);
    return engine(data);
  }

  /**
   * Executes a pre-loaded staged query by name.
   * @param name The name of the staged query.
   * @param data The input data for transformation.
   */
  async executeStaged(name: string, data: unknown): Promise<unknown> {
    return this.queries.execute(name, data);
  }

  /**
   * Generates OpenAPI (Swagger) specification fragments for all loaded staged queries.
   */
  async getOpenAPIFragments(): Promise<any[]> {
    const fragments: any[] = [];
    for (const query of this.queries.getAll()) {
      const spec = await OpenAPIGenerator.generatePathSpec(query, '/v1/q');
      fragments.push(spec);
    }
    return fragments;
  }
}
