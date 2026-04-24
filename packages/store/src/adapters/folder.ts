import { StorageAdapter } from '../types.js';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { existsSync } from 'node:fs';

export class FolderAdapter implements StorageAdapter {
  constructor(private directory: string) {}

  async read(source: string): Promise<any[]> {
    if (!source || source === 'source') {
      return [];
    }
    
    // Safety check to prevent escaping the directory
    const normalizedDir = path.normalize(this.directory);
    const targetFile = path.normalize(path.join(this.directory, `${source}.json`));
    
    if (!targetFile.startsWith(normalizedDir)) {
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
}
