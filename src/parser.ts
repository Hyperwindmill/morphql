import { CstParser } from 'chevrotain';
import * as t from './lexer.js';

export class MorphParser extends CstParser {
  constructor() {
    super(t.allTokens);
    this.performSelfAnalysis();
  }

  public query = this.RULE('query', () => {
    this.CONSUME(t.From);
    this.SUBRULE(this.anyIdentifier, { LABEL: 'sourceName' });
    this.CONSUME(t.As);
    this.SUBRULE(this.typeFormat, { LABEL: 'sourceType' });
    this.CONSUME(t.To);
    this.CONSUME(t.Return);
    this.CONSUME1(t.As);
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
    this.OR([{ ALT: () => this.CONSUME(t.Identifier) }, { ALT: () => this.CONSUME(t.Static) }]);
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
    this.SUBRULE1(this.anyIdentifier, { LABEL: 'right' });
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
      this.CONSUME(t.Follow);
      this.SUBRULE1(this.anyIdentifier, { LABEL: 'followPath' });
    });
  });
}

export const parser = new MorphParser();
