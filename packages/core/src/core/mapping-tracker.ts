export type MorphType = 'string' | 'number' | 'boolean' | 'null' | 'object' | 'array' | 'any';

export interface SchemaNode {
  type: MorphType;
  properties?: Record<string, SchemaNode>;
  items?: SchemaNode;
  isOpen?: boolean;
}

export interface AnalyzeResult {
  source: SchemaNode;
  target: SchemaNode;
  sourceFormat?: string;
  targetFormat?: string;
}

export class MappingTracker {
  public sourceRoot: SchemaNode = { type: 'object', properties: {} };
  public targetRoot: SchemaNode = { type: 'object', properties: {} };

  private sourceStack: SchemaNode[] = [this.sourceRoot];
  private targetStack: SchemaNode[] = [this.targetRoot];

  private getCurrentSource() {
    return this.sourceStack[this.sourceStack.length - 1];
  }
  private getCurrentTarget() {
    return this.targetStack[this.targetStack.length - 1];
  }

  public recordAccess(path: string, type: MorphType = 'any', isTarget: boolean = false) {
    const node = isTarget ? this.getCurrentTarget() : this.getCurrentSource();
    this.setInNode(node, path, type);
  }

  public recordAssignment(path: string, type: MorphType = 'any') {
    this.setInNode(this.getCurrentTarget(), path, type);
  }

  public recordClone(fields?: string[]) {
    const target = this.getCurrentTarget();
    if (fields) {
      fields.forEach((f) => {
        this.setInNode(this.getCurrentSource(), f, 'any');
        this.setInNode(target, f, 'any');
      });
    } else {
      target.isOpen = true;
    }
  }

  public recordDelete(path: string) {
    const target = this.getCurrentTarget();
    this.deleteInNode(target, path);
  }

  public pushSection(name: string, followPath: string | 'parent', isMultiple: boolean) {
    // 1. Mark followPath in current source
    if (followPath !== 'parent') {
      this.setInNode(this.getCurrentSource(), followPath, isMultiple ? 'array' : 'object');
    }

    // 2. Prepare sub-nodes
    const newTargetNode: SchemaNode = { type: isMultiple ? 'array' : 'object' };
    if (isMultiple) {
      newTargetNode.items = { type: 'object', properties: {} };
    } else {
      newTargetNode.properties = {};
    }

    const newSourceNode: SchemaNode = { type: 'object', properties: {} };

    // 3. Attach to current target
    this.setInNodeExplicit(this.getCurrentTarget(), name, newTargetNode);

    // 4. Update stacks
    this.targetStack.push(isMultiple ? newTargetNode.items! : newTargetNode);
    this.sourceStack.push(newSourceNode);
  }

  public popSection(followPath: string | 'parent', isMultiple: boolean) {
    const sourceNode = this.sourceStack.pop()!;
    this.targetStack.pop();
    const parentSource = this.getCurrentSource();

    if (followPath !== 'parent') {
      const followNode = this.getOrSetNode(
        parentSource,
        followPath,
        isMultiple ? 'array' : 'object'
      );
      const targetPropertiesNode = isMultiple ? followNode.items : followNode;
      if (targetPropertiesNode) {
        if (!targetPropertiesNode.properties) targetPropertiesNode.properties = {};
        Object.assign(targetPropertiesNode.properties, sourceNode.properties || {});
      }
    } else {
      if (!parentSource.properties) parentSource.properties = {};
      Object.assign(parentSource.properties, sourceNode.properties || {});
    }
  }

  private parsePath(path: string): string[] {
    if (!path) return [];
    // Tokenize path into parts where [n] is converted to '[]'
    // Example: a.b[0][1].c -> ['a', 'b', '[]', '[]', 'c']
    const result: string[] = [];
    const internalParts = path.split('.');
    for (const part of internalParts) {
      const match = part.match(/^([^[\]]*)((?:\[\d+\])*)$/);
      if (match) {
        if (match[1]) result.push(match[1]);
        const brackets = match[2].match(/\[\d+\]/g);
        if (brackets) {
          for (const _ of brackets) {
            result.push('[]');
          }
        }
      } else {
        result.push(part);
      }
    }
    return result;
  }

  private setInNode(node: SchemaNode, path: string, type: MorphType) {
    const parts = this.parsePath(path);
    let current = node;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;

      if (part === '[]') {
        current.type = 'array';
        if (!current.items) current.items = { type: isLast ? type : 'object', properties: {} };
        current = current.items;
        continue;
      }

      if (!current.properties) current.properties = {};
      if (isLast) {
        if (!current.properties[part] || current.properties[part].type === 'any') {
          current.properties[part] = { type };
          if (type === 'object') {
            current.properties[part].properties = {};
          } else if (type === 'array') {
            current.properties[part].items = { type: 'object', properties: {} };
          }
        }
      } else {
        if (!current.properties[part])
          current.properties[part] = { type: 'object', properties: {} };
        current = current.properties[part];
      }
    }
  }

  private setInNodeExplicit(node: SchemaNode, path: string, newNode: SchemaNode) {
    const parts = this.parsePath(path);
    let current = node;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;

      if (part === '[]') {
        current.type = 'array';
        if (!current.items)
          current.items = { type: isLast ? newNode.type : 'object', properties: {} };
        if (isLast) {
          current.items = newNode;
        } else {
          current = current.items;
        }
        continue;
      }

      if (!current.properties) current.properties = {};
      if (isLast) {
        current.properties[part] = newNode;
      } else {
        if (!current.properties[part])
          current.properties[part] = { type: 'object', properties: {} };
        current = current.properties[part];
      }
    }
  }

  private deleteInNode(node: SchemaNode, path: string) {
    const parts = this.parsePath(path);
    let current = node;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;

      if (part === '[]') {
        if (!current.items) return;
        if (isLast) {
          delete (current as any).items;
          current.type = 'any';
        } else {
          current = current.items;
        }
        continue;
      }

      if (!current.properties) return;
      if (isLast) {
        delete current.properties[part];
      } else {
        current = current.properties[part];
        if (!current) return;
      }
    }
  }

  private getOrSetNode(node: SchemaNode, path: string, defaultType: MorphType): SchemaNode {
    const parts = this.parsePath(path);
    let current = node;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;

      if (part === '[]') {
        current.type = 'array';
        if (!current.items) {
          const type = isLast ? defaultType : 'object';
          current.items = { type };
          if (type === 'object') {
            current.items.properties = {};
          } else if (type === 'array') {
            current.items.items = { type: 'object', properties: {} };
          }
        }
        current = current.items;
        continue;
      }

      const type = isLast ? defaultType : 'object';

      if (!current.properties) current.properties = {};
      if (!current.properties[part]) {
        current.properties[part] = { type };
        if (type === 'object') {
          current.properties[part].properties = {};
        } else if (type === 'array') {
          current.properties[part].items = { type: 'object', properties: {} };
        }
      }
      current = current.properties[part];
    }
    return current;
  }

  public getResult(): AnalyzeResult {
    return {
      source: this.sourceRoot,
      target: this.targetRoot,
    };
  }
}
