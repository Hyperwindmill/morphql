/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Staged Queries (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(() => {
    // Ensure the queries directory exists and has our test query
    const queriesDir = path.join(process.cwd(), 'queries');
    if (!fs.existsSync(queriesDir)) {
      fs.mkdirSync(queriesDir, { recursive: true });
    }
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should execute a staged query /v1/q/user-profiles (POST)', async () => {
    const testData = {
      users: [
        {
          userId: '1',
          firstName: 'John',
          lastName: 'Doe',
          rawAge: '30',
          isActive: true,
        },
        {
          userId: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          rawAge: '25',
          isActive: false,
        },
      ],
    };

    const response = await request(app.getHttpServer())
      .post('/v1/q/user-profiles')
      .send(testData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.result.profiles).toHaveLength(2);
    expect(response.body.result.profiles[0]).toEqual({
      id: '1',
      fullName: 'John Doe',
      age: 30,
      status: 'active',
    });
    expect(response.body.result.profiles[1]).toEqual({
      id: '2',
      fullName: 'Jane Smith',
      age: 25,
      status: 'inactive',
    });
  });

  it('should generate documentation fragments in staged-docs/ with metadata overrides', () => {
    const docPath = path.join(
      process.cwd(),
      'staged-docs',
      'user-profiles.json',
    );
    expect(fs.existsSync(docPath)).toBe(true);

    const content = JSON.parse(fs.readFileSync(docPath, 'utf-8'));
    const pathSpec = content.paths['/v1/q/user-profiles'].post;
    expect(pathSpec).toBeDefined();

    // Check for overridden metadata in requestBody
    const usersSchema =
      pathSpec.requestBody.content['application/json'].schema.properties.users;
    expect(usersSchema.description).toBe('List of users to transform');
    expect(usersSchema.items.properties.userId.example).toBe('user_123');
    expect(usersSchema.items.properties.rawAge.type).toBe('string');

    // Check for overridden metadata in responses
    const profilesSchema =
      pathSpec.responses['200'].content['application/json'].schema.properties
        .profiles;
    expect(profilesSchema.items.properties.fullName.description).toBe(
      'Combined first and last name',
    );
    expect(profilesSchema.items.properties.status.description).toBe(
      'Activation status based on isActive flag',
    );
  });

  it('should refresh documentation via /v1/admin/refresh-docs (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/admin/refresh-docs')
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.timestamp).toBeDefined();
  });
});
