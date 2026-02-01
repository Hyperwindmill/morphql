import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { StagedQueriesService } from "./staged-queries.service.js";
import { OpenAPIGenerator } from "@morphql/server";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class DocumentationService implements OnModuleInit {
  private readonly logger = new Logger(DocumentationService.name);
  private readonly docsDir = path.join(process.cwd(), "staged-docs");

  constructor(private readonly stagedQueriesService: StagedQueriesService) {}

  async onModuleInit() {
    await this.refresh();
  }

  async refresh() {
    await this.stagedQueriesService.waitReady();
    if (!fs.existsSync(this.docsDir)) {
      fs.mkdirSync(this.docsDir, { recursive: true });
    }

    const queries = this.stagedQueriesService.getQueries();
    this.logger.log(
      `Refreshing documentation for ${queries.length} staged queries`,
    );

    for (const query of queries) {
      const spec = await OpenAPIGenerator.generatePathSpec(query, "/v1/q");
      const filePath = path.join(this.docsDir, `${query.name}.json`);
      fs.writeFileSync(filePath, JSON.stringify(spec, null, 2));
    }
  }

  getDocFragments(): any[] {
    if (!fs.existsSync(this.docsDir)) return [];

    const files = fs
      .readdirSync(this.docsDir)
      .filter((f) => f.endsWith(".json"));
    return files.map((file) => {
      const content = fs.readFileSync(path.join(this.docsDir, file), "utf-8");
      return JSON.parse(content);
    });
  }
}
