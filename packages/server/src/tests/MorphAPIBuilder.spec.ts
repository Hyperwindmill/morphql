import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { createMorphAPI } from '../core/MorphAPIBuilder.js';

describe('MorphAPIBuilder', () => {
  describe('inline queries', () => {
    it('generates a complete OpenAPI document with defaults', async () => {
      const spec = await createMorphAPI()
        .addQuery('get-users', {
          query: 'from json to json transform set id = userId',
        })
        .endpoint('/users', 'get', { outputQuery: 'get-users' })
        .generateSpecs();

      expect(spec.openapi).toBe('3.0.0');
      expect(spec.info.title).toBe('MorphQL API');
      expect(spec.info.version).toBe('1.0.0');
      expect(spec.paths).toHaveProperty('/users');
      expect(spec.paths['/users']).toHaveProperty('get');
    });

    it('applies custom title, version, description', async () => {
      const spec = await createMorphAPI()
        .title('My API')
        .version('2.0.0')
        .description('Custom desc')
        .addQuery('q', {
          query: 'from json to json transform set a = b',
        })
        .endpoint('/x', 'get', { outputQuery: 'q' })
        .generateSpecs();

      expect(spec.info.title).toBe('My API');
      expect(spec.info.version).toBe('2.0.0');
      expect(spec.info.description).toBe('Custom desc');
    });

    it('aggregates same path with different methods', async () => {
      const spec = await createMorphAPI()
        .addQuery('q', {
          query: 'from json to json transform set a = b',
        })
        .endpoint('/items', 'get', { outputQuery: 'q' })
        .endpoint('/items', 'post', {
          inputQuery: 'q',
          outputQuery: 'q',
        })
        .generateSpecs();

      expect(spec.paths['/items']).toHaveProperty('get');
      expect(spec.paths['/items']).toHaveProperty('post');
    });

    it('auto-generates operationId from method and path', async () => {
      const spec = await createMorphAPI()
        .addQuery('q', {
          query: 'from json to json transform set a = b',
        })
        .endpoint('/users/{id}', 'get', { outputQuery: 'q' })
        .generateSpecs();

      expect(spec.paths['/users/{id}'].get.operationId).toBe('get_users_id');
    });

    it('uses custom operationId when provided', async () => {
      const spec = await createMorphAPI()
        .addQuery('q', {
          query: 'from json to json transform set a = b',
        })
        .endpoint('/users', 'get', {
          outputQuery: 'q',
          operationId: 'listAllUsers',
        })
        .generateSpecs();

      expect(spec.paths['/users'].get.operationId).toBe('listAllUsers');
    });

    it('supports anonymous inline queries in endpoint def', async () => {
      const spec = await createMorphAPI()
        .endpoint('/data', 'get', {
          outputQuery: {
            query: 'from json to json transform set name = fullName',
          },
        })
        .generateSpecs();

      expect(spec.paths['/data'].get.responses['200']).toBeDefined();
    });
  });

  describe('directory loading', () => {
    let tmpDir: string;

    beforeEach(() => {
      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'morphql-builder-test-'));
      fs.writeFileSync(
        path.join(tmpDir, 'list-users.morphql'),
        'from json to json transform set id = userId set name = fullName',
      );
    });

    afterEach(() => {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    it('loads queries from directory and uses them in endpoints', async () => {
      const spec = await createMorphAPI()
        .loadDirectory(tmpDir)
        .endpoint('/users', 'get', { outputQuery: 'list-users' })
        .generateSpecs();

      expect(spec.paths['/users'].get.responses['200']).toBeDefined();
    });

    it('mixes directory and inline queries', async () => {
      const spec = await createMorphAPI()
        .loadDirectory(tmpDir)
        .addQuery('create-user', {
          query: 'from json to json transform set userId = id',
        })
        .endpoint('/users', 'get', { outputQuery: 'list-users' })
        .endpoint('/users', 'post', {
          inputQuery: 'create-user',
          outputQuery: 'list-users',
        })
        .generateSpecs();

      expect(spec.paths['/users']).toHaveProperty('get');
      expect(spec.paths['/users']).toHaveProperty('post');
      expect(spec.paths['/users'].post.requestBody).toBeDefined();
    });
  });

  describe('generateEndpointSpec()', () => {
    it('returns a single endpoint fragment', async () => {
      const builder = createMorphAPI().addQuery('q', {
        query: 'from json to json transform set a = b',
      });

      const fragment = await builder.generateEndpointSpec('/items', 'get', {
        outputQuery: 'q',
      });

      expect(fragment.path).toBe('/items');
      expect(fragment.method).toBe('get');
      expect(fragment.spec).toBeDefined();
      expect(fragment.spec.responses).toBeDefined();
    });
  });

  describe('error handling', () => {
    it('throws when endpoint has neither inputQuery nor outputQuery', async () => {
      const builder = createMorphAPI().endpoint('/bad', 'get', {});

      await expect(builder.generateSpecs()).rejects.toThrowError(
        /neither.*inputQuery.*outputQuery/i,
      );
    });

    it('throws when query name is not found', async () => {
      const builder = createMorphAPI().endpoint('/x', 'get', {
        outputQuery: 'nonexistent',
      });

      await expect(builder.generateSpecs()).rejects.toThrowError(
        /not found.*nonexistent/i,
      );
    });

    it('last endpoint wins on duplicate path+method', async () => {
      const spec = await createMorphAPI()
        .addQuery('q1', {
          query: 'from json to json transform set a = b',
        })
        .addQuery('q2', {
          query: 'from json to json transform set x = y',
        })
        .endpoint('/items', 'get', {
          outputQuery: 'q1',
          summary: 'First',
        })
        .endpoint('/items', 'get', {
          outputQuery: 'q2',
          summary: 'Second',
        })
        .generateSpecs();

      expect(spec.paths['/items'].get.summary).toBe('Second');
    });
  });
});
