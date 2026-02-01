import { Module } from '@nestjs/common';
import { MorphController } from './morph.controller.js';
import { StagedQueriesService } from './staged-queries.service.js';
import { DocumentationService } from './documentation.service.js';

@Module({
  imports: [],
  controllers: [MorphController],
  providers: [StagedQueriesService, DocumentationService],
})
export class AppModule {}
