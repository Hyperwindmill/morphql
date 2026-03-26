import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { QueryRegistry } from '../core/QueryRegistry.js';

describe('QueryRegistry', () => {
  describe('add() and resolve()', () => {
    it('resolves an inline query by name after add()', async () => {
      const registry = new QueryRegistry();
      await registry.add('my-query', {
        query: 'from json to json transform set id = userId',
      });

      const resolved = registry.resolve('my-query');
      expect(resolved).toBeDefined();
      expect(resolved.name).toBe('my-query');
      expect(resolved.analysis).toBeDefined();
      expect(resolved.analysis.source).toBeDefined();
      expect(resolved.analysis.target).toBeDefined();
    });

    it('throws when resolving a name that does not exist', () => {
      const registry = new QueryRegistry();
      expect(() => registry.resolve('nonexistent')).toThrowError(
        /not found.*nonexistent/i,
      );
    });

    it('includes available names in the error message', async () => {
      const registry = new QueryRegistry();
      await registry.add('alpha', { query: 'from json to json transform set a = b' });
      await registry.add('beta', { query: 'from json to json transform set a = b' });

      expect(() => registry.resolve('gamma')).toThrowError(/alpha.*beta/);
    });
  });

  describe('resolve() with InlineQueryDef', () => {
    it('compiles and returns a StagedQuery from an inline def', async () => {
      const registry = new QueryRegistry();
      const result = await registry.resolve({
        query: 'from json to json transform set name = firstName',
      });

      expect(result).toBeDefined();
      expect(result.analysis.source).toBeDefined();
      expect(result.analysis.target).toBeDefined();
    });

    it('caches inline queries by query string', async () => {
      const registry = new QueryRegistry();
      const def = { query: 'from json to json transform set x = y' };

      const a = await registry.resolve(def);
      const b = await registry.resolve(def);
      expect(a).toBe(b);
    });
  });

  describe('loadDirectory()', () => {
    let tmpDir: string;

    beforeEach(() => {
      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'morphql-registry-test-'));
    });

    afterEach(() => {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    it('loads .morphql files from a directory', async () => {
      fs.writeFileSync(
        path.join(tmpDir, 'test-query.morphql'),
        'from json to json transform set id = userId',
      );

      const registry = new QueryRegistry();
      await registry.loadDirectory(tmpDir);

      const resolved = registry.resolve('test-query');
      expect(resolved).toBeDefined();
      expect(resolved.name).toBe('test-query');
    });

    it('warns and continues if directory does not exist', async () => {
      const registry = new QueryRegistry();
      await registry.loadDirectory('/nonexistent/path');
      expect(registry.getAll()).toHaveLength(0);
    });
  });

  describe('getAll()', () => {
    it('returns all registered queries', async () => {
      const registry = new QueryRegistry();
      await registry.add('a', { query: 'from json to json transform set x = y' });
      await registry.add('b', { query: 'from json to json transform set x = y' });

      expect(registry.getAll()).toHaveLength(2);
    });
  });
});
