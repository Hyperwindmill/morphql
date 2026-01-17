import { createToken, Lexer } from 'chevrotain';

export const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

export const Identifier = createToken({
  name: 'Identifier',
  pattern: /[a-zA-Z_][a-zA-Z0-9_]*/,
});

export const From = createToken({ name: 'From', pattern: /from/i, longer_alt: Identifier });
export const To = createToken({ name: 'To', pattern: /to/i, longer_alt: Identifier });
export const Transform = createToken({
  name: 'Transform',
  pattern: /transform/i,
  longer_alt: Identifier,
});
export const Set = createToken({ name: 'Set', pattern: /set/i, longer_alt: Identifier });
export const Section = createToken({
  name: 'Section',
  pattern: /section/i,
  longer_alt: Identifier,
});
export const Multiple = createToken({
  name: 'Multiple',
  pattern: /multiple/i,
  longer_alt: Identifier,
});
export const Clone = createToken({ name: 'Clone', pattern: /clone/i, longer_alt: Identifier });

export const Equals = createToken({ name: 'Equals', pattern: /=/ });
export const Plus = createToken({ name: 'Plus', pattern: /\+/ });
export const Minus = createToken({ name: 'Minus', pattern: /-/ });
export const Times = createToken({ name: 'Times', pattern: /\*/ });
export const Divide = createToken({ name: 'Divide', pattern: /\// });
export const LParen = createToken({ name: 'LParen', pattern: /\(/ });
export const RParen = createToken({ name: 'RParen', pattern: /\)/ });
export const Comma = createToken({ name: 'Comma', pattern: /,/ });

export const StringLiteral = createToken({
  name: 'StringLiteral',
  pattern: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/,
});

export const NumericLiteral = createToken({
  name: 'NumericLiteral',
  pattern: /-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/,
});

export const allTokens = [
  WhiteSpace,
  From,
  To,
  Transform,
  Set,
  Section,
  Multiple,
  Clone,
  Equals,
  Plus,
  Minus,
  Times,
  Divide,
  LParen,
  RParen,
  Comma,
  StringLiteral,
  NumericLiteral,
  Identifier,
];

export const MorphLexer = new Lexer(allTokens);
