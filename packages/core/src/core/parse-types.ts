/**
 * AST types returned by the parse() function.
 * These are plain JSON-serializable objects — no class instances, no functions.
 */

export interface ParsedQuery {
  /** Source format name, e.g. "json", "xml", "csv", "edifact", "object" */
  from: string;
  /** Target format name */
  to: string;
  /** true when "transform unsafe" is used */
  unsafe?: boolean;
  /** Top-level actions from the transform block (empty array when no transform) */
  actions: ParsedAction[];
}

export type ParsedAction =
  | ParsedSetAction
  | ParsedModifyAction
  | ParsedDeleteAction
  | ParsedDefineAction
  | ParsedCloneAction
  | ParsedSectionAction
  | ParsedIfAction
  | ParsedReturnAction;

/** set target = expression */
export interface ParsedSetAction {
  type: 'set';
  target: string;
  expression: string;
}

/** modify target = expression  (reads from target context) */
export interface ParsedModifyAction {
  type: 'modify';
  target: string;
  expression: string;
}

/** delete field */
export interface ParsedDeleteAction {
  type: 'delete';
  field: string;
}

/** define variable = expression */
export interface ParsedDefineAction {
  type: 'define';
  variable: string;
  expression: string;
}

/** clone  /  clone(field1, field2, ...) */
export interface ParsedCloneAction {
  type: 'clone';
  /** Present only for selective clone; absent (or undefined) for full clone */
  fields?: string[];
}

/** return expression */
export interface ParsedReturnAction {
  type: 'return';
  expression: string;
}

/**
 * section [multiple] name( actions ) [from expr] [where condition]
 *
 * When isSubquery is true, the section body starts with "from X to Y [transform]"
 * and sourceFormat / targetFormat carry the inner format names.
 */
export interface ParsedSectionAction {
  type: 'section';
  name: string;
  /** true when the "multiple" keyword is present */
  multiple?: boolean;
  /** Raw source expression after "from" keyword outside the block, e.g. "source.items" */
  from?: string;
  /** Raw condition expression after "where" keyword, e.g. "active == true" */
  where?: string;
  /** Nested actions (inside the section body) */
  actions: ParsedAction[];
  /** true when the section body starts with "from X to Y" (subquery section) */
  isSubquery?: boolean;
  /** Source format name for subquery sections */
  sourceFormat?: string;
  /** Target format name for subquery sections */
  targetFormat?: string;
}

/** if (condition) ( thenActions ) [else ( elseActions )] */
export interface ParsedIfAction {
  type: 'if';
  /** Raw condition expression, e.g. "age >= 18" */
  condition: string;
  thenActions: ParsedAction[];
  elseActions?: ParsedAction[];
}
