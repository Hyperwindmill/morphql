import { describe, it, expect } from 'vitest';
import { compile, morphQL, registerAdapter, DataAdapter } from '../index.js';

describe('Custom Adapter Registration', () => {
  it('should allow registering and using a custom adapter', async () => {
    const mockAdapter: DataAdapter = {
      parse: (content: string) => ({ parsed: content }),
      serialize: (data: any) => `serialized:${data.parsed}`,
    };

    registerAdapter('mock', mockAdapter);

    const query = morphQL`
      from mock to mock
      transform
        set parsed = parsed + " - transformed"
    `;

    const engine = await compile(query);
    const result = await engine('input');

    expect(result).toBe('serialized:input - transformed');
  });

  it('should be case-insensitive for adapter names', async () => {
    const identityAdapter: DataAdapter = {
      parse: (content: string) => JSON.parse(content),
      serialize: (data: any) => JSON.stringify(data),
    };

    registerAdapter('CASE_TEST', identityAdapter);

    const query = morphQL`from case_test to case_test transform clone`;
    const engine = await compile(query);
    const result = await engine('{"foo":"bar"}');

    expect(result).toBe('{"foo":"bar"}');
  });
});
