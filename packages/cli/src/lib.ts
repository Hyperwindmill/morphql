/**
 * @morphql/cli — Library exports
 *
 * Import `MorphQLFileCache` from this sub-path to use the filesystem-based
 * compiled-query cache in your own Node.js application:
 *
 * ```typescript
 * import { MorphQLFileCache } from '@morphql/cli/lib';
 *
 * const engine = await compile(query, {
 *   cache: new MorphQLFileCache('.compiled'),
 * });
 * ```
 */
export { MorphQLFileCache } from './file-cache.js';
