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
    const actions = ctx.action ? ctx.action.map((a: any) => this.visit(a)) : [];

    const transformBlock = actions.length > 0
      ? `\ntransform\n  ${actions.filter(Boolean).join('\n  ')}`
      : '';

    return `from ${targetType} to ${sourceType}${transformBlock}`;
  }

  typeFormat(ctx: any) {
    const name = this.visit(ctx.name);
    if (ctx.params) {
      const params = ctx.params.map((p: any) => this.visit(p));
      return `${name}(${params.join(', ')})`;
    }
    return name;
  }

  typeFormatParameter(ctx: any) {
    if (ctx.namedParameter) {
      return this.visit(ctx.namedParameter);
    }
    if (ctx.literal) {
      return this.visit(ctx.literal);
    }
  }

  namedParameter(ctx: any) {
    const key = this.visit(ctx.key);
    const value = this.visit(ctx.value);
    return `${key}=${value}`;
  }

  anyIdentifier(ctx: any) {
    if (ctx.Identifier) {
      return ctx.Identifier[0].image;
    }
    if (ctx.QuotedIdentifier) {
      return ctx.QuotedIdentifier[0].image;
    }
  }

  literal(ctx: any) {
    if (ctx.StringLiteral) return ctx.StringLiteral[0].image;
    if (ctx.NumericLiteral) return ctx.NumericLiteral[0].image;
    if (ctx.True) return 'true';
    if (ctx.False) return 'false';
    if (ctx.Null) return 'null';
  }

  action(ctx: any) {
    if (ctx.setRule) return this.visit(ctx.setRule);
    if (ctx.modifyRule) return this.visit(ctx.modifyRule);
    if (ctx.sectionRule) return this.visit(ctx.sectionRule);
    if (ctx.cloneRule) return this.visit(ctx.cloneRule);
    if (ctx.deleteRule) return this.visit(ctx.deleteRule);
    if (ctx.ifAction) return this.visit(ctx.ifAction);
    if (ctx.defineRule) return this.visit(ctx.defineRule);
    if (ctx.returnRule) return this.visit(ctx.returnRule);
  }

  setRule(ctx: any) {
    const left = this.visit(ctx.left);
    const right = this.visit(ctx.right);

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
        const splitSuggestions = parts.map((part: string, idx: number) => `//   set ${part} = split(${left}, " ")[${idx}]`).join('\n  ');
        return `// TODO (Heuristic Inversion): '${left}' is a concatenation.\n  // Please refine this extraction logic:\n  ${splitSuggestions}`;
      }
    }

    return `// TODO: Hand-crafted inversion needed for source.${right} from target.${left}\n  // set ${right} = ${left}`;
  }

  modifyRule(ctx: any) {
    const left = this.visit(ctx.left);
    const right = this.visit(ctx.right);
    return `// TODO: Check manual inversion for target modification\n  // modify ${left} = ${right}`;
  }

  deleteRule(ctx: any) {
    const field = this.visit(ctx.field);
    return `// TODO: '${field}' was deleted in target. Re-supply or handle manually.\n  // set ${field} = ...`;
  }

  cloneRule(ctx: any) {
    if (ctx.fields) {
      const fields = ctx.fields.map((f: any) => this.visit(f));
      return `clone(${fields.join(', ')})`;
    }
    return 'clone()';
  }

  defineRule(ctx: any) {
    const left = this.visit(ctx.left);
    const right = this.visit(ctx.right);
    return `// define ${left} = ${right} (Local variable - review manually)`;
  }

  returnRule(ctx: any) {
    const expr = this.visit(ctx.expr);
    return `return ${expr}`;
  }

  ifAction(ctx: any) {
    const condition = this.visit(ctx.condition);
    const thenActions = ctx.thenActions ? ctx.thenActions.map((a: any) => this.visit(a)).filter(Boolean).join('\n    ') : '';
    const elseBlock = ctx.elseActions 
      ? `\n  ) else (\n    ${ctx.elseActions.map((a: any) => this.visit(a)).filter(Boolean).join('\n    ')}` 
      : '';

    return `if (${condition}) (\n    ${thenActions}${elseBlock}\n  )`;
  }

  sectionRule(ctx: any) {
    const sectionName = this.visit(ctx.sectionName);
    
    let followExpr = sectionName;
    if (ctx.followExpr) {
      followExpr = this.visit(ctx.followExpr);
      // Remove any explicit "source." prefixes for clean inverted target naming
      if (followExpr.startsWith('source.')) {
        followExpr = followExpr.substring(7);
      }
      if (followExpr.startsWith('this.source.')) {
        followExpr = followExpr.substring(12);
      }
    }

    const isMultiple = !!ctx.Multiple;
    const actions = ctx.action ? ctx.action.map((a: any) => this.visit(a)) : [];
    
    const multipleKeyword = isMultiple ? 'multiple ' : '';
    const indentedActions = actions.filter(Boolean).join('\n    ').replace(/\n/g, '\n  ');

    return `section ${multipleKeyword}${followExpr}(\n    ${indentedActions}\n  ) from ${sectionName}`;
  }

  expression(ctx: any) {
    return this.visit(ctx.logicalOr);
  }

  logicalOr(ctx: any) {
    let result = this.visit(ctx.lhs);
    if (ctx.rhs) {
      for (let i = 0; i < ctx.rhs.length; i++) {
        result = `${result} || ${this.visit(ctx.rhs[i])}`;
      }
    }
    return result;
  }

  logicalAnd(ctx: any) {
    let result = this.visit(ctx.lhs);
    if (ctx.rhs) {
      for (let i = 0; i < ctx.rhs.length; i++) {
        result = `${result} && ${this.visit(ctx.rhs[i])}`;
      }
    }
    return result;
  }

  comparison(ctx: any) {
    let result = this.visit(ctx.lhs);
    if (ctx.rhs) {
      const op = ctx.ops[0].image;
      result = `${result} ${op} ${this.visit(ctx.rhs[0])}`;
    }
    return result;
  }

  addition(ctx: any) {
    let result = this.visit(ctx.lhs);
    if (ctx.rhs) {
      for (let i = 0; i < ctx.rhs.length; i++) {
        const op = ctx.ops[i].image;
        result = `${result} ${op} ${this.visit(ctx.rhs[i])}`;
      }
    }
    return result;
  }

  multiplication(ctx: any) {
    let result = this.visit(ctx.lhs);
    if (ctx.rhs) {
      for (let i = 0; i < ctx.rhs.length; i++) {
        const op = ctx.ops[i].image;
        result = `${result} ${op} ${this.visit(ctx.rhs[i])}`;
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
    if (ctx.literal) return this.visit(ctx.literal);
    if (ctx.anyIdentifier) return this.visit(ctx.anyIdentifier);
    if (ctx.expression) return `(${this.visit(ctx.expression)})`;
    if (ctx.functionCall) return this.visit(ctx.functionCall);
  }

  functionCall(ctx: any) {
    const name = ctx.name[0].image;
    const args = ctx.args ? ctx.args.map((a: any) => this.visit(a)) : [];
    return `${name}(${args.join(', ')})`;
  }

  // --- Helper Methods ---
  private isSimpleIdentifier(val: string): boolean {
    if (!val) return false;
    const trimmed = val.trim();
    // A simple identifier is a word, optionally with dots (like source.name) or backticks, with no spaces/operators/quotes
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
