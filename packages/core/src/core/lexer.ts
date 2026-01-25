import { createToken, Lexer } from 'chevrotain';

export const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

// Comments
export const LineComment = createToken({
  name: 'LineComment',
  pattern: /\/\/[^\n\r]*/,
  group: Lexer.SKIPPED,
});

export const BlockComment = createToken({
  name: 'BlockComment',
  pattern: /\/\*[\s\S]*?\*\//,
  group: Lexer.SKIPPED,
});

export const Identifier = createToken({
  name: 'Identifier',
  pattern: /[a-zA-Z_$][a-zA-Z0-9_.\[\]]*/,
});

export const QuotedIdentifier = createToken({
  name: 'QuotedIdentifier',
  pattern: /`([^`\\]|\\.)*`/,
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
export const Delete = createToken({ name: 'Delete', pattern: /delete/i, longer_alt: Identifier });
export const Define = createToken({ name: 'Define', pattern: /define/i, longer_alt: Identifier });
export const Modify = createToken({ name: 'Modify', pattern: /modify/i, longer_alt: Identifier });
export const If = createToken({ name: 'If', pattern: /if/i, longer_alt: Identifier });
export const Else = createToken({ name: 'Else', pattern: /else/i, longer_alt: Identifier });
export const True = createToken({ name: 'True', pattern: /true/i, longer_alt: Identifier });
export const False = createToken({ name: 'False', pattern: /false/i, longer_alt: Identifier });
export const Null = createToken({ name: 'Null', pattern: /null/i, longer_alt: Identifier });

// Comparison operators (must come before single-char operators)
export const EqualsEquals = createToken({ name: 'EqualsEquals', pattern: /==/ });
export const EqualsEqualsEquals = createToken({ name: 'EqualsEqualsEquals', pattern: /===/ });
export const NotEquals = createToken({ name: 'NotEquals', pattern: /!=/ });
export const NotEqualsEquals = createToken({ name: 'NotEqualsEquals', pattern: /!==/ });
export const LessThanOrEqual = createToken({ name: 'LessThanOrEqual', pattern: /<=/ });
export const GreaterThanOrEqual = createToken({ name: 'GreaterThanOrEqual', pattern: />=/ });
export const LessThan = createToken({ name: 'LessThan', pattern: /</ });
export const GreaterThan = createToken({ name: 'GreaterThan', pattern: />/ });

// Logical operators
export const And = createToken({ name: 'And', pattern: /&&/ });
export const Or = createToken({ name: 'Or', pattern: /\|\|/ });
export const Not = createToken({ name: 'Not', pattern: /!/ });

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
  LineComment,
  BlockComment,
  From,
  To,
  Transform,
  Set,
  Section,
  Multiple,
  Clone,
  Delete,
  Define,
  Modify,
  If,
  Else,
  True,
  False,
  Null,

  // Multi-character operators
  EqualsEqualsEquals,
  EqualsEquals,
  NotEqualsEquals,
  NotEquals,
  LessThanOrEqual,
  GreaterThanOrEqual,
  And,
  Or,
  // Single-character operators
  Equals,
  LessThan,
  GreaterThan,
  Not,
  Plus,
  Minus,
  Times,
  Divide,
  LParen,
  RParen,
  Comma,
  StringLiteral,
  NumericLiteral,
  QuotedIdentifier,
  Identifier,
];

export const MorphLexer = new Lexer(allTokens);
