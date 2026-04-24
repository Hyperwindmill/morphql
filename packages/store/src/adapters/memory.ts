import { StorageAdapter } from '../types.js';

export class MemoryAdapter implements StorageAdapter {
  constructor(private data: Record<string, any[]> = {}) {}

  async read(collection: string): Promise<any[]> {
    return this.data[collection] || [];
  }

  async write(collection: string, data: any[]): Promise<void> {
    this.data[collection] = data;
  }
}
