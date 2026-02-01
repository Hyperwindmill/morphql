import { compile, MorphEngine, AnalyzeResult } from '@morphql/core';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

export interface StagedQuery {
  name: string;
  query: string;
  engine: MorphEngine;
  analysis: AnalyzeResult;
  meta?: Record<string, any>;
}

export interface QueryDefinition {
  name: string;
  query: string;
  meta?: Record<string, any>;
}

export class StagedQueryManager {
  private readonly queries: Map<string, StagedQuery> = new Map();

  async loadFromDirectory(dir: string): Promise<void> {
    if (!fs.existsSync(dir)) {
      console.warn(`Queries directory not found: ${dir}`);
      return;
    }

    const files = fs.readdirSync(dir);
    const morphFiles = files.filter((f) => f.endsWith('.morphql'));

    for (const file of morphFiles) {
      const name = path.parse(file).name;
      const filePath = path.join(dir, file);
      const content = fs.readFileSync(filePath, 'utf-8');

      let meta: Record<string, any> | undefined;
      const yamlPath = path.join(dir, `${name}.meta.yaml`);
      const jsonPath = path.join(dir, `${name}.meta.json`);

      if (fs.existsSync(yamlPath)) {
        meta = yaml.load(fs.readFileSync(yamlPath, 'utf-8')) as any;
      } else if (fs.existsSync(jsonPath)) {
        meta = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
      }

      await this.add({ name, query: content, meta });
    }
  }

  async loadFromArray(definitions: QueryDefinition[]): Promise<void> {
    for (const def of definitions) {
      await this.add(def);
    }
  }

  private async add(def: QueryDefinition): Promise<void> {
    try {
      const engine = await compile(def.query, { analyze: true });
      if (!engine.analysis) {
        console.error(`Failed to analyze query: ${def.name}`);
        return;
      }

      this.queries.set(def.name, {
        name: def.name,
        query: def.query,
        engine,
        analysis: engine.analysis,
        meta: def.meta,
      });
    } catch (e) {
      console.error(`Error compiling query ${def.name}:`, e);
    }
  }

  get(name: string): StagedQuery | undefined {
    return this.queries.get(name);
  }

  getAll(): StagedQuery[] {
    return Array.from(this.queries.values());
  }

  async execute(name: string, data: unknown): Promise<unknown> {
    const query = this.get(name);
    if (!query) {
      throw new Error(`Query not found: ${name}`);
    }
    return query.engine(data);
  }
}
