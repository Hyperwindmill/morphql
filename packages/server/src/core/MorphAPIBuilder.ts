import { QueryRegistry, type QueryRef, type InlineQueryDef } from './QueryRegistry.js';
import { OpenAPIGenerator } from './OpenAPIGenerator.js';
import type { StagedQuery } from './StagedQueryManager.js';

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export interface EndpointDef {
  inputQuery?: QueryRef;
  outputQuery?: QueryRef;
  summary?: string;
  tags?: string[];
  operationId?: string;
}

export interface OpenAPIFragment {
  path: string;
  method: HttpMethod;
  spec: any;
}

interface PendingEndpoint {
  path: string;
  method: HttpMethod;
  def: EndpointDef;
}

interface PendingDirectory {
  dir: string;
}

interface PendingQuery {
  name: string;
  def: InlineQueryDef;
}

export class MorphAPIBuilder {
  private _title = 'MorphQL API';
  private _version = '1.0.0';
  private _description = '';
  private pendingDirs: PendingDirectory[] = [];
  private pendingQueries: PendingQuery[] = [];
  private pendingEndpoints: PendingEndpoint[] = [];
  private registry: QueryRegistry | null = null;

  title(title: string): this {
    this._title = title;
    return this;
  }

  version(version: string): this {
    this._version = version;
    return this;
  }

  description(description: string): this {
    this._description = description;
    return this;
  }

  loadDirectory(dir: string): this {
    this.pendingDirs.push({ dir });
    return this;
  }

  addQuery(name: string, def: InlineQueryDef): this {
    this.pendingQueries.push({ name, def });
    return this;
  }

  endpoint(path: string, method: HttpMethod, def: EndpointDef): this {
    this.pendingEndpoints.push({ path, method, def });
    return this;
  }

  async generateSpecs(): Promise<any> {
    const registry = await this.buildRegistry();

    const paths: Record<string, any> = {};

    for (const ep of this.pendingEndpoints) {
      const operation = await this.buildOperation(registry, ep);
      if (!paths[ep.path]) paths[ep.path] = {};
      paths[ep.path][ep.method] = operation;
    }

    return {
      openapi: '3.0.0',
      info: {
        title: this._title,
        version: this._version,
        description: this._description,
      },
      paths,
    };
  }

  async generateEndpointSpec(
    path: string,
    method: HttpMethod,
    def: EndpointDef,
  ): Promise<OpenAPIFragment> {
    const registry = await this.buildRegistry();
    const spec = await this.buildOperation(registry, { path, method, def });
    return { path, method, spec };
  }

  private async buildRegistry(): Promise<QueryRegistry> {
    if (this.registry) return this.registry;

    const registry = new QueryRegistry();

    for (const pending of this.pendingDirs) {
      await registry.loadDirectory(pending.dir);
    }

    for (const pending of this.pendingQueries) {
      await registry.add(pending.name, pending.def);
    }

    this.registry = registry;
    return registry;
  }

  private async buildOperation(
    registry: QueryRegistry,
    ep: PendingEndpoint,
  ): Promise<any> {
    const { def, path, method } = ep;

    if (!def.inputQuery && !def.outputQuery) {
      throw new Error(
        `Endpoint ${method.toUpperCase()} ${path} has neither inputQuery nor outputQuery`,
      );
    }

    const inputQuery = def.inputQuery
      ? await this.resolveQuery(registry, def.inputQuery)
      : undefined;

    const outputQuery = def.outputQuery
      ? await this.resolveQuery(registry, def.outputQuery)
      : undefined;

    const operationId =
      def.operationId ?? this.generateOperationId(method, path);

    return OpenAPIGenerator.generateOperationSpec({
      inputQuery,
      outputQuery,
      summary: def.summary,
      tags: def.tags,
      operationId,
    });
  }

  private async resolveQuery(
    registry: QueryRegistry,
    ref: QueryRef,
  ): Promise<StagedQuery> {
    const result = registry.resolve(ref);
    if (result instanceof Promise) return result;
    return result;
  }

  private generateOperationId(method: string, path: string): string {
    const sanitized = path
      .replace(/[{}]/g, '')
      .replace(/[^a-zA-Z0-9/]/g, '')
      .split('/')
      .filter(Boolean)
      .join('_');
    return `${method}_${sanitized}`;
  }
}

export function createMorphAPI(): MorphAPIBuilder {
  return new MorphAPIBuilder();
}
