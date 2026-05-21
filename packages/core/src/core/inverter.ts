import { parser } from './parser.js';
import { MorphLexer } from './lexer.js';

const BaseCstVisitor = parser.getBaseCstVisitorConstructor();

export class MorphInverter extends (BaseCstVisitor as any) {
  constructor() {
    super();
    this.validateVisitor();
  }

  query(ctx: any) {
    const sourceType = this.visit(ctx.sourceType);
    const targetType = this.visit(ctx.targetType);
    const actions = ctx.action ? ctx.action.map((a: any) => this.visit(a, '  ')) : [];

    const transformBlock = actions.length > 0
      ? `\ntransform\n  ${actions.filter(Boolean).join('\n  ')}`
      : '';

    return `from ${targetType} to ${sourceType}${transformBlock}`;
  }

  typeFormat(ctx: any, indent: string = '') {
    const name = this.visit(ctx.name, indent);
    if (ctx.params) {
      const params = ctx.params.map((p: any) => this.visit(p, indent));
      return `${name}(${params.join(', ')})`;
    }
    return name;
  }

  typeFormatParameter(ctx: any, indent: string = '') {
    if (ctx.namedParameter) {
      return this.visit(ctx.namedParameter, indent);
    }
    if (ctx.literal) {
      return this.visit(ctx.literal, indent);
    }
  }

  namedParameter(ctx: any, indent: string = '') {
    const key = this.visit(ctx.key, indent);
    const value = this.visit(ctx.value, indent);
    return `${key}=${value}`;
  }

  anyIdentifier(ctx: any, indent: string = '') {
    if (ctx.Identifier) {
      return ctx.Identifier[0].image;
    }
    if (ctx.QuotedIdentifier) {
      return ctx.QuotedIdentifier[0].image;
    }
  }

  literal(ctx: any, indent: string = '') {
    if (ctx.StringLiteral) return ctx.StringLiteral[0].image;
    if (ctx.NumericLiteral) return ctx.NumericLiteral[0].image;
    if (ctx.True) return 'true';
    if (ctx.False) return 'false';
    if (ctx.Null) return 'null';
  }

  action(ctx: any, indent: string = '') {
    if (ctx.setRule) return this.visit(ctx.setRule, indent);
    if (ctx.modifyRule) return this.visit(ctx.modifyRule, indent);
    if (ctx.sectionRule) return this.visit(ctx.sectionRule, indent);
    if (ctx.cloneRule) return this.visit(ctx.cloneRule, indent);
    if (ctx.deleteRule) return this.visit(ctx.deleteRule, indent);
    if (ctx.ifAction) return this.visit(ctx.ifAction, indent);
    if (ctx.defineRule) return this.visit(ctx.defineRule, indent);
    if (ctx.returnRule) return this.visit(ctx.returnRule, indent);
  }

  setRule(ctx: any, indent: string = '') {
    const left = this.visit(ctx.left, indent);
    const right = this.visit(ctx.right, indent);

    if (this.isSimpleIdentifier(right)) {
      // 1-to-1 direct mapping
      return `set ${right} = ${left}`;
    }

    if (this.isConstant(right)) {
      // Constant mapping - commented out
      return `// set ${left} = ${right} (Constant - skipped in inverse)`;
    }

    // Heuristics for concatenations
    if (right.includes(' + ')) {
      const parts = right.split(/\s*\+\s*/).filter((p: string) => !p.startsWith('"') && !p.startsWith("'"));
      if (parts.length > 0) {
        const splitSuggestions = parts.map((part: string, idx: number) => `//   set ${part} = split(${left}, " ")[${idx}]`).join(`\n${indent}`);
        return `// TODO (Heuristic Inversion): '${left}' is a concatenation.\n${indent}// Please refine this extraction logic:\n${indent}${splitSuggestions}`;
      }
    }

    return `// TODO: Hand-crafted inversion needed for source.${right} from target.${left}\n${indent}// set ${right} = ${left}`;
  }

  modifyRule(ctx: any, indent: string = '') {
    const left = this.visit(ctx.left, indent);
    const right = this.visit(ctx.right, indent);
    return `// TODO: Check manual inversion for target modification\n${indent}// modify ${left} = ${right}`;
  }

  deleteRule(ctx: any, indent: string = '') {
    const field = this.visit(ctx.field, indent);
    return `// TODO: '${field}' was deleted in target. Re-supply or handle manually.\n${indent}// set ${field} = ...`;
  }

  cloneRule(ctx: any, indent: string = '') {
    if (ctx.fields) {
      const fields = ctx.fields.map((f: any) => this.visit(f, indent));
      return `clone(${fields.join(', ')})`;
    }
    return 'clone()';
  }

  defineRule(ctx: any, indent: string = '') {
    const left = this.visit(ctx.left, indent);
    const right = this.visit(ctx.right, indent);
    return `// define ${left} = ${right} (Local variable - review manually)`;
  }

  returnRule(ctx: any, indent: string = '') {
    const expr = this.visit(ctx.expr, indent);
    return `return ${expr}`;
  }

  ifAction(ctx: any, indent: string = '') {
    const condition = this.visit(ctx.condition, indent);
    const childIndent = indent + '  ';
    const thenActions = ctx.thenActions 
      ? ctx.thenActions.map((a: any) => this.visit(a, childIndent)).filter(Boolean).join(`\n${childIndent}`) 
      : '';
    const elseBlock = ctx.elseActions 
      ? `\n${indent}) else (\n${childIndent}${ctx.elseActions.map((a: any) => this.visit(a, childIndent)).filter(Boolean).join(`\n${childIndent}`)}` 
      : '';

    return `if (${condition}) (\n${childIndent}${thenActions}${elseBlock}\n${indent})`;
  }

  sectionRule(ctx: any, indent: string = '') {
    const sectionName = this.visit(ctx.sectionName, indent);
    
    let followExpr = sectionName;
    if (ctx.followExpr) {
      followExpr = this.visit(ctx.followExpr, indent);
      // Remove any explicit "source." prefixes for clean inverted target naming
      if (followExpr.startsWith('source.')) {
        followExpr = followExpr.substring(7);
      }
      if (followExpr.startsWith('this.source.')) {
        followExpr = followExpr.substring(12);
      }
    }

    const isMultiple = !!ctx.Multiple;
    const childIndent = indent + '  ';
    const actions = ctx.action ? ctx.action.map((a: any) => this.visit(a, childIndent)) : [];
    
    const multipleKeyword = isMultiple ? 'multiple ' : '';
    const indentedActions = actions.filter(Boolean).join(`\n${childIndent}`);

    return `section ${multipleKeyword}${followExpr}(\n${childIndent}${indentedActions}\n${indent}) from ${sectionName}`;
  }

  expression(ctx: any, indent: string = '') {
    return this.visit(ctx.logicalOr, indent);
  }

  logicalOr(ctx: any, indent: string = '') {
    let result = this.visit(ctx.lhs, indent);
    if (ctx.rhs) {
      for (let i = 0; i < ctx.rhs.length; i++) {
        result = `${result} || ${this.visit(ctx.rhs[i], indent)}`;
      }
    }
    return result;
  }

  logicalAnd(ctx: any, indent: string = '') {
    let result = this.visit(ctx.lhs, indent);
    if (ctx.rhs) {
      for (let i = 0; i < ctx.rhs.length; i++) {
        result = `${result} && ${this.visit(ctx.rhs[i], indent)}`;
      }
    }
    return result;
  }

  comparison(ctx: any, indent: string = '') {
    let result = this.visit(ctx.lhs, indent);
    if (ctx.rhs) {
      const op = ctx.ops[0].image;
      result = `${result} ${op} ${this.visit(ctx.rhs[0], indent)}`;
    }
    return result;
  }

  addition(ctx: any, indent: string = '') {
    let result = this.visit(ctx.lhs, indent);
    if (ctx.rhs) {
      for (let i = 0; i < ctx.rhs.length; i++) {
        const op = ctx.ops[i].image;
        result = `${result} ${op} ${this.visit(ctx.rhs[i], indent)}`;
      }
    }
    return result;
  }

  multiplication(ctx: any, indent: string = '') {
    let result = this.visit(ctx.lhs, indent);
    if (ctx.rhs) {
      for (let i = 0; i < ctx.rhs.length; i++) {
        const op = ctx.ops[i].image;
        result = `${result} ${op} ${this.visit(ctx.rhs[i], indent)}`;
      }
    }
    return result;
  }

  unaryExpression(ctx: any, indent: string = '') {
    const atomic = this.visit(ctx.atomic, indent);
    if (ctx.sign) {
      const op = ctx.sign[0].image;
      return `${op}${atomic}`;
    }
    return atomic;
  }

  atomic(ctx: any, indent: string = '') {
    if (ctx.literal) return this.visit(ctx.literal, indent);
    if (ctx.anyIdentifier) return this.visit(ctx.anyIdentifier, indent);
    if (ctx.expression) return `(${this.visit(ctx.expression, indent)})`;
    if (ctx.functionCall) return this.visit(ctx.functionCall, indent);
  }

  functionCall(ctx: any, indent: string = '') {
    const name = ctx.name[0].image;
    const args = ctx.args ? ctx.args.map((a: any) => this.visit(a, indent)) : [];
    return `${name}(${args.join(', ')})`;
  }

  // --- Helper Methods ---
  private isSimpleIdentifier(val: string): boolean {
    if (!val) return false;
    const trimmed = val.trim();
    return /^[a-zA-Z_`][a-zA-Z0-9_\-`]*(\.[a-zA-Z_`][a-zA-Z0-9_\-`]*)*$/.test(trimmed) && 
      !['true', 'false', 'null'].includes(trimmed);
  }

  private isConstant(val: string): boolean {
    if (!val) return false;
    const trimmed = val.trim();
    return /^(true|false|null|['"].*['"]|\d+(\.\d+)?)$/.test(trimmed);
  }
}

export function invert(queryString: string): string {
  const lexResult = MorphLexer.tokenize(queryString);
  parser.input = lexResult.tokens;
  const cst = parser.query();

  if (parser.errors.length > 0) {
    throw new Error(`Parsing errors: ${parser.errors.map(e => e.message).join(', ')}`);
  }

  const inverter = new MorphInverter();
  return inverter.visit(cst);
}
