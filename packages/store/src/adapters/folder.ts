import { StorageAdapter } from '../types.js';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { existsSync } from 'node:fs';

export class FolderAdapter implements StorageAdapter {
  constructor(private directory: string, private options: { pretty?: boolean } = {}) {}

  async read(source: string): Promise<any[]> {
    if (!source || source === 'source') {
      return [];
    }
    
    // Safety check to prevent escaping the directory using absolute paths
    const resolvedDir = path.resolve(this.directory);
    const targetFile = path.resolve(this.directory, `${source}.json`);
    
    if (!targetFile.startsWith(resolvedDir)) {
      throw new Error(`Invalid source table name: ${source}`);
    }

    if (!existsSync(targetFile)) {
      return [];
    }

    try {
      const content = await fs.readFile(targetFile, 'utf8');
      const parsed = JSON.parse(content);
      
      // Ensure we return an array, even if the JSON is a single object
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [parsed];
    } catch (e: any) {
      throw new Error(`Failed to read from table '${source}': ${e.message}`);
    }
  }

  async write(collection: string, data: any[]): Promise<void> {
    const resolvedDir = path.resolve(this.directory);
    const targetFile = path.resolve(this.directory, `${collection}.json`);

    if (!targetFile.startsWith(resolvedDir)) {
      throw new Error(`Invalid collection name: ${collection}`);
    }

    const content = this.options.pretty 
      ? JSON.stringify(data, null, 2) 
      : JSON.stringify(data);

    await fs.writeFile(targetFile, content, 'utf8');
  }
}
