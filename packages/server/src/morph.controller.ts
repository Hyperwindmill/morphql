/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  BadRequestException,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ApiKeyGuard } from './auth.guard.js';
import { compile } from '@morphql/core';
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
      prefix: process.env.REDIS_PREFIX || 'mql:',
    })
  : undefined;

export class ExecuteDto {
  @ApiProperty({
    description: 'The MQL query string',
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
    description: 'The MQL query string',
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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

  @Post('compile')
  @ApiOperation({ summary: 'Compile MQL to JavaScript' })
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
