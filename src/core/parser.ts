import { CstParser } from 'chevrotain';
import * as t from './lexer.js';

export class MorphParser extends CstParser {
  constructor() {
    super(t.allTokens);
    this.performSelfAnalysis();
  }

  public query = this.RULE('query', () => {
    this.CONSUME(t.From);
    this.SUBRULE(this.typeFormat, { LABEL: 'sourceType' });
    this.CONSUME(t.To);
    this.SUBRULE1(this.typeFormat, { LABEL: 'targetType' });
    this.CONSUME(t.Transform);
    this.MANY(() => {
      this.SUBRULE(this.action);
    });
  });

  private typeFormat = this.RULE('typeFormat', () => {
    this.SUBRULE(this.anyIdentifier, { LABEL: 'name' });
    this.OPTION(() => {
      this.CONSUME(t.LParen);
      this.CONSUME(t.StringLiteral, { LABEL: 'parameter' });
      this.CONSUME(t.RParen);
    });
  });

  private anyIdentifier = this.RULE('anyIdentifier', () => {
    this.CONSUME(t.Identifier);
  });

  private literal = this.RULE('literal', () => {
    this.OR([
      { ALT: () => this.CONSUME(t.StringLiteral) },
      { ALT: () => this.CONSUME(t.NumericLiteral) },
    ]);
  });

  private action = this.RULE('action', () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.setRule) },
      { ALT: () => this.SUBRULE(this.sectionRule) },
      { ALT: () => this.SUBRULE(this.cloneRule) },
      { ALT: () => this.SUBRULE(this.deleteRule) },
      { ALT: () => this.SUBRULE(this.ifAction) },
    ]);
  });

  private deleteRule = this.RULE('deleteRule', () => {
    this.CONSUME(t.Delete);
    this.SUBRULE(this.anyIdentifier, { LABEL: 'field' });
  });

  private ifAction = this.RULE('ifAction', () => {
    this.CONSUME(t.If);
    this.CONSUME(t.LParen);
    this.SUBRULE(this.expression, { LABEL: 'condition' });
    this.CONSUME(t.RParen);
    this.CONSUME2(t.LParen); // Start 'then' block
    this.MANY(() => {
      this.SUBRULE(this.action, { LABEL: 'thenActions' });
    });
    this.CONSUME2(t.RParen); // End 'then' block
    this.OPTION(() => {
      this.CONSUME(t.Else);
      this.CONSUME3(t.LParen); // Start 'else' block
      this.MANY2(() => {
        this.SUBRULE2(this.action, { LABEL: 'elseActions' });
      });
      this.CONSUME3(t.RParen); // End 'else' block
    });
  });

  private cloneRule = this.RULE('cloneRule', () => {
    this.CONSUME(t.Clone);
    this.OPTION(() => {
      this.CONSUME(t.LParen);
      this.MANY_SEP({
        SEP: t.Comma,
        DEF: () => {
          this.SUBRULE(this.anyIdentifier, { LABEL: 'fields' });
        },
      });
      this.CONSUME(t.RParen);
    });
  });

  private setRule = this.RULE('setRule', () => {
    this.CONSUME(t.Set);
    this.SUBRULE(this.anyIdentifier, { LABEL: 'left' });
    this.CONSUME(t.Equals);
    this.SUBRULE(this.expression, { LABEL: 'right' });
  });

  private expression = this.RULE('expression', () => {
    this.SUBRULE(this.logicalOr);
  });

  private logicalOr = this.RULE('logicalOr', () => {
    this.SUBRULE(this.logicalAnd, { LABEL: 'lhs' });
    this.MANY(() => {
      this.CONSUME(t.Or);
      this.SUBRULE1(this.logicalAnd, { LABEL: 'rhs' });
    });
  });

  private logicalAnd = this.RULE('logicalAnd', () => {
    this.SUBRULE(this.comparison, { LABEL: 'lhs' });
    this.MANY(() => {
      this.CONSUME(t.And);
      this.SUBRULE1(this.comparison, { LABEL: 'rhs' });
    });
  });

  private comparison = this.RULE('comparison', () => {
    this.SUBRULE(this.addition, { LABEL: 'lhs' });
    this.OPTION(() => {
      this.OR([
        { ALT: () => this.CONSUME(t.EqualsEquals, { LABEL: 'ops' }) },
        { ALT: () => this.CONSUME(t.EqualsEqualsEquals, { LABEL: 'ops' }) },
        { ALT: () => this.CONSUME(t.NotEquals, { LABEL: 'ops' }) },
        { ALT: () => this.CONSUME(t.NotEqualsEquals, { LABEL: 'ops' }) },
        { ALT: () => this.CONSUME(t.LessThanOrEqual, { LABEL: 'ops' }) },
        { ALT: () => this.CONSUME(t.GreaterThanOrEqual, { LABEL: 'ops' }) },
        { ALT: () => this.CONSUME(t.LessThan, { LABEL: 'ops' }) },
        { ALT: () => this.CONSUME(t.GreaterThan, { LABEL: 'ops' }) },
      ]);
      this.SUBRULE1(this.addition, { LABEL: 'rhs' });
    });
  });

  private addition = this.RULE('addition', () => {
    this.SUBRULE(this.multiplication, { LABEL: 'lhs' });
    this.MANY(() => {
      this.OR([
        { ALT: () => this.CONSUME(t.Plus, { LABEL: 'ops' }) },
        { ALT: () => this.CONSUME(t.Minus, { LABEL: 'ops' }) },
      ]);
      this.SUBRULE1(this.multiplication, { LABEL: 'rhs' });
    });
  });

  private multiplication = this.RULE('multiplication', () => {
    this.SUBRULE(this.unaryExpression, { LABEL: 'lhs' });
    this.MANY(() => {
      this.OR([
        { ALT: () => this.CONSUME(t.Times, { LABEL: 'ops' }) },
        { ALT: () => this.CONSUME(t.Divide, { LABEL: 'ops' }) },
      ]);
      this.SUBRULE1(this.unaryExpression, { LABEL: 'rhs' });
    });
  });

  private unaryExpression = this.RULE('unaryExpression', () => {
    this.OPTION(() => {
      this.OR([
        { ALT: () => this.CONSUME(t.Minus, { LABEL: 'sign' }) },
        { ALT: () => this.CONSUME(t.Not, { LABEL: 'sign' }) },
      ]);
    });
    this.SUBRULE(this.atomic);
  });

  private atomic = this.RULE('atomic', () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.literal) },
      {
        GATE: () => this.LA(2).tokenType === t.LParen,
        ALT: () => this.SUBRULE(this.functionCall),
      },
      { ALT: () => this.SUBRULE(this.anyIdentifier) },
      {
        ALT: () => {
          this.CONSUME(t.LParen);
          this.SUBRULE(this.expression);
          this.CONSUME(t.RParen);
        },
      },
    ]);
  });

  private functionCall = this.RULE('functionCall', () => {
    this.OR([
      { ALT: () => this.CONSUME(t.Identifier, { LABEL: 'name' }) },
      { ALT: () => this.CONSUME(t.If, { LABEL: 'name' }) },
    ]);
    this.CONSUME(t.LParen);
    this.MANY_SEP({
      SEP: t.Comma,
      DEF: () => {
        this.SUBRULE(this.expression, { LABEL: 'args' });
      },
    });
    this.CONSUME(t.RParen);
  });

  private sectionRule = this.RULE('sectionRule', () => {
    this.CONSUME(t.Section);
    this.OPTION(() => {
      this.CONSUME(t.Multiple);
    });
    this.SUBRULE(this.anyIdentifier, { LABEL: 'sectionName' });
    this.CONSUME(t.LParen);
    this.MANY(() => {
      this.SUBRULE(this.action);
    });
    this.CONSUME(t.RParen);
    this.OPTION1(() => {
      this.CONSUME(t.From);
      this.SUBRULE1(this.anyIdentifier, { LABEL: 'followPath' });
    });
  });
}

export const parser = new MorphParser();
