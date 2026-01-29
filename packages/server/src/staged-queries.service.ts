import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
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

@Injectable()
export class StagedQueriesService implements OnModuleInit {
  private readonly logger = new Logger(StagedQueriesService.name);
  private readonly stagedQueries: Map<string, StagedQuery> = new Map();
  private readonly queriesDir =
    process.env.MORPHQL_QUERIES_DIR || path.join(process.cwd(), 'queries');
  private loadingPromise: Promise<void> | null = null;

  async onModuleInit() {
    await this.loadQueries();
  }

  async waitReady() {
    if (this.loadingPromise) {
      await this.loadingPromise;
    }
  }

  async loadQueries() {
    this.loadingPromise = this.internalLoad();
    await this.loadingPromise;
  }

  private async internalLoad() {
    if (!fs.existsSync(this.queriesDir)) {
      this.logger.warn(`Queries directory not found: ${this.queriesDir}`);
      return;
    }

    const files = fs.readdirSync(this.queriesDir);
    const morphFiles = files.filter((f) => f.endsWith('.morphql'));

    this.logger.log(
      `Loading ${morphFiles.length} staged queries from ${this.queriesDir}`,
    );

    for (const file of morphFiles) {
      const name = path.parse(file).name;
      const filePath = path.join(this.queriesDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');

      try {
        const engine = await compile(content, { analyze: true });
        if (!engine.analysis) {
          this.logger.error(`Failed to analyze query: ${name}`);
          continue;
        }

        // Load optional metadata
        let meta: Record<string, any> | undefined;
        const yamlPath = path.join(this.queriesDir, `${name}.meta.yaml`);
        const jsonPath = path.join(this.queriesDir, `${name}.meta.json`);

        if (fs.existsSync(yamlPath)) {
          meta = yaml.load(fs.readFileSync(yamlPath, 'utf-8')) as any;
        } else if (fs.existsSync(jsonPath)) {
          meta = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
        }

        this.stagedQueries.set(name, {
          name,
          query: content,
          engine,
          analysis: engine.analysis,
          meta,
        });
        this.logger.log(
          `Loaded staged query: ${name}${meta ? ' with metadata' : ''}`,
        );
      } catch (e) {
        this.logger.error(
          `Error compiling staged query ${name}: ${e instanceof Error ? e.message : String(e)}`,
        );
      }
    }
  }

  getQueries(): StagedQuery[] {
    return Array.from(this.stagedQueries.values());
  }

  getQuery(name: string): StagedQuery | undefined {
    return this.stagedQueries.get(name);
  }
}
