import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import Papa from 'papaparse';

export interface DataAdapter {
  parse(content: string, options?: any): any;
  serialize(data: any, options?: any): string;
}

const adapters: Record<string, DataAdapter> = {};

export function registerAdapter(name: string, adapter: DataAdapter) {
  adapters[name.toLowerCase()] = adapter;
}

export function getAdapter(name: string): DataAdapter {
  const adapter = adapters[name.toLowerCase()];
  if (!adapter) {
    throw new Error(`No adapter found for format: ${name}`);
  }
  return adapter;
}

// Helpers
function indexToLetter(index: number): string {
  let letter = '';
  while (index >= 0) {
    letter = String.fromCharCode((index % 26) + 65) + letter;
    index = Math.floor(index / 26) - 1;
  }
  return letter;
}

// Default JSON Adapter

registerAdapter('json', {
  parse: (content) => {
    if (typeof content !== 'string') return content;
    return JSON.parse(content);
  },
  serialize: (data) => JSON.stringify(data, null, 2),
});

// Default XML Adapter
const xmlBuilder = new XMLBuilder({
  ignoreAttributes: false,
  attributeNamePrefix: '$',
  textNodeName: '_',
  format: true,
});

registerAdapter('xml', {
  parse: (content, options) => {
    if (typeof content !== 'string') return content;
    const parser = new XMLParser({
      ignoreAttributes: false,
      removeNSPrefix: true,
      ...options,
    });
    return parser.parse(content);
  },
  serialize: (data, options) => {
    const rootTag = options?.rootGenerated ?? options?.params?.[0] ?? 'root';
    const builder = options
      ? new XMLBuilder({
          ignoreAttributes: false,
          attributeNamePrefix: '$',
          textNodeName: '_',
          format: true,
          ...options,
        })
      : xmlBuilder;
    return builder.build({ [rootTag]: data });
  },
});

// CSV Adapter
registerAdapter('csv', {
  parse: (content, options) => {
    if (typeof content !== 'string') return content;
    const delimiter = options?.delimiter ?? options?.params?.[0] ?? ',';
    const parsed = Papa.parse<any[]>(content, {
      delimiter,
      skipEmptyLines: true,
      ...options,
    }) as any;

    const rows = parsed.data.map((row: any) => {
      const obj: any = {};
      if (Array.isArray(row)) {
        row.forEach((val, i) => {
          obj[indexToLetter(i)] = val;
        });
      }
      return obj;
    });

    return { rows };
  },
  serialize: (data, options) => {
    if (!data || !Array.isArray(data.rows)) return '';
    const delimiter = options?.delimiter ?? options?.params?.[0] ?? ',';

    const csvData = data.rows.map((row: any) => {
      // Sort keys to ensure correct column order (A, B, C... Z, AA, AB...)
      const sortedKeys = Object.keys(row)
        .filter((k) => /^[A-Z]+$/.test(k))
        .sort((a, b) => {
          if (a.length !== b.length) return a.length - b.length;
          return a.localeCompare(b);
        });
      return sortedKeys.map((k) => row[k]);
    });

    return Papa.unparse(csvData, {
      delimiter,
      ...options,
    });
  },
});

// EDIFACT Adapter
registerAdapter('edifact', {
  parse: (content: string, options?: any) => {
    if (typeof content !== 'string') return content;

    let segmentTerminator = "'";
    let elementSeparator = '+';
    let componentSeparator = ':';
    let releaseChar = '?';

    let data = content.trim();
    if (data.startsWith('UNA')) {
      const una = data.substring(3, 9);
      componentSeparator = una[0];
      elementSeparator = una[1];
      // una[2] is decimal mark
      releaseChar = una[3];
      // una[4] is reserved
      segmentTerminator = una[5];
      data = data.substring(9).trim();
    }

    // Manual override via options
    if (options) {
      if (options.segmentTerminator) segmentTerminator = options.segmentTerminator;
      if (options.elementSeparator) elementSeparator = options.elementSeparator;
      if (options.componentSeparator) componentSeparator = options.componentSeparator;
      if (options.releaseChar) releaseChar = options.releaseChar;
    }

    const result: Record<string, any[]> = {};

    const splitEscaped = (str: string, separator: string, release: string) => {
      const parts: string[] = [];
      let current = '';
      for (let i = 0; i < str.length; i++) {
        const char = str[i];
        if (char === release && i + 1 < str.length) {
          current += release + str[++i];
        } else if (char === separator) {
          parts.push(current);
          current = '';
        } else {
          current += char;
        }
      }
      parts.push(current);
      return parts;
    };

    const unescape = (str: string, release: string) => {
      let result = '';
      for (let i = 0; i < str.length; i++) {
        if (str[i] === release && i + 1 < str.length) {
          result += str[++i];
        } else {
          result += str[i];
        }
      }
      return result;
    };

    const segmentsRaw = splitEscaped(data, segmentTerminator, releaseChar).filter(
      (s) => s.trim().length > 0
    );

    for (const seg of segmentsRaw) {
      const elementsRaw = splitEscaped(seg, elementSeparator, releaseChar);
      const tag = unescape(elementsRaw[0], releaseChar);
      const elements = elementsRaw.slice(1).map((el) => {
        const componentsRaw = splitEscaped(el, componentSeparator, releaseChar);
        const components = componentsRaw.map((c) => unescape(c, releaseChar));
        return components.length > 1 ? components : components[0];
      });

      if (!result[tag]) {
        result[tag] = [];
      }
      result[tag].push(elements);
    }

    return result;
  },
  serialize: (data: any, options?: any) => {
    if (!data || typeof data !== 'object') return '';

    const segmentTerminator = options?.segmentTerminator ?? "'";
    const elementSeparator = options?.elementSeparator ?? '+';
    const componentSeparator = options?.componentSeparator ?? ':';
    const releaseChar = options?.releaseChar ?? '?';

    const escape = (val: any) => {
      if (val === null || val === undefined) return '';
      const str = String(val);
      let escaped = '';
      for (const char of str) {
        if (
          char === segmentTerminator ||
          char === elementSeparator ||
          char === componentSeparator ||
          char === releaseChar
        ) {
          escaped += releaseChar;
        }
        escaped += char;
      }
      return escaped;
    };

    let result = '';

    // If UNA is explicitly requested or delimiters are custom
    if (options?.includeUNA) {
      result += `UNA${componentSeparator}${elementSeparator}.${releaseChar} ${segmentTerminator}`;
    }

    for (const tag in data) {
      const segments = Array.isArray(data[tag]) ? data[tag] : [data[tag]];
      for (const seg of segments) {
        result += tag;
        if (Array.isArray(seg)) {
          for (const el of seg) {
            result += elementSeparator;
            if (Array.isArray(el)) {
              result += el.map(escape).join(componentSeparator);
            } else {
              result += escape(el);
            }
          }
        }
        result += segmentTerminator;
      }
    }

    return result;
  },
});

// Object Adapter (Identity)
registerAdapter('object', {
  parse: (content) => content, // Assumes input is already an object
  serialize: (data) => data, // Returns object directly
});

// Plaintext Adapter
registerAdapter('plaintext', {
  parse: (content: string, options?: any) => {
    if (typeof content !== 'string') return content;
    const separator = options?.separator ?? options?.params?.[0] ?? /\r?\n/;
    return {
      rows: content.split(separator).filter((line) => line.length > 0),
    };
  },
  serialize: (data: any, options?: any) => {
    if (!data || !Array.isArray(data.rows)) return '';
    const separator = options?.separator ?? options?.params?.[0] ?? '\n';
    return data.rows.join(separator);
  },
});
