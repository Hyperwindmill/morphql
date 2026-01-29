import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { compile, MorphEngine, AnalyzeResult } from '@morphql/core';
import * as fs from 'fs';
import * as path from 'path';

export interface StagedQuery {
  name: string;
  query: string;
  engine: MorphEngine;
  analysis: AnalyzeResult;
}

@Injectable()
export class StagedQueriesService implements OnModuleInit {
  private readonly logger = new Logger(StagedQueriesService.name);
  private readonly stagedQueries: Map<string, StagedQuery> = new Map();
  private readonly queriesDir =
    process.env.MORPHQL_QUERIES_DIR || path.join(process.cwd(), 'queries');

  async onModuleInit() {
    await this.loadQueries();
  }

  async loadQueries() {
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

        this.stagedQueries.set(name, {
          name,
          query: content,
          engine,
          analysis: engine.analysis,
        });
        this.logger.log(`Loaded staged query: ${name}`);
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
