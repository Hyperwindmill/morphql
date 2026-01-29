import { SchemaNode, MorphType } from '@morphql/core';

export class SwaggerHelper {
  static schemaNodeToOpenAPI(node: SchemaNode): any {
    const typeMap: Record<MorphType, string> = {
      string: 'string',
      number: 'number',
      boolean: 'boolean',
      object: 'object',
      array: 'array',
      any: 'object', // Fallback for any
      null: 'string', // Nullable is handled differently in OpenAPI
    };

    const schema: any = {
      type: typeMap[node.type] || 'object',
    };

    if (node.type === 'null') {
      schema.nullable = true;
    }

    if (node.type === 'object' || node.type === 'any') {
      if (node.properties) {
        schema.properties = {};
        for (const [key, childNode] of Object.entries(node.properties)) {
          schema.properties[key] = this.schemaNodeToOpenAPI(childNode);
        }
      } else if (node.isOpen) {
        schema.additionalProperties = true;
      }
    }

    if (node.type === 'array' && node.items) {
      schema.items = this.schemaNodeToOpenAPI(node.items);
    }

    return schema;
  }
}
