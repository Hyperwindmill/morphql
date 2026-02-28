/**
 * CST → AST visitor.
 *
 * Walks the Chevrotain CST produced by MorphParser and emits a simplified,
 * JSON-serializable AST (ParsedQuery).  No compilation to JavaScript occurs.
 *
 * Expression nodes are reconstructed as raw MorphQL source strings
 */
import { parser } from './parser.js';
import type {
  ParsedQuery,
  ParsedAction,
  ParsedSetAction,
  ParsedModifyAction,
  ParsedDeleteAction,
  ParsedDefineAction,
  ParsedCloneAction,
  ParsedSectionAction,
  ParsedIfAction,
  ParsedReturnAction,
} from './parse-types.js';

const BaseCstVisitor = parser.getBaseCstVisitorConstructor();

interface IdentifierResult {
  /** Unescaped name, without backticks */
  name: string;
  quoted: boolean;
  /** Original token image (with backticks for quoted identifiers) */
  raw: string;
}

export class ASTVisitor extends (BaseCstVisitor as any) {
  constructor() {
    super();
    this.validateVisitor();
  }

  // ─── Top-level ────────────────────────────────────────────────────────────

  query(ctx: any): ParsedQuery {
    const from: string = this.visit(ctx.sourceType);
    const to: string = this.visit(ctx.targetType);
    const unsafe = !!ctx.Unsafe;
    const actions: ParsedAction[] = ctx.action
      ? ctx.action.map((a: any) => this.visit(a))
      : [];

    const result: ParsedQuery = { from, to, actions };
    if (unsafe) result.unsafe = true;
    return result;
  }

  // ─── Format type ──────────────────────────────────────────────────────────

  typeFormat(ctx: any): string {
    const id: IdentifierResult = this.visit(ctx.name);
    return id.name;
  }

  // Required by validateVisitor() even though we skip params in typeFormat
  typeFormatParameter(_ctx: any): void {
    return;
  }

  namedParameter(_ctx: any): void {
    return;
  }

  // ─── Identifier ───────────────────────────────────────────────────────────

  anyIdentifier(ctx: any): IdentifierResult {
    if (ctx.Identifier) {
      const image: string = ctx.Identifier[0].image;
      return { name: image, quoted: false, raw: image };
    }
    // QuotedIdentifier: `field-name`
    const raw: string = ctx.QuotedIdentifier[0].image; // includes backticks
    const name = raw.slice(1, -1).replace(/\\(.)/g, '$1');
    return { name, quoted: true, raw };
  }

  // ─── Literal ──────────────────────────────────────────────────────────────

  literal(ctx: any): string {
    if (ctx.StringLiteral) return ctx.StringLiteral[0].image;
    if (ctx.NumericLiteral) return ctx.NumericLiteral[0].image;
    if (ctx.True) return 'true';
    if (ctx.False) return 'false';
    if (ctx.Null) return 'null';
    return '';
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  action(ctx: any): ParsedAction {
    if (ctx.setRule) return this.visit(ctx.setRule);
    if (ctx.modifyRule) return this.visit(ctx.modifyRule);
    if (ctx.sectionRule) return this.visit(ctx.sectionRule);
    if (ctx.cloneRule) return this.visit(ctx.cloneRule);
    if (ctx.ifAction) return this.visit(ctx.ifAction);
    if (ctx.deleteRule) return this.visit(ctx.deleteRule);
    if (ctx.defineRule) return this.visit(ctx.defineRule);
    if (ctx.returnRule) return this.visit(ctx.returnRule);
    throw new Error('Unknown action type in CST');
  }

  setRule(ctx: any): ParsedSetAction {
    const left: IdentifierResult = this.visit(ctx.left);
    const expression: string = this.visit(ctx.right);
    return { type: 'set', target: left.name, expression };
  }

  modifyRule(ctx: any): ParsedModifyAction {
    const left: IdentifierResult = this.visit(ctx.left);
    const expression: string = this.visit(ctx.right);
    return { type: 'modify', target: left.name, expression };
  }

  deleteRule(ctx: any): ParsedDeleteAction {
    const field: IdentifierResult = this.visit(ctx.field);
    return { type: 'delete', field: field.name };
  }

  defineRule(ctx: any): ParsedDefineAction {
    const left: IdentifierResult = this.visit(ctx.left);
    const expression: string = this.visit(ctx.right);
    return { type: 'define', variable: left.name, expression };
  }

  cloneRule(ctx: any): ParsedCloneAction {
    if (ctx.fields && ctx.fields.length > 0) {
      const fields: string[] = ctx.fields.map((f: any) => {
        const id: IdentifierResult = this.visit(f);
        return id.name;
      });
      return { type: 'clone', fields };
    }
    return { type: 'clone' };
  }

  returnRule(ctx: any): ParsedReturnAction {
    const expression: string = this.visit(ctx.expr);
    return { type: 'return', expression };
  }

  ifAction(ctx: any): ParsedIfAction {
    const condition: string = this.visit(ctx.condition);
    const thenActions: ParsedAction[] = ctx.thenActions
      ? ctx.thenActions.map((a: any) => this.visit(a))
      : [];
    const elseActions: ParsedAction[] | undefined =
      ctx.elseActions && ctx.elseActions.length > 0
        ? ctx.elseActions.map((a: any) => this.visit(a))
        : undefined;

    const result: ParsedIfAction = { type: 'if', condition, thenActions };
    if (elseActions !== undefined) result.elseActions = elseActions;
    return result;
  }

  sectionRule(ctx: any): ParsedSectionAction {
    const sectionId: IdentifierResult = this.visit(ctx.sectionName);
    const name = sectionId.name;
    const multiple = !!ctx.Multiple;
    const isSubquery = !!ctx.subqueryFrom;

    const actions: ParsedAction[] = ctx.action
      ? ctx.action.map((a: any) => this.visit(a))
      : [];

    // "from expr" clause after the closing paren
    const from: string | undefined = ctx.followExpr
      ? this.visit(ctx.followExpr)
      : undefined;

    // "where expr" clause
    const where: string | undefined = ctx.whereExpr
      ? this.visit(ctx.whereExpr)
      : undefined;

    const result: ParsedSectionAction = { type: 'section', name, actions };
    if (multiple) result.multiple = true;
    if (from !== undefined) result.from = from;
    if (where !== undefined) result.where = where;

    if (isSubquery) {
      result.isSubquery = true;
      result.sourceFormat = this.visit(ctx.subquerySourceType);
      result.targetFormat = this.visit(ctx.subqueryTargetType);
    }

    return result;
  }

  // ─── Expression reconstruction ────────────────────────────────────────────
  // Each method returns the raw MorphQL source text of the sub-expression.

  expression(ctx: any): string {
    return this.visit(ctx.logicalOr);
  }

  logicalOr(ctx: any): string {
    let result: string = this.visit(ctx.lhs);
    if (ctx.rhs && ctx.rhs.length > 0) {
      for (let i = 0; i < ctx.rhs.length; i++) {
        result += ` || ${this.visit(ctx.rhs[i])}`;
      }
    }
    return result;
  }

  logicalAnd(ctx: any): string {
    let result: string = this.visit(ctx.lhs);
    if (ctx.rhs && ctx.rhs.length > 0) {
      for (let i = 0; i < ctx.rhs.length; i++) {
        result += ` && ${this.visit(ctx.rhs[i])}`;
      }
    }
    return result;
  }

  comparison(ctx: any): string {
    let result: string = this.visit(ctx.lhs);
    if (ctx.rhs && ctx.rhs.length > 0) {
      const op: string = ctx.ops[0].image;
      result += ` ${op} ${this.visit(ctx.rhs[0])}`;
    }
    return result;
  }

  addition(ctx: any): string {
    let result: string = this.visit(ctx.lhs);
    if (ctx.rhs && ctx.rhs.length > 0) {
      for (let i = 0; i < ctx.rhs.length; i++) {
        const op: string = ctx.ops[i].image;
        result += ` ${op} ${this.visit(ctx.rhs[i])}`;
      }
    }
    return result;
  }

  multiplication(ctx: any): string {
    let result: string = this.visit(ctx.lhs);
    if (ctx.rhs && ctx.rhs.length > 0) {
      for (let i = 0; i < ctx.rhs.length; i++) {
        const op: string = ctx.ops[i].image;
        result += ` ${op} ${this.visit(ctx.rhs[i])}`;
      }
    }
    return result;
  }

  unaryExpression(ctx: any): string {
    const atomic: string = this.visit(ctx.atomic);
    if (ctx.sign && ctx.sign.length > 0) {
      return `${ctx.sign[0].image}${atomic}`;
    }
    return atomic;
  }

  atomic(ctx: any): string {
    if (ctx.literal) return this.visit(ctx.literal);
    if (ctx.functionCall) return this.visit(ctx.functionCall);
    if (ctx.anyIdentifier) {
      const id: IdentifierResult = this.visit(ctx.anyIdentifier);
      // Preserve backtick quoting in expression strings
      return id.raw;
    }
    if (ctx.expression) return `(${this.visit(ctx.expression)})`;
    return '';
  }

  functionCall(ctx: any): string {
    const name: string = ctx.name[0].image;
    const args: string[] = ctx.args ? ctx.args.map((a: any) => this.visit(a)) : [];
    return `${name}(${args.join(', ')})`;
  }
}

export const astVisitor = new ASTVisitor();
