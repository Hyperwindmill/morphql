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
    this.SUBRULE1(this.anyIdentifier, { LABEL: 'sourceType' });
    this.CONSUME(t.To);
    this.CONSUME(t.Return);
    this.CONSUME1(t.As);
    this.SUBRULE2(this.anyIdentifier, { LABEL: 'targetType' });
    this.CONSUME(t.Transform);
    this.MANY(() => {
      this.SUBRULE(this.action);
    });
  });

  private anyIdentifier = this.RULE('anyIdentifier', () => {
    this.OR([{ ALT: () => this.CONSUME(t.Identifier) }, { ALT: () => this.CONSUME(t.Static) }]);
  });

  private action = this.RULE('action', () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.setRule) },
      { ALT: () => this.SUBRULE(this.sectionRule) },
    ]);
  });

  private setRule = this.RULE('setRule', () => {
    this.CONSUME(t.Set);
    this.SUBRULE(this.anyIdentifier, { LABEL: 'left' });
    this.CONSUME(t.Equals);
    this.SUBRULE1(this.anyIdentifier, { LABEL: 'right' });
  });

  private sectionRule = this.RULE('sectionRule', () => {
    this.CONSUME(t.Section);
    this.CONSUME(t.Identifier, { LABEL: 'sectionName' });
    this.CONSUME(t.LParen);
    this.MANY(() => {
      this.SUBRULE(this.action);
    });
    this.CONSUME(t.RParen);
  });
}

export const parser = new MorphParser();
