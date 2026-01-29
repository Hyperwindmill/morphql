import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module.js';
import { DocumentationService } from '../src/documentation.service.js';
import { StagedQueriesService } from '../src/staged-queries.service.js';

async function generate() {
  console.log('Starting MorphQL Documentation Generation...');
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });

  const stagedQueriesService = app.get(StagedQueriesService);
  const docService = app.get(DocumentationService);

  await stagedQueriesService.loadQueries();
  await docService.refresh();

  console.log('Documentation generated successfully in staged-docs/');
  await app.close();
}

generate().catch((err) => {
  console.error('Failed to generate documentation:', err);
  process.exit(1);
});
