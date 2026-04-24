import { describe, expect, it } from 'vitest';
import { MemoryAdapter } from '../adapters/memory.js';

describe('Storage Adapters', () => {
  it('MemoryAdapter should read from memory', async () => {
    const adapter = new MemoryAdapter({ users: [{ id: 1 }] });
    const data = await adapter.read('users');
    expect(data).toEqual([{ id: 1 }]);
  });
});
