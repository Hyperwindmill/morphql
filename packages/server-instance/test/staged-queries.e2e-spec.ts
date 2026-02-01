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
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Staged Queries (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(() => {
    // Ensure the queries directory exists and has our test query
    const queriesDir = path.resolve(__dirname, './../queries');
    process.env.MORPHQL_QUERIES_DIR = queriesDir;

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
    const response = await request(app.getHttpServer())
      .post('/v1/q/user-profiles')
      .send({
        users: [
          {
            userId: 1,
            firstName: 'John',
            lastName: 'Doe',
            rawAge: '30',
            isActive: true,
          },
        ],
      });

    if (response.status !== 201) {
      console.log(
        'FAILURE RESPONSE:',
        response.status,
        response.body,
        response.text,
      );
    }
    expect(response.status).toBe(201);

    expect(response.get('Content-Type')).toContain('application/xml');
    expect(response.text).toContain('<User>');
    expect(response.text).toContain('<fullName>John Doe</fullName>');
    expect(response.text).toContain('<status>active</status>');
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

    // Check for inferred MIME types
    expect(pathSpec.requestBody.content['application/json']).toBeDefined();
    expect(pathSpec.responses['200'].content['application/xml']).toBeDefined();

    // Check for overridden metadata in requestBody
    const usersSchema =
      pathSpec.requestBody.content['application/json'].schema.properties.users;
    expect(usersSchema.description).toBe('List of users to transform');
    expect(usersSchema.items.properties.userId.example).toBe(123);
    expect(usersSchema.items.properties.rawAge.type).toBe('string');

    // Check for overridden metadata in responses
    const profilesSchema =
      pathSpec.responses['200'].content['application/xml'].schema;

    expect(profilesSchema.properties.profiles).toBeDefined();

    // Check for automatic response example
    expect(profilesSchema.example).toContain('<profiles>');
    expect(profilesSchema.example).toContain('<fullName>John Doe</fullName>');

    expect(
      profilesSchema.properties.profiles.items.properties.fullName.description,
    ).toBe('Combined first and last name');
    expect(
      profilesSchema.properties.profiles.items.properties.status.description,
    ).toBe('Activation status based on isActive flag');
  });

  it('should refresh documentation via /v1/admin/refresh-docs (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/admin/refresh-docs')
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.timestamp).toBeDefined();
  });
});
