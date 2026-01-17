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
    ]);
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
    this.SUBRULE(this.addition);
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
      this.CONSUME(t.Minus, { LABEL: 'sign' });
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
    this.CONSUME(t.Identifier, { LABEL: 'name' });
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
