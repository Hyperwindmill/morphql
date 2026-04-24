export interface StorageAdapter {
  read(collection: string): Promise<any[]>;
  write(collection: string, data: any[]): Promise<void>;
}
