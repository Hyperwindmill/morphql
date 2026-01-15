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
    const sectionName = ctx.sectionName[0].image;
    const actions = ctx.action ? ctx.action.map((a: any) => this.visit(a)) : [];

    return `
      if (source.${sectionName} && Array.isArray(source.${sectionName})) {
        target.${sectionName} = source.${sectionName}.map(item => {
          const source = item; // Shadow source for nested actions
          const target = {};
          ${actions.join('\n          ')}
          return target;
        });
      }
    `;
  }
}

export const compiler = new MorphCompiler();
