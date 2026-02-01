import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import { StagedQueryManager, StagedQuery } from "@morphql/server";
import * as path from "path";

@Injectable()
export class StagedQueriesService implements OnModuleInit {
  private readonly logger = new Logger(StagedQueriesService.name);
  private readonly manager = new StagedQueryManager();
  private readonly queriesDir =
    process.env.MORPHQL_QUERIES_DIR || path.join(process.cwd(), "queries");
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
    this.loadingPromise = this.manager.loadFromDirectory(this.queriesDir);
    await this.loadingPromise;
    this.logger.log(
      `Loaded ${this.manager.getAll().length} staged queries from ${this.queriesDir}`,
    );
  }

  getQueries(): StagedQuery[] {
    return this.manager.getAll();
  }

  getQuery(name: string): StagedQuery | undefined {
    return this.manager.get(name);
  }
}
