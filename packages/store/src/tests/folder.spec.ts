import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { FolderAdapter } from '../adapters/folder.js';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

describe('FolderAdapter', () => {
  const testDir = path.join(__dirname, '.test-data');

  beforeAll(async () => {
    await fs.mkdir(testDir, { recursive: true });
    await fs.writeFile(path.join(testDir, 'users.json'), JSON.stringify([{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]));
    await fs.writeFile(path.join(testDir, 'single.json'), JSON.stringify({ id: 99, name: 'Zack' }));
  });

  afterAll(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('should read array of objects from valid json file', async () => {
    const adapter = new FolderAdapter(testDir);
    const data = await adapter.read('users');
    expect(data.length).toBe(2);
    expect(data[0].name).toBe('Alice');
  });

  it('should wrap single object in an array', async () => {
    const adapter = new FolderAdapter(testDir);
    const data = await adapter.read('single');
    expect(Array.isArray(data)).toBe(true);
    expect(data[0].name).toBe('Zack');
  });

  it('should return empty array if file does not exist', async () => {
    const adapter = new FolderAdapter(testDir);
    const data = await adapter.read('nonexistent');
    expect(data.length).toBe(0);
  });

  it('should prevent escaping the directory', async () => {
    const adapter = new FolderAdapter(testDir);
    await expect(adapter.read('../some-other-file')).rejects.toThrow(/Invalid source table name/);
  });
});
