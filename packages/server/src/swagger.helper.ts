import { SchemaNode } from '@morphql/core';

export class SwaggerHelper {
  static schemaNodeToOpenAPI(
    node: SchemaNode,
    meta?: Record<string, any>,
    path = '',
  ): any {
    if (node.type === 'any') {
      const schema: any = {};
      this.applyMeta(schema, path, meta);
      return schema; // Represents "any" in OpenAPI 3.0
    }

    const typeMap: Record<string, string> = {
      string: 'string',
      number: 'number',
      boolean: 'boolean',
      object: 'object',
      array: 'array',
    };

    const schema: any = {};

    if (node.type === 'null') {
      schema.nullable = true;
    } else {
      schema.type = typeMap[node.type] || 'object';
    }

    this.applyMeta(schema, path, meta);

    if (node.type === 'object') {
      if (node.properties && Object.keys(node.properties).length > 0) {
        schema.properties = {};
        for (const [key, childNode] of Object.entries(node.properties)) {
          const childPath = path ? `${path}.${key}` : key;
          schema.properties[key] = this.schemaNodeToOpenAPI(
            childNode,
            meta,
            childPath,
          );
        }
      }

      if (node.isOpen) {
        schema.additionalProperties = true;
      }
    }

    if (node.type === 'array' && node.items) {
      // User requested skipping array indexes in path tracking
      schema.items = this.schemaNodeToOpenAPI(node.items, meta, path);
    }

    return schema;
  }

  private static applyMeta(
    schema: any,
    path: string,
    meta?: Record<string, any>,
  ) {
    if (!meta || !path) return;

    const entry = meta[path];
    if (entry) {
      if (entry.type) schema.type = entry.type;
      if (entry.description) schema.description = entry.description;
      if (entry.example !== undefined) schema.example = entry.example;
    }
  }
}
