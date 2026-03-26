import { describe, it, expect } from 'vitest';
import { compile } from '@morphql/core';
import { OpenAPIGenerator } from '../core/OpenAPIGenerator.js';
import type { StagedQuery } from '../core/StagedQueryManager.js';

async function makeQuery(
  name: string,
  queryStr: string,
  meta?: Record<string, any>,
): Promise<StagedQuery> {
  const engine = await compile(queryStr, { analyze: true });
  return { name, query: queryStr, engine, analysis: engine.analysis!, meta };
}

describe('OpenAPIGenerator.generateOperationSpec()', () => {
  it('generates a response-only operation (GET-like)', async () => {
    const outputQuery = await makeQuery(
      'list-users',
      'from json to json transform set id = userId set name = fullName',
    );

    const op = await OpenAPIGenerator.generateOperationSpec({
      outputQuery,
    });

    expect(op.responses).toBeDefined();
    expect(op.responses['200']).toBeDefined();
    expect(op.responses['200'].content).toHaveProperty('application/json');
    expect(op.requestBody).toBeUndefined();
  });

  it('generates request + response operation (POST-like)', async () => {
    const inputQuery = await makeQuery(
      'create-input',
      'from json to json transform set userId = id',
    );
    const outputQuery = await makeQuery(
      'create-output',
      'from json to json transform set result = status',
    );

    const op = await OpenAPIGenerator.generateOperationSpec({
      inputQuery,
      outputQuery,
    });

    expect(op.requestBody).toBeDefined();
    expect(op.requestBody.required).toBe(true);
    expect(op.requestBody.content).toHaveProperty('application/json');
    expect(op.responses['200'].content).toHaveProperty('application/json');
  });

  it('applies summary, tags, and operationId when provided', async () => {
    const outputQuery = await makeQuery(
      'q',
      'from json to json transform set a = b',
    );

    const op = await OpenAPIGenerator.generateOperationSpec({
      outputQuery,
      summary: 'List all users',
      tags: ['Users'],
      operationId: 'listUsers',
    });

    expect(op.summary).toBe('List all users');
    expect(op.tags).toEqual(['Users']);
    expect(op.operationId).toBe('listUsers');
  });

  it('detects XML content type from query format', async () => {
    const outputQuery = await makeQuery(
      'xml-out',
      'from json to xml transform set name = fullName',
    );

    const op = await OpenAPIGenerator.generateOperationSpec({
      outputQuery,
    });

    expect(op.responses['200'].content).toHaveProperty('application/xml');
  });

  it('uses source schema for input and target schema for output', async () => {
    const inputQuery = await makeQuery(
      'in',
      'from json to json transform set internalId = externalId',
    );
    const outputQuery = await makeQuery(
      'out',
      'from json to json transform set displayName = rawName',
    );

    const op = await OpenAPIGenerator.generateOperationSpec({
      inputQuery,
      outputQuery,
    });

    const reqSchema = op.requestBody.content['application/json'].schema;
    expect(reqSchema.properties).toHaveProperty('externalId');

    const resSchema = op.responses['200'].content['application/json'].schema;
    expect(resSchema.properties).toHaveProperty('displayName');
  });
});
