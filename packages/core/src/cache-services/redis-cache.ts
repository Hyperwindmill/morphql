import type { MQLCache } from '../runtime/cache.js';

/**
 * Configuration options for the Redis cache.
 */
export interface RedisCacheOptions {
  /** Redis host. Default: 'localhost' */
  host?: string;
  /** Redis port. Default: 6379 */
  port?: number;
  /** Key prefix for all cached queries. Default: 'mql:' */
  prefix?: string;
  /** TTL in seconds. Default: undefined (no expiration) */
  ttl?: number;
}

/**
 * Redis-backed implementation of MQLCache.
 * Requires `ioredis` as a peer dependency.
 *
 * @example
 * ```typescript
 * import { compile } from '@query-morph/core';
 * import { RedisCache } from '@query-morph/core/cache-services';
 *
 * const cache = new RedisCache({ host: 'localhost', port: 6379 });
 * const engine = await compile(query, { cache });
 * ```
 */
export class RedisCache implements MQLCache {
  private client: any;
  private prefix: string;
  private ttl?: number;

  constructor(options: RedisCacheOptions = {}) {
    this.prefix = options.prefix ?? 'mql:';
    this.ttl = options.ttl;

    // Dynamic import to keep ioredis as optional peer dependency
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Redis = require('ioredis');
      this.client = new Redis({
        host: options.host ?? 'localhost',
        port: options.port ?? 6379,
        lazyConnect: true,
      });
    } catch {
      throw new Error(
        'RedisCache requires "ioredis" package. Install it with: npm install ioredis'
      );
    }
  }

  /**
   * Generate a cache key from the query string using a simple hash.
   */
  private getKey(query: string): string {
    let hash = 0;
    for (let i = 0; i < query.length; i++) {
      const char = query.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    return `${this.prefix}${hash.toString(16)}`;
  }

  async retrieve(query: string): Promise<string | null> {
    const key = this.getKey(query);
    return this.client.get(key);
  }

  async save(query: string, code: string): Promise<void> {
    const key = this.getKey(query);
    if (this.ttl) {
      await this.client.set(key, code, 'EX', this.ttl);
    } else {
      await this.client.set(key, code);
    }
  }

  /**
   * Close the Redis connection.
   */
  async disconnect(): Promise<void> {
    await this.client.quit();
  }
}
