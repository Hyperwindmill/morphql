import { parser } from './parser.js';
import { functionRegistry } from './functions.js';
import { MappingTracker, MorphType } from './mapping-tracker.js';

const BaseCstVisitor = parser.getBaseCstVisitorConstructor();

export class MorphCompiler extends (BaseCstVisitor as any) {
  // Context for modify directive - determines whether to read from 'source' or 'target'
  private readFrom: 'source' | 'target' = 'source';

  // Scope stack to track serialization context
  private scopeStack: Array<{ format: string; options: any; isSerializationScope: boolean }> = [];

  // Safe mode - use optional chaining for property access
  public safeMode: boolean = true;

  // Analysis mode
  public isAnalyzing: boolean = false;
  public tracker: MappingTracker = new MappingTracker();
  public lastInferredType: MorphType = 'any';

  constructor() {
    super();
    this.validateVisitor();
  }

  /**
   * Resets the compiler state for a new compilation run.
   */
  private reset() {
    this.readFrom = 'source';
    this.scopeStack = [];
    this.tracker = new MappingTracker();
    this.lastInferredType = 'any';
    // safeMode and isAnalyzing are set by the caller or by query parser
  }

  /**
   * Visit with a temporary context change
   */
  private visitWithContext(node: any, context: { readFrom: 'source' | 'target' }) {
    const previousReadFrom = this.readFrom;
    this.readFrom = context.readFrom;
    try {
      return this.visit(node);
    } finally {
      this.readFrom = previousReadFrom;
    }
  }

  query(ctx: any) {
    this.reset();
    if (this.isAnalyzing) {
      this.tracker = new MappingTracker();
    }
    const sourceType = this.visit(ctx.sourceType);
    const targetType = this.visit(ctx.targetType);

    // Check if unsafe mode is enabled in the query
    const isUnsafe = !!ctx.Unsafe;
    this.safeMode = !isUnsafe;

    this.scopeStack.push({
      format: targetType.name,
      options: targetType.options,
      isSerializationScope: true,
    });

    try {
      const actions = ctx.action ? ctx.action.map((a: any) => this.visit(a)) : [];

      if (!ctx.Transform) {
        actions.push('Object.assign(target, source);');
      }

      // Helper to serialize types for generated code
      const sourceTypeName = sourceType.name;
      const targetTypeName = targetType.name;

      const sourceOptions = JSON.stringify(sourceType.options);
      const targetOptions = JSON.stringify(targetType.options);

      // Check if any action contains a return statement
      const hasReturn = actions.some(
        (action: any) => typeof action === 'string' && action.trim().startsWith('return ')
      );

      const code = `
      return function(input, env) {
        // 1. Parse Input
        const _safeSource = (v) => (typeof v === 'object' && v !== null) ? (Array.isArray(v) ? [...v] : { ...v }) : (v || {});
        const _parsedSource = env.parse('${sourceTypeName}', input, ${sourceOptions});
        const source = _safeSource(_parsedSource);
        const _rootSource = source;
        
        // 2. Transform
        const target = {};
        const _rootTarget = target;
        ${actions.join('\n        ')}

        // 3. Serialize Output
        ${hasReturn ? '' : `return env.serialize('${targetTypeName}', target, ${targetOptions});`}
      }
    `;

      return {
        code,
        sourceType,
        targetType,
        analysis: this.isAnalyzing ? this.tracker.getResult() : undefined,
      };
    } finally {
      this.scopeStack.pop();
    }
  }

  typeFormat(ctx: any) {
    const id = this.visit(ctx.name);
    const options: any = { params: [] };
    if (ctx.params) {
      ctx.params.forEach((p: any) => {
        const val = this.visit(p);
        if (typeof val === 'object' && 'key' in val) {
          options[val.key] = this.parseLiteral(val.value);
        } else {
          // Positional parameter - collect into params array
          options.params.push(this.parseLiteral(val));
        }
      });
    }
    return { name: id.name, options };
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
    const key = this.visit(ctx.key).name;
    const value = this.visit(ctx.value);
    return { key, value };
  }

  private parseLiteral(image: string) {
    if (image === 'true') return true;
    if (image === 'false') return false;
    if (image === 'null') return null;
    if (
      (image.startsWith('"') && image.endsWith('"')) ||
      (image.startsWith("'") && image.endsWith("'"))
    ) {
      return image.slice(1, -1);
    }
    const num = Number(image);
    if (!isNaN(num)) {
      return num;
    }
    return image;
  }

  private isSimplePath(path: string): boolean {
    if (!path) return false;
    // Simple path should not contain function calls, operators or spaces
    return !/[()+*/-]/.test(path) && !path.includes(' ');
  }

  private safify(path: string): string {
    if (!this.safeMode) return path;
    // Replace . with ?. and [ with ?.[, but avoid double ?? or ?.[ if they were somehow already there
    return path.replace(/\.(?!\?)/g, '?.').replace(/\[/g, '?.[');
  }

  private genAccess(base: string, id: { name: string; quoted: boolean }, isLHS: boolean = false) {
    // Don't use optional chaining on left-hand side of assignments
    if (!this.safeMode || isLHS) {
      if (
        id.quoted ||
        (id.name.includes('-') && !id.name.includes('.') && !id.name.includes('['))
      ) {
        return `${base}["${id.name}"]`;
      }
      return `${base}.${id.name}`;
    }

    // Safe Mode + RHS
    if (id.quoted) {
      return `${base}?.[${JSON.stringify(id.name)}]`;
    }

    const path = this.safify(id.name);
    return `${base}?.${path}`;
  }

  anyIdentifier(ctx: any) {
    if (ctx.Identifier) {
      return { name: ctx.Identifier[0].image, quoted: false };
    }
    if (ctx.QuotedIdentifier) {
      // Remove backticks and unescape
      const name = ctx.QuotedIdentifier[0].image.slice(1, -1).replace(/\\(.)/g, '$1');
      return { name, quoted: true };
    }
  }

  literal(ctx: any) {
    if (ctx.StringLiteral) {
      this.lastInferredType = 'string';
      return ctx.StringLiteral[0].image;
    }
    if (ctx.NumericLiteral) {
      this.lastInferredType = 'number';
      return ctx.NumericLiteral[0].image;
    }
    if (ctx.True) {
      this.lastInferredType = 'boolean';
      return 'true';
    }
    if (ctx.False) {
      this.lastInferredType = 'boolean';
      return 'false';
    }
    if (ctx.Null) {
      this.lastInferredType = 'null';
      return 'null';
    }
  }

  action(ctx: any) {
    if (ctx.setRule) {
      return this.visit(ctx.setRule);
    }
    if (ctx.modifyRule) {
      return this.visit(ctx.modifyRule);
    }
    if (ctx.sectionRule) {
      return this.visit(ctx.sectionRule);
    }
    if (ctx.cloneRule) {
      return this.visit(ctx.cloneRule);
    }
    if (ctx.ifAction) {
      return this.visit(ctx.ifAction);
    }
    if (ctx.deleteRule) {
      return this.visit(ctx.deleteRule);
    }
    if (ctx.defineRule) {
      return this.visit(ctx.defineRule);
    }
    if (ctx.returnRule) {
      return this.visit(ctx.returnRule);
    }
  }

  deleteRule(ctx: any) {
    const field = this.visit(ctx.field);
    if (this.isAnalyzing) {
      this.tracker.recordDelete(field.name);
    }
    return `delete ${this.genAccess('target', field, true)};`; // LHS = true
  }

  ifAction(ctx: any) {
    const condition = this.visit(ctx.condition);
    const thenActions = ctx.thenActions
      ? ctx.thenActions.map((a: any) => this.visit(a)).join('\n')
      : '';
    const elseBlock = ctx.elseActions
      ? `else { ${ctx.elseActions.map((a: any) => this.visit(a)).join('\n')} }`
      : '';

    return `if (${condition}) {
       ${thenActions}
     } ${elseBlock}`;
  }

  cloneRule(ctx: any) {
    if (ctx.fields) {
      const identifiers = ctx.fields.map((f: any) => this.visit(f));
      if (this.isAnalyzing) {
        this.tracker.recordClone(identifiers.map((id: any) => id.name));
      }
      return identifiers
        .map(
          (id: any) => `${this.genAccess('target', id, true)} = ${this.genAccess('source', id)};`
        ) // LHS = true for target
        .join('\n        ');
    }
    if (this.isAnalyzing) {
      this.tracker.recordClone();
    }
    return `Object.assign(target, source);`;
  }

  setRule(ctx: any) {
    const left = this.visit(ctx.left);
    this.lastInferredType = 'any';
    const right = this.visit(ctx.right);
    if (this.isAnalyzing) {
      this.tracker.recordAssignment(left.name, this.lastInferredType);
    }
    return `${this.genAccess('target', left, true)} = ${right};`;
  }

  modifyRule(ctx: any) {
    const left = this.visit(ctx.left);
    this.lastInferredType = 'any';
    const right = this.visitWithContext(ctx.right, { readFrom: 'target' });
    if (this.isAnalyzing) {
      this.tracker.recordAssignment(left.name, this.lastInferredType);
    }
    return `${this.genAccess('target', left, true)} = ${right};`; // LHS = true
  }

  defineRule(ctx: any) {
    const left = this.visit(ctx.left);
    this.lastInferredType = 'any';
    const right = this.visit(ctx.right);
    if (this.isAnalyzing) {
      this.tracker.recordAssignment(left.name, this.lastInferredType); // This tracks internal assignments? Actually define is for source.
    }
    return `${this.genAccess('source', left, true)} = ${right};`; // LHS = true
  }

  returnRule(ctx: any) {
    const expr = this.visitWithContext(ctx.expr, { readFrom: 'target' });
    const scope = this.scopeStack[this.scopeStack.length - 1];

    if (scope && scope.isSerializationScope) {
      const options = JSON.stringify(scope.options);
      return `return env.serialize('${scope.format}', ${expr}, ${options});`;
    }

    return `return ${expr};`;
  }

  expression(ctx: any) {
    return this.visit(ctx.logicalOr);
  }

  logicalOr(ctx: any) {
    let result = this.visit(ctx.lhs);
    if (ctx.rhs && ctx.rhs.length > 0) {
      this.lastInferredType = 'boolean';
      for (let i = 0; i < ctx.rhs.length; i++) {
        const rhs = this.visit(ctx.rhs[i]);
        result = `${result} || ${rhs}`;
      }
    }
    return result;
  }

  logicalAnd(ctx: any) {
    let result = this.visit(ctx.lhs);
    if (ctx.rhs && ctx.rhs.length > 0) {
      this.lastInferredType = 'boolean';
      for (let i = 0; i < ctx.rhs.length; i++) {
        const rhs = this.visit(ctx.rhs[i]);
        result = `${result} && ${rhs}`;
      }
    }
    return result;
  }

  comparison(ctx: any) {
    let result = this.visit(ctx.lhs);
    if (ctx.rhs) {
      this.lastInferredType = 'boolean';
      const op = ctx.ops[0].image;
      const rhs = this.visit(ctx.rhs[0]);
      result = `${result} ${op} ${rhs}`;
    }
    return result;
  }

  addition(ctx: any) {
    const lhs = this.visit(ctx.lhs);
    const lhsType = this.lastInferredType;
    let result = lhs;
    if (ctx.rhs && ctx.rhs.length > 0) {
      // If any operand is a string, the result is likely a string (concatenation)
      let hasString = lhsType === 'string';
      let allNumbers = lhsType === 'number';
      for (let i = 0; i < ctx.rhs.length; i++) {
        const op = ctx.ops[i].image;
        const rhs = this.visit(ctx.rhs[i]);
        if (this.lastInferredType === 'string') hasString = true;
        if (this.lastInferredType !== 'number') allNumbers = false;
        result = `${result} ${op} ${rhs}`;
      }
      if (hasString) this.lastInferredType = 'string';
      else if (allNumbers) this.lastInferredType = 'number';
      else this.lastInferredType = 'any';
    } else {
      this.lastInferredType = lhsType;
    }
    return result;
  }

  multiplication(ctx: any) {
    let result = this.visit(ctx.lhs);
    if (ctx.rhs && ctx.rhs.length > 0) {
      this.lastInferredType = 'number';
      for (let i = 0; i < ctx.rhs.length; i++) {
        const op = ctx.ops[i].image;
        const rhs = this.visit(ctx.rhs[i]);
        result = `${result} ${op} ${rhs}`;
      }
    }
    return result;
  }

  unaryExpression(ctx: any) {
    const atomic = this.visit(ctx.atomic);
    if (ctx.sign) {
      const op = ctx.sign[0].image;
      if (op === '!') this.lastInferredType = 'boolean';
      if (op === '-') this.lastInferredType = 'number';
      return `${op}${atomic}`;
    }
    return atomic;
  }

  atomic(ctx: any) {
    if (ctx.literal) {
      return this.visit(ctx.literal);
    }
    if (ctx.functionCall) {
      return this.visit(ctx.functionCall);
    }
    if (ctx.anyIdentifier) {
      this.lastInferredType = 'any';
      const id = this.visit(ctx.anyIdentifier);

      if (['true', 'false', 'null'].includes(id.name) && !id.quoted) {
        return id.name;
      }
      if (id.name === '_key' && !id.quoted) {
        return '_key';
      }

      if (!id.quoted) {
        // Check for explicit context prefixes (source.field or target.field)
        if (id.name.startsWith('source.') || id.name.startsWith('source[')) {
          // User explicitly specified source context - don't prepend
          const path = id.name.startsWith('source.') ? id.name.substring(7) : id.name.substring(6);
          if (this.isAnalyzing && path) this.tracker.recordAccess(path, 'any', false);
          return this.safeMode ? this.safify(id.name) : id.name;
        }
        if (id.name.startsWith('target.') || id.name.startsWith('target[')) {
          // User explicitly specified target context - don't prepend
          const path = id.name.startsWith('target.') ? id.name.substring(7) : id.name.substring(6);
          if (this.isAnalyzing && path) this.tracker.recordAccess(path, 'any', true);
          return this.safeMode ? this.safify(id.name) : id.name;
        }

        // Bare 'source' or 'target' keywords
        if (id.name === 'target') {
          return 'target';
        }
        if (id.name === 'source') {
          return 'source';
        }

        // Root source/target access
        if (
          id.name === '_source' ||
          id.name.startsWith('_source.') ||
          id.name.startsWith('_source[')
        ) {
          const path = id.name.substring(7);
          if (this.isAnalyzing) {
            const trackPath = path.startsWith('.') ? path.substring(1) : path;
            if (trackPath) this.tracker.recordAccess(trackPath, 'any', false);
          }
          const safified = this.safeMode ? this.safify(path) : path;
          return `_rootSource${safified}`;
        }
        if (
          id.name === '_target' ||
          id.name.startsWith('_target.') ||
          id.name.startsWith('_target[')
        ) {
          const path = id.name.substring(7);
          if (this.isAnalyzing) {
            const trackPath = path.startsWith('.') ? path.substring(1) : path;
            if (trackPath) this.tracker.recordAccess(trackPath, 'any', true);
          }
          const safified = this.safeMode ? this.safify(path) : path;
          return `_rootTarget${safified}`;
        }
      }
      // No explicit context - use current readFrom context
      if (this.isAnalyzing) {
        this.tracker.recordAccess(id.name, 'any', this.readFrom === 'target');
      }
      return this.genAccess(this.readFrom, id);
    }
    if (ctx.expression) {
      return `(${this.visit(ctx.expression)})`;
    }
  }

  functionCall(ctx: any) {
    const originalName = ctx.name[0].image;
    const name = (
      originalName.startsWith('`') ? originalName.slice(1, -1) : originalName
    ).toLowerCase();
    const args = ctx.args ? ctx.args.map((a: any) => this.visit(a)) : [];

    const handler = functionRegistry[name];
    if (handler) {
      // Inferred types for built-in functions
      if (
        [
          'substring',
          'text',
          'replace',
          'uppercase',
          'lowercase',
          'to_base64',
          'from_base64',
        ].includes(name)
      ) {
        this.lastInferredType = 'string';
      } else if (['number', 'extractnumber'].includes(name)) {
        this.lastInferredType = 'number';
      } else if (['aslist', 'transpose', 'list', 'array'].includes(name)) {
        this.lastInferredType = 'array';
      } else if (name === 'asobject') {
        this.lastInferredType = 'object';
      }

      return handler(args, this);
    }

    throw new Error(`Unknown function: ${originalName}`);
  }

  sectionRule(ctx: any) {
    const sectionId = this.visit(ctx.sectionName);
    const sectionName = sectionId.name;
    const sectionAccess = this.genAccess('target', sectionId, true); // LHS = true (being assigned to)

    let sourceAccess: string;
    let followName: string;

    if (ctx.followExpr) {
      const exprResult = this.visit(ctx.followExpr);
      const normalized = exprResult.replace(/\?\./g, '.');
      const isParent =
        normalized === 'source.parent' ||
        normalized === 'this.source.parent' ||
        normalized === `${this.readFrom.replace(/\?\./g, '.')}.parent`;

      if (isParent) {
        sourceAccess = 'source';
        followName = 'parent';
      } else {
        sourceAccess = exprResult;
        followName = sourceAccess;
      }
    } else {
      sourceAccess = this.genAccess('source', sectionId);
      followName = sectionId.name;
    }

    const isMultiple = !!ctx.Multiple;

    // Handle where clause
    const hasWhere = !!ctx.whereExpr;
    let whereCondition = '';
    if (hasWhere) {
      whereCondition = this.visit(ctx.whereExpr);
    }

    // Check if this is a subquery section
    const isSubquery = !!ctx.subqueryFrom;

    if (isSubquery) {
      const subSourceType = this.visit(ctx.subquerySourceType);
      const subTargetType = this.visit(ctx.subqueryTargetType);

      this.scopeStack.push({
        format: subTargetType.name,
        options: subTargetType.options,
        isSerializationScope: true,
      });

      try {
        const hasTransform = !!ctx.subqueryTransform;
        const actions = ctx.action ? ctx.action.map((a: any) => this.visit(a)) : [];

        if (!hasTransform) {
          // Pure format conversion - copy all fields
          actions.push('Object.assign(target, source);');
        }

        const subSourceOptions = JSON.stringify(subSourceType.options);
        const subTargetOptions = JSON.stringify(subTargetType.options);

        // Optimization: use a temporary variable for sourceAccess if it's a function call or expression
        const sourceVar =
          sourceAccess.includes('(') || sourceAccess.includes('[') || sourceAccess.includes(' ')
            ? '_sectionSource'
            : sourceAccess;
        const sourceInit =
          sourceVar === '_sectionSource' ? `const _sectionSource = ${sourceAccess};\n` : '';

        if (isMultiple) {
          const filterPart = hasWhere
            ? `.filter((item, index) => { const source = item; const _key = index; return ${whereCondition}; })`
            : '';
          return `
        {
          ${sourceInit}if (${sourceVar} && Array.isArray(${sourceVar})) {
            ${sectionAccess} = ${sourceVar}${filterPart}.map((item, index) => {
              const subSource = env.parse('${subSourceType.name}', item, ${subSourceOptions});
              const source = _safeSource(subSource);
              const _key = index;
              const target = {};
              ${actions.join('\n              ')}
              return env.serialize('${subTargetType.name}', target, ${subTargetOptions});
            });
          }
        }
        `;
        } else {
          // Single subquery section with where = find first match
          if (hasWhere) {
            return `
        {
          ${sourceInit}if (${sourceVar} && Array.isArray(${sourceVar})) {
            const _filtered = ${sourceVar}.find((item, index) => { const source = item; const _key = index; return ${whereCondition}; });
            if (_filtered) {
              ${sectionAccess} = (function(innerSource, innerIndex) {
                const subSource = env.parse('${subSourceType.name}', innerSource, ${subSourceOptions});
                const source = _safeSource(subSource);
                const _key = innerIndex;
                const target = {};
                ${actions.join('\n                ')}
                return env.serialize('${subTargetType.name}', target, ${subTargetOptions});
              })(_filtered, ${sourceVar}.indexOf(_filtered));
            }
          }
        }
        `;
          } else {
            return `
        {
          ${sourceInit}if (${sourceVar}) {
            ${sectionAccess} = (function(innerSource) {
              const subSource = env.parse('${subSourceType.name}', innerSource, ${subSourceOptions});
              const source = _safeSource(subSource);
              const _key = 0; // Single section without where, index is effectively 0 if we consider it an "iteration"
              const target = {};
              ${actions.join('\n              ')}
              return env.serialize('${subTargetType.name}', target, ${subTargetOptions});
            })(${sourceVar});
          }
        }
        `;
          }
        }
      } finally {
        this.scopeStack.pop();
      }
    }

    // Regular section handling
    this.scopeStack.push({
      format: 'object',
      options: {},
      isSerializationScope: false,
    });

    try {
      let followPathForTracker = followName;
      if (followPathForTracker !== 'parent') {
        followPathForTracker = followPathForTracker
          .replace(/^source\??\./, '')
          .replace(/^this\.source\??\./, '')
          .replace(/\?\./g, '.');
      }

      if (this.isAnalyzing) {
        if (followPathForTracker === 'parent' || this.isSimplePath(followPathForTracker)) {
          this.tracker.pushSection(sectionName, followPathForTracker, isMultiple);
        } else {
          // If it's a complex expression, we treat it as if it's from the current parent context
          // but we don't record the full expression as a path in the schema.
          this.tracker.pushSection(sectionName, 'parent', isMultiple);
        }
      }

      try {
        const regularActions = ctx.action ? ctx.action.map((a: any) => this.visit(a)) : [];

        // Optimization: use a temporary variable for sourceAccess if it's a function call or expression
        const sourceVar =
          sourceAccess.includes('(') || sourceAccess.includes('[') || sourceAccess.includes(' ')
            ? '_sectionSource'
            : sourceAccess;
        const sourceInit =
          sourceVar === '_sectionSource' ? `const _sectionSource = ${sourceAccess};\n` : '';

        if (isMultiple) {
          const filterPart = hasWhere
            ? `.filter((item, index) => { const source = _safeSource(item); const _key = index; return ${whereCondition}; })`
            : '';
          return `
      {
        ${sourceInit}if (${sourceVar} && Array.isArray(${sourceVar})) {
          ${sectionAccess} = ${sourceVar}${filterPart}.map((item, index) => {
            const source = _safeSource(item);
            const _key = index;
            const target = {};
            ${regularActions.join('\n            ')}
            return target;
          });
        }
      }
      `;
        } else {
          // Single section with where = find first match
          if (hasWhere) {
            return `
      {
        ${sourceInit}if (${sourceVar} && Array.isArray(${sourceVar})) {
          const _filtered = ${sourceVar}.find((item, index) => { const source = _safeSource(item); const _key = index; return ${whereCondition}; });
          if (_filtered) {
            ${sectionAccess} = (function(innerSource, innerIndex) {
              const source = _safeSource(innerSource);
              const _key = innerIndex;
              const target = {};
              ${regularActions.join('\n              ')}
              return target;
            })(_filtered, ${sourceVar}.indexOf(_filtered));
          }
        }
      }
      `;
          } else {
            return `
      {
        ${sourceInit}if (${sourceVar}) {
          ${sectionAccess} = (function(innerSource) {
            const source = _safeSource(innerSource);
            const _key = 0;
            const target = {};
            ${regularActions.join('\n            ')}
            return target;
          })(${sourceVar});
        }
      }
      `;
          }
        }
      } finally {
        if (this.isAnalyzing) {
          const trackPath =
            followPathForTracker === 'parent' || this.isSimplePath(followPathForTracker)
              ? followPathForTracker
              : 'parent';
          this.tracker.popSection(trackPath, isMultiple);
        }
      }
    } finally {
      this.scopeStack.pop();
    }
  }
}

export const compiler = new MorphCompiler();
