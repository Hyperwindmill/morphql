import { parser } from './parser.js';
import { functionRegistry } from './functions.js';

const BaseCstVisitor = parser.getBaseCstVisitorConstructor();

export class MorphCompiler extends (BaseCstVisitor as any) {
  // Context for modify directive - determines whether to read from 'source' or 'target'
  private readFrom: 'source' | 'target' = 'source';

  constructor() {
    super();
    this.validateVisitor();
  }

  /**
   * Visit with a temporary context change
   */
  private visitWithContext(node: any, context: { readFrom: 'source' | 'target' }) {
    const previousReadFrom = this.readFrom;
    this.readFrom = context.readFrom;
    const result = this.visit(node);
    this.readFrom = previousReadFrom;
    return result;
  }

  query(ctx: any) {
    const actions = ctx.action ? ctx.action.map((a: any) => this.visit(a)) : [];

    if (!ctx.Transform) {
      actions.push('Object.assign(target, source);');
    }

    const sourceType = this.visit(ctx.sourceType);
    const targetType = this.visit(ctx.targetType);

    // Helper to serialize types for generated code
    const sourceTypeName = sourceType.name;
    const targetTypeName = targetType.name;
    const targetParam = targetType.parameter ? `'${targetType.parameter}'` : 'undefined';

    const code = `
      return function(input, env) {
        // 1. Parse Input
        const source = env.parse('${sourceTypeName}', input);
        const _rootSource = source;
        
        // 2. Transform
        const target = {};
        const _rootTarget = target;
        ${actions.join('\n        ')}

        // 3. Serialize Output
        return env.serialize('${targetTypeName}', target ${targetParam !== 'undefined' ? `, { rootGenerated: ${targetParam} }` : ''} );
      }
    `;

    return {
      code,
      sourceType,
      targetType,
    };
  }

  typeFormat(ctx: any) {
    const id = this.visit(ctx.name);
    let parameter = undefined;
    if (ctx.parameter) {
      // Remove quotes from string literal
      parameter = ctx.parameter[0].image.slice(1, -1);
    }
    return { name: id.name, parameter };
  }

  private genAccess(base: string, id: { name: string; quoted: boolean }) {
    if (id.quoted || (id.name.includes('-') && !id.name.includes('.') && !id.name.includes('['))) {
      return `${base}["${id.name}"]`;
    }
    return `${base}.${id.name}`;
  }

  anyIdentifier(ctx: any) {
    if (ctx.Identifier) {
      return { name: ctx.Identifier[0].image, quoted: false };
    }
    if (ctx.QuotedIdentifier) {
      // Remove backticks and unescape
      const name = ctx.QuotedIdentifier[0].image.slice(1, -1).replace(/\\(.)/g, '$1');
      return { name, quoted: true };
    }
  }

  literal(ctx: any) {
    if (ctx.StringLiteral) {
      return ctx.StringLiteral[0].image;
    }
    if (ctx.NumericLiteral) {
      return ctx.NumericLiteral[0].image;
    }
  }

  action(ctx: any) {
    if (ctx.setRule) {
      return this.visit(ctx.setRule);
    }
    if (ctx.modifyRule) {
      return this.visit(ctx.modifyRule);
    }
    if (ctx.sectionRule) {
      return this.visit(ctx.sectionRule);
    }
    if (ctx.cloneRule) {
      return this.visit(ctx.cloneRule);
    }
    if (ctx.ifAction) {
      return this.visit(ctx.ifAction);
    }
    if (ctx.deleteRule) {
      return this.visit(ctx.deleteRule);
    }
    if (ctx.defineRule) {
      return this.visit(ctx.defineRule);
    }
  }

  deleteRule(ctx: any) {
    const field = this.visit(ctx.field);
    return `delete ${this.genAccess('target', field)};`;
  }

  ifAction(ctx: any) {
    const condition = this.visit(ctx.condition);
    const thenActions = ctx.thenActions
      ? ctx.thenActions.map((a: any) => this.visit(a)).join('\n')
      : '';
    const elseBlock = ctx.elseActions
      ? `else { ${ctx.elseActions.map((a: any) => this.visit(a)).join('\n')} }`
      : '';

    return `if (${condition}) {
       ${thenActions}
     } ${elseBlock}`;
  }

  cloneRule(ctx: any) {
    if (ctx.fields) {
      const identifiers = ctx.fields.map((f: any) => this.visit(f));
      return identifiers
        .map((id: any) => `${this.genAccess('target', id)} = ${this.genAccess('source', id)};`)
        .join('\n        ');
    }
    return `Object.assign(target, source);`;
  }

  setRule(ctx: any) {
    const left = this.visit(ctx.left);
    const right = this.visit(ctx.right);
    return `${this.genAccess('target', left)} = ${right};`;
  }

  modifyRule(ctx: any) {
    const left = this.visit(ctx.left);
    const right = this.visitWithContext(ctx.right, { readFrom: 'target' });
    return `${this.genAccess('target', left)} = ${right};`;
  }

  defineRule(ctx: any) {
    const left = this.visit(ctx.left);
    const right = this.visit(ctx.right);
    return `${this.genAccess('source', left)} = ${right};`;
  }

  expression(ctx: any) {
    return this.visit(ctx.logicalOr);
  }

  logicalOr(ctx: any) {
    let result = this.visit(ctx.lhs);
    if (ctx.rhs) {
      for (let i = 0; i < ctx.rhs.length; i++) {
        const rhs = this.visit(ctx.rhs[i]);
        result = `${result} || ${rhs}`;
      }
    }
    return result;
  }

  logicalAnd(ctx: any) {
    let result = this.visit(ctx.lhs);
    if (ctx.rhs) {
      for (let i = 0; i < ctx.rhs.length; i++) {
        const rhs = this.visit(ctx.rhs[i]);
        result = `${result} && ${rhs}`;
      }
    }
    return result;
  }

  comparison(ctx: any) {
    let result = this.visit(ctx.lhs);
    if (ctx.rhs) {
      const op = ctx.ops[0].image;
      const rhs = this.visit(ctx.rhs[0]);
      result = `${result} ${op} ${rhs}`;
    }
    return result;
  }

  addition(ctx: any) {
    let result = this.visit(ctx.lhs);
    if (ctx.rhs) {
      for (let i = 0; i < ctx.rhs.length; i++) {
        const op = ctx.ops[i].image;
        const rhs = this.visit(ctx.rhs[i]);
        result = `${result} ${op} ${rhs}`;
      }
    }
    return result;
  }

  multiplication(ctx: any) {
    let result = this.visit(ctx.lhs);
    if (ctx.rhs) {
      for (let i = 0; i < ctx.rhs.length; i++) {
        const op = ctx.ops[i].image;
        const rhs = this.visit(ctx.rhs[i]);
        result = `${result} ${op} ${rhs}`;
      }
    }
    return result;
  }

  unaryExpression(ctx: any) {
    const atomic = this.visit(ctx.atomic);
    if (ctx.sign) {
      const op = ctx.sign[0].image;
      return `${op}${atomic}`;
    }
    return atomic;
  }

  atomic(ctx: any) {
    if (ctx.literal) {
      return this.visit(ctx.literal);
    }
    if (ctx.functionCall) {
      return this.visit(ctx.functionCall);
    }
    if (ctx.anyIdentifier) {
      const id = this.visit(ctx.anyIdentifier);
      if (['true', 'false', 'null'].includes(id.name) && !id.quoted) {
        return id.name;
      }
      if (!id.quoted) {
        if (id.name === '_source' || id.name.startsWith('_source.') || id.name.startsWith('_source[')) {
          return `_rootSource${id.name.substring(7)}`;
        }
        if (id.name === '_target' || id.name.startsWith('_target.') || id.name.startsWith('_target[')) {
          return `_rootTarget${id.name.substring(7)}`;
        }
      }
      return this.genAccess(this.readFrom, id);
    }
    if (ctx.expression) {
      return `(${this.visit(ctx.expression)})`;
    }
  }

  functionCall(ctx: any) {
    const originalName = ctx.name[0].image;
    const name = (
      originalName.startsWith('`') ? originalName.slice(1, -1) : originalName
    ).toLowerCase();
    const args = ctx.args ? ctx.args.map((a: any) => this.visit(a)) : [];

    const handler = functionRegistry[name];
    if (handler) {
      return handler(args);
    }

    throw new Error(`Unknown function: ${originalName}`);
  }

  sectionRule(ctx: any) {
    const sectionId = this.visit(ctx.sectionName);
    const sectionName = sectionId.name;
    const sectionAccess = this.genAccess('target', sectionId);

    const followPathId = ctx.followPath ? this.visit(ctx.followPath) : sectionId;
    const followPath = followPathId.name === 'parent' ? '' : '.' + followPathId.name;
    // Note: followPath currently only supports simple paths or 'parent'.
    // If it's a quoted identifier, genAccess would return target["name"].
    // But section handling uses '.' + followPath.
    // I should probably use genAccess here too for consistency, but it needs to be relative to 'source'.
    const sourceAccess =
      followPathId.name === 'parent' ? 'source' : this.genAccess('source', followPathId);

    const isMultiple = !!ctx.Multiple;
    const actions = ctx.action ? ctx.action.map((a: any) => this.visit(a)) : [];

    // Check if this is a subquery section
    const isSubquery = !!ctx.subqueryFrom;

    if (isSubquery) {
      const subSourceType = this.visit(ctx.subquerySourceType);
      const subTargetType = this.visit(ctx.subqueryTargetType);
      const hasTransform = !!ctx.subqueryTransform;

      if (!hasTransform) {
        // Pure format conversion - copy all fields
        actions.push('Object.assign(target, source);');
      }

      const subTargetParam = subTargetType.parameter
        ? `, { rootGenerated: "${subTargetType.parameter}" }`
        : '';

      if (isMultiple) {
        return `
        if (${sourceAccess} && Array.isArray(${sourceAccess})) {
          ${sectionAccess} = ${sourceAccess}.map(item => {
            const subSource = env.parse('${subSourceType.name}', item);
            const source = subSource;
            const target = {};
            ${actions.join('\n            ')}
            return env.serialize('${subTargetType.name}', target${subTargetParam});
          });
        }
        `;
      } else {
        return `
        if (${sourceAccess}) {
          ${sectionAccess} = (function(innerSource) {
            const subSource = env.parse('${subSourceType.name}', innerSource);
            const source = subSource;
            const target = {};
            ${actions.join('\n            ')}
            return env.serialize('${subTargetType.name}', target${subTargetParam});
          })(${sourceAccess});
        }
        `;
      }
    }

    // Regular section handling (unchanged)
    if (isMultiple) {
      return `
      if (${sourceAccess} && Array.isArray(${sourceAccess})) {
        ${sectionAccess} = ${sourceAccess}.map(item => {
          const source = item;
          const target = {};
          ${actions.join('\n          ')}
          return target;
        });
      }
      `;
    } else {
      return `
      if (${sourceAccess}) {
        ${sectionAccess} = (function(innerSource) {
          const source = innerSource;
          const target = {};
          ${actions.join('\n          ')}
          return target;
        })(${sourceAccess});
      }
      `;
    }
  }
}

export const compiler = new MorphCompiler();
