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
