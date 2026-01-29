import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { StagedQueriesService } from './staged-queries.service.js';
import { SwaggerHelper } from './swagger.helper.js';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DocumentationService implements OnModuleInit {
  private readonly logger = new Logger(DocumentationService.name);
  private readonly docsDir = path.join(process.cwd(), 'staged-docs');

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
      const spec = this.generateQuerySpec(query);
      const filePath = path.join(this.docsDir, `${query.name}.json`);
      fs.writeFileSync(filePath, JSON.stringify(spec, null, 2));
    }
  }

  private generateQuerySpec(query: any) {
    const requestSchema = SwaggerHelper.schemaNodeToOpenAPI(
      query.analysis.source,
      query.meta,
    );
    const responseSchema = SwaggerHelper.schemaNodeToOpenAPI(
      query.analysis.target,
      query.meta,
    );

    const sourceMime = this.getMimeType(query.analysis.sourceFormat);
    const targetMime = this.getMimeType(query.analysis.targetFormat);

    return {
      paths: {
        [`/v1/q/${query.name}`]: {
          post: {
            tags: ['Staged Queries'],
            summary: `Execute staged query: ${query.name}`,
            operationId: `execute_${query.name}`,
            requestBody: {
              required: true,
              content: {
                [sourceMime]: {
                  schema: requestSchema,
                },
              },
            },
            responses: {
              '200': {
                description: 'Successful transformation',
                content: {
                  [targetMime]: {
                    schema: responseSchema,
                  },
                },
              },
            },
          },
        },
      },
    };
  }

  private getMimeType(format?: string): string {
    switch (format?.toLowerCase()) {
      case 'json':
        return 'application/json';
      case 'xml':
        return 'application/xml';
      default:
        return 'text/plain';
    }
  }

  getDocFragments(): any[] {
    if (!fs.existsSync(this.docsDir)) return [];

    const files = fs
      .readdirSync(this.docsDir)
      .filter((f) => f.endsWith('.json'));
    return files.map((file) => {
      const content = fs.readFileSync(path.join(this.docsDir, file), 'utf-8');
      return JSON.parse(content);
    });
  }
}
