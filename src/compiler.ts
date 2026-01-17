import { parser } from './parser.js';
import { functionRegistry } from './functions.js';

const BaseCstVisitor = parser.getBaseCstVisitorConstructor();

export class MorphCompiler extends (BaseCstVisitor as any) {
  constructor() {
    super();
    this.validateVisitor();
  }

  query(ctx: any) {
    const actions = ctx.action ? ctx.action.map((a: any) => this.visit(a)) : [];
    const sourceType = this.visit(ctx.sourceType);
    const targetType = this.visit(ctx.targetType);

    const code = `
      return function transform(source) {
        const target = {};
        ${actions.join('\n        ')}
        return target;
      }
    `;

    return {
      code,
      sourceType,
      targetType,
    };
  }

  typeFormat(ctx: any) {
    const name = this.visit(ctx.name);
    let parameter = undefined;
    if (ctx.parameter) {
      // Remove quotes from string literal
      parameter = ctx.parameter[0].image.slice(1, -1);
    }
    return { name, parameter };
  }

  anyIdentifier(ctx: any) {
    if (ctx.Identifier) {
      return ctx.Identifier[0].image;
    }
    if (ctx.Static) {
      return ctx.Static[0].image;
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
  }

  deleteRule(ctx: any) {
    const field = this.visit(ctx.field);
    return `delete target.${field};`;
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
      const fieldNames = ctx.fields.map((f: any) => this.visit(f));
      return fieldNames.map((f: string) => `target.${f} = source.${f};`).join('\n        ');
    }
    return `Object.assign(target, source);`;
  }

  setRule(ctx: any) {
    const left = this.visit(ctx.left);
    const right = this.visit(ctx.right);
    return `target.${left} = ${right};`;
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
      if (['true', 'false', 'null'].includes(id)) {
        return id;
      }
      return `source.${id}`;
    }
    if (ctx.expression) {
      return `(${this.visit(ctx.expression)})`;
    }
  }

  functionCall(ctx: any) {
    const originalName = ctx.name[0].image;
    const name = originalName.toLowerCase();
    const args = ctx.args ? ctx.args.map((a: any) => this.visit(a)) : [];

    const handler = functionRegistry[name];
    if (handler) {
      return handler(args);
    }

    throw new Error(`Unknown function: ${originalName}`);
  }

  sectionRule(ctx: any) {
    const sectionName = this.visit(ctx.sectionName);
    const followPath = ctx.followPath ? this.visit(ctx.followPath) : sectionName;
    const isMultiple = !!ctx.Multiple;
    const actions = ctx.action ? ctx.action.map((a: any) => this.visit(a)) : [];

    if (isMultiple) {
      return `
      if (source.${followPath} && Array.isArray(source.${followPath})) {
        target.${sectionName} = source.${followPath}.map(item => {
          const source = item;
          const target = {};
          ${actions.join('\n          ')}
          return target;
        });
      }
      `;
    } else {
      return `
      if (source.${followPath}) {
        target.${sectionName} = (function(innerSource) {
          const source = innerSource;
          const target = {};
          ${actions.join('\n          ')}
          return target;
        })(source.${followPath});
      }
      `;
    }
  }
}

export const compiler = new MorphCompiler();
