import { createToken, Lexer } from 'chevrotain';

export const From = createToken({ name: 'From', pattern: /from/i });
export const Static = createToken({ name: 'Static', pattern: /static/i });
export const As = createToken({ name: 'As', pattern: /as/i });
export const To = createToken({ name: 'To', pattern: /to/i });
export const Return = createToken({ name: 'Return', pattern: /return/i });
export const Transform = createToken({ name: 'Transform', pattern: /transform/i });
export const Set = createToken({ name: 'Set', pattern: /set/i });
export const Section = createToken({ name: 'Section', pattern: /section/i });
export const Multiple = createToken({ name: 'Multiple', pattern: /multiple/i });
export const Follow = createToken({ name: 'Follow', pattern: /follow/i });

export const Equals = createToken({ name: 'Equals', pattern: /=/ });
export const LParen = createToken({ name: 'LParen', pattern: /\(/ });
export const RParen = createToken({ name: 'RParen', pattern: /\)/ });

export const Identifier = createToken({
  name: 'Identifier',
  pattern: /[a-zA-Z_][a-zA-Z0-9_]*/,
});

export const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

export const allTokens = [
  WhiteSpace,
  From,
  Static,
  As,
  To,
  Return,
  Transform,
  Set,
  Section,
  Multiple,
  Follow,
  Equals,
  LParen,
  RParen,
  Identifier,
];

export const MorphLexer = new Lexer(allTokens);
