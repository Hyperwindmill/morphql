import { MorphQLCache } from './runtime/cache.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { createHash } from 'node:crypto';

/**
 * File-system based query cache for Node.js and Bun environments.
 *
 * Persists compiled queries as `.js` files so they survive process restarts.
 * Each query is hashed (SHA-256, 12 chars) to produce a stable filename.
 *
 * @example
 * ```typescript
 * import { compile } from '@morphql/core';
 * import { MorphQLFileCache } from '@morphql/core/node';
 *
 * const engine = await compile(query, {
 *   cache: new MorphQLFileCache('.compiled'),
 * });
 * ```
 */
export class MorphQLFileCache implements MorphQLCache {
  private cacheDir: string;

  constructor(cacheDir: string = '.compiled') {
    this.cacheDir = path.resolve(process.cwd(), cacheDir);
  }

  async retrieve(query: string): Promise<string | null> {
    try {
      const hash = this.getHash(query);
      const filePath = path.join(this.cacheDir, `morph_${hash}.js`);
      if (fs.existsSync(filePath)) {
        return fs.promises.readFile(filePath, 'utf8');
      }
    } catch {
      // Ignore errors (e.g., file permissions, directory missing)
    }
    return null;
  }

  async save(query: string, code: string): Promise<void> {
    try {
      if (!fs.existsSync(this.cacheDir)) {
        fs.mkdirSync(this.cacheDir, { recursive: true });
      }
      const hash = this.getHash(query);
      const filePath = path.join(this.cacheDir, `morph_${hash}.js`);
      const content = `/* \nQuery:\n${query}\n*/\n\n${code}`;
      await fs.promises.writeFile(filePath, content, 'utf8');
    } catch {
      // Ignore save errors
    }
  }

  private getHash(content: string): string {
    return createHash('sha256').update(content).digest('hex').substring(0, 12);
  }
}
