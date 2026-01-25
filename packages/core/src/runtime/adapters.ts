import { XMLParser, XMLBuilder } from 'fast-xml-parser';

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
    const rootTag = options?.rootGenerated ?? 'root';
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

// Object Adapter (Identity)
registerAdapter('object', {
  parse: (content) => content, // Assumes input is already an object
  serialize: (data) => data, // Returns object directly
});
