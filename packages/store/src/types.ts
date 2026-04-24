export interface StorageAdapter {
  read(collection: string): Promise<any[]>;
}
