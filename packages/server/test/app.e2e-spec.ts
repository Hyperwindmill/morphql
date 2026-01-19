/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { describe, it, expect, beforeEach } from 'vitest';

describe('MorphController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('Health', () => {
    it('/v1/health (GET)', () => {
      return request(app.getHttpServer())
        .get('/v1/health')
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('ok');
        });
    });

    it('/v1/health/ready (GET)', () => {
      // Note: Redis might not be running in this test environment,
      // but the controller handles it gracefully if not configured.
      return request(app.getHttpServer())
        .get('/v1/health/ready')
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('ready');
        });
    });
  });

  const validQuery =
    'from json to json transform set name = "Hello " + fullName';
  const testData = { fullName: 'John Doe' };

  it('/v1/compile (POST)', () => {
    return request(app.getHttpServer())
      .post('/v1/compile')
      .send({ query: validQuery })
      .expect(201)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.code).toBeDefined();
        expect(res.body.code).toContain('function');
      });
  });

  it('/v1/execute (POST)', () => {
    return request(app.getHttpServer())
      .post('/v1/execute')
      .send({ query: validQuery, data: testData })
      .expect(201)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        const result =
          typeof res.body.result === 'string'
            ? JSON.parse(res.body.result)
            : res.body.result;
        expect(result).toEqual({ name: 'Hello John Doe' });
        expect(res.body.executionTime).toBeGreaterThanOrEqual(0);
      });
  });

  it('/v1/execute (POST) - Missing Data', () => {
    return request(app.getHttpServer())
      .post('/v1/execute')
      .send({ query: validQuery })
      .expect(400);
  });
});
