import { morphQL } from '../index.js';

describe('morphQL tagged template helper', () => {
  it('should return a plain string without interpolation', () => {
    const query = morphQL`from json to xml`;
    expect(query).toBe('from json to xml');
  });

  it('should handle multiline strings', () => {
    const query = morphQL`
      from json to xml
      transform
        set name = firstName
    `;
    expect(query).toContain('from json to xml');
    expect(query).toContain('transform');
    expect(query).toContain('set name = firstName');
  });

  it('should interpolate values', () => {
    const format = 'json';
    const field = 'firstName';
    const query = morphQL`
      from ${format} to xml
      transform
        set name = ${field}
    `;
    expect(query).toContain('from json to xml');
    expect(query).toContain('set name = firstName');
  });

  it('should handle empty interpolations', () => {
    const value = '';
    const query = morphQL`from json${value} to xml`;
    expect(query).toBe('from json to xml');
  });

  it('should handle numeric interpolations', () => {
    const start = 0;
    const length = 5;
    const query = morphQL`set short = substring(name, ${start}, ${length})`;
    expect(query).toBe('set short = substring(name, 0, 5)');
  });
});
