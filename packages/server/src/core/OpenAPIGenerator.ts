import { SchemaNode } from '@morphql/core';
import { StagedQuery } from './StagedQueryManager.js';

export class OpenAPIGenerator {
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
      schema.items = this.schemaNodeToOpenAPI(node.items, meta, path);
    }

    return schema;
  }

  static schemaToSample(schema: any): any {
    if (schema.example !== undefined) return schema.example;

    if (schema.type === 'object') {
      const obj: any = {};
      if (schema.properties) {
        for (const [key, value] of Object.entries(
          schema.properties as Record<string, any>,
        )) {
          obj[key] = this.schemaToSample(value);
        }
      }
      return obj;
    }

    if (schema.type === 'array') {
      if (schema.items) {
        return [this.schemaToSample(schema.items)];
      }
      return [];
    }

    const defaults: Record<string, any> = {
      string: 'string',
      number: 0,
      boolean: true,
    };

    if (schema.type === undefined) {
      return 'sample';
    }

    return defaults[schema.type] ?? null;
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

  static async generatePathSpec(
    query: StagedQuery,
    basePath: string,
  ): Promise<any> {
    const requestSchema = this.schemaNodeToOpenAPI(
      query.analysis.source,
      query.meta,
    );
    const responseSchema = this.schemaNodeToOpenAPI(
      query.analysis.target,
      query.meta,
    );

    try {
      const sampleInput = this.schemaToSample(requestSchema);
      const responseExample = await query.engine(sampleInput);
      responseSchema.example = responseExample;
    } catch (e) {
      console.warn(`Failed to generate response example for ${query.name}`);
    }

    const sourceMime = this.getMimeType(query.analysis.sourceFormat);
    const targetMime = this.getMimeType(query.analysis.targetFormat);

    if (sourceMime === 'application/xml') {
      requestSchema.xml = { name: 'root' };
    }
    if (targetMime === 'application/xml') {
      responseSchema.xml = { name: 'root' };
    }

    return {
      paths: {
        [`${basePath}/${query.name}`]: {
          post: {
            tags: ['Staged Queries'],
            summary: `Execute staged query: ${query.name}`,
            operationId: `execute_${query.name}`,
            requestBody: {
              required: true,
              content: { [sourceMime]: { schema: requestSchema } },
            },
            responses: {
              '200': {
                description: 'Successful transformation',
                content: { [targetMime]: { schema: responseSchema } },
              },
            },
          },
        },
      },
    };
  }

  private static getMimeType(format?: string): string {
    switch (format?.toLowerCase()) {
      case 'json':
        return 'application/json';
      case 'xml':
        return 'application/xml';
      default:
        return 'text/plain';
    }
  }
}
