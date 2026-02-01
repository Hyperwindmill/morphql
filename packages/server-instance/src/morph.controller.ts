/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Res,
  UseGuards,
  BadRequestException,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ApiKeyGuard } from './auth.guard.js';
import { compile } from '@morphql/core';
import { StagedQueriesService } from './staged-queries.service.js';
import { DocumentationService } from './documentation.service.js';
import { RedisCache } from '@morphql/core/cache-services';
import {
  ApiTags,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiHeader,
} from '@nestjs/swagger';

// Initialize cache if configured
const redisHost = process.env.REDIS_HOST;
const cache = redisHost
  ? new RedisCache({
      host: redisHost,
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
      prefix: process.env.REDIS_PREFIX || 'morphql:',
    })
  : undefined;

export class ExecuteDto {
  @ApiProperty({
    description: 'The MorphQL query string',
    example: 'from json to json transform set name = split(fullName, " ")',
  })
  query!: string;

  @ApiProperty({
    description: 'The source data to transform',
    example: { fullName: 'John Doe' },
  })
  data!: Record<string, unknown>;
}

export class CompileDto {
  @ApiProperty({
    description: 'The MorphQL query string',
    example: 'from json to json transform set name = split(fullName, " ")',
  })
  query!: string;
}

export class ExecuteResponseDto {
  @ApiProperty()
  success!: boolean;

  @ApiProperty()
  result!: unknown;

  @ApiProperty()
  executionTime!: number;
}

export class CompileResponseDto {
  @ApiProperty()
  success!: boolean;

  @ApiProperty()
  code!: string;
}

@ApiTags('Morph Engine')
@ApiHeader({
  name: 'X-API-KEY',
  description: 'Optional API Key for authentication',
  required: false,
})
@Controller('v1')
@UseGuards(ApiKeyGuard)
export class MorphController {
  constructor(
    private readonly stagedQueriesService: StagedQueriesService,
    private readonly documentationService: DocumentationService,
  ) {}

  @Post('execute')
  @ApiOperation({ summary: 'Execute a transformation' })
  @ApiResponse({ status: 200, type: ExecuteResponseDto })
  async execute(@Body() body: ExecuteDto): Promise<ExecuteResponseDto> {
    if (!body.query || !body.data) {
      throw new BadRequestException('Missing query or data');
    }

    try {
      const start = performance.now();
      const engine = await compile(body.query, { cache });

      const result = await engine(body.data);
      const end = performance.now();

      return {
        success: true,
        result,
        executionTime: end - start,
      };
    } catch (e: unknown) {
      console.error('Execute Error:', e);
      const message =
        e instanceof Error ? e.message : 'Unknown compilation error';
      throw new InternalServerErrorException(message);
    }
  }

  @Post('q/:name')
  @ApiOperation({ summary: 'Execute a staged transformation' })
  @ApiResponse({ status: 200 })
  async executeStaged(
    @Param('name') name: string,
    @Body() data: Record<string, unknown>,
    @Res({ passthrough: true }) res: any,
  ) {
    const staged = this.stagedQueriesService.getQuery(name);
    if (!staged) {
      throw new BadRequestException(`Staged query not found: ${name}`);
    }

    try {
      const result = await staged.engine(data);
      const mimeType = this.detectMimeType(result);
      res.setHeader('Content-Type', mimeType);
      return result;
    } catch (e: unknown) {
      console.error('Staged Execute Error:', e);
      const message =
        e instanceof Error ? e.message : 'Unknown execution error';
      throw new InternalServerErrorException(message);
    }
  }

  private detectMimeType(result: any): string {
    if (typeof result === 'string') {
      const trimmed = result.trim();
      if (
        trimmed.startsWith('<?xml') ||
        (trimmed.startsWith('<') && trimmed.endsWith('>'))
      ) {
        return 'application/xml';
      }
      return 'text/plain';
    }
    return 'application/json';
  }

  @Post('admin/refresh-docs')
  @ApiOperation({
    summary: 'Refresh OpenApi documentation from staged queries',
  })
  @ApiResponse({ status: 200, description: 'Documentation refreshed' })
  async refreshDocs() {
    await this.stagedQueriesService.loadQueries();
    await this.documentationService.refresh();
    return { success: true, timestamp: new Date().toISOString() };
  }

  @Post('compile')
  // ... rest of the methods
  @ApiOperation({ summary: 'Compile MorphQL to JavaScript' })
  @ApiResponse({ status: 200, type: CompileResponseDto })
  async compile(@Body() body: CompileDto): Promise<CompileResponseDto> {
    if (!body.query) {
      throw new BadRequestException('Missing query');
    }

    try {
      const engine = await compile(body.query, { cache });
      return {
        success: true,
        code: engine.code,
      };
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : 'Unknown compilation error';
      throw new InternalServerErrorException(message);
    }
  }

  @Get('health')
  @ApiOperation({ summary: 'Liveness check' })
  @ApiResponse({ status: 200, description: 'Service is alive' })
  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('health/ready')
  @ApiOperation({ summary: 'Readiness check' })
  @ApiResponse({ status: 200, description: 'Service is ready' })
  @ApiResponse({ status: 503, description: 'Service is not ready' })
  async ready() {
    if (cache && redisHost) {
      const isRedisOk = await cache.ping();
      if (!isRedisOk) {
        throw new ServiceUnavailableException('Redis cache is unavailable');
      }
    }
    return { status: 'ready', timestamp: new Date().toISOString() };
  }
}
