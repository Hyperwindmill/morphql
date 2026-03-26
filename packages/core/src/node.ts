/**
 * @morphql/core/node — Node.js & Bun specific utilities.
 *
 * Import from this subpath to avoid pulling Node.js built-ins
 * (fs, crypto, path) into browser bundles.
 *
 * @example
 * ```typescript
 * import { MorphQLFileCache } from '@morphql/core/node';
 * ```
 */
export { MorphQLFileCache } from './file-cache.js';
