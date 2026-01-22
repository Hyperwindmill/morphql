export interface MorphQLCache {
  /**
   * Retrieve cached code for a given query.
   * @param query The source query string.
   * @returns The cached Javascript code, or null if not found.
   */
  retrieve(query: string): Promise<string | null>;

  /**
   * Save code to the cache.
   * @param query The source query string.
   * @param code The generated Javascript code.
   */
  save(query: string, code: string): Promise<void>;
}
