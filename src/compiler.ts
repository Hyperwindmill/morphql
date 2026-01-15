import { parser } from './parser.js';

const BaseCstVisitor = parser.getBaseCstVisitorConstructor();

export class MorphCompiler extends (BaseCstVisitor as any) {
  constructor() {
    super();
    this.validateVisitor();
  }

  query(ctx: any) {
    const actions = ctx.action ? ctx.action.map((a: any) => this.visit(a)) : [];

    // We wrap everything in a function
    return `
      return function transform(source) {
        const target = {};
        ${actions.join('\n        ')}
        return target;
      }
    `;
  }

  anyIdentifier(ctx: any) {
    if (ctx.Identifier) {
      return ctx.Identifier[0].image;
    }
    if (ctx.Static) {
      return ctx.Static[0].image;
    }
  }

  action(ctx: any) {
    if (ctx.setRule) {
      return this.visit(ctx.setRule);
    }
    if (ctx.sectionRule) {
      return this.visit(ctx.sectionRule);
    }
  }

  setRule(ctx: any) {
    const left = this.visit(ctx.left);
    const right = this.visit(ctx.right);
    // set [left]=[right] means target.[right] = source.[left]
    return `target.${right} = source.${left};`;
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
