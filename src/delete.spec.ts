import { describe, it, expect } from 'vitest';
import { compile } from './index.js';

describe('Delete Action', () => {
  it('should delete a property from the target', () => {
    const query = `
      from object to object
      transform
        set a = 1
        set b = 2
        delete a
    `;
    const engine = compile(query);
    const result = engine({});
    expect(result.a).toBeUndefined();
    expect(result.b).toBe(2);
  });

  it('should delete a property after clone', () => {
    const query = `
      from object to object
      transform
        clone
        delete unwanted
    `;
    const engine = compile(query);
    const source = { keep: 'yes', unwanted: 'no' };
    const result = engine(source);
    expect(result.keep).toBe('yes');
    expect(result.unwanted).toBeUndefined();
  });

  it('should work inside sections', () => {
    const query = `
      from object to object
      transform
        section meta (
            set visible = true
            set hidden = false
            delete hidden
        )
    `;
    const engine = compile(query);
    const result = engine({ meta: {} });
    expect(result.meta.visible).toBe(true);
    expect(result.meta.hidden).toBeUndefined();
  });

  it('should work inside if blocks', () => {
    const query = `
      from object to object
      transform
        set sensitive = "secret"
        if (isPublic) (
            delete sensitive
        )
    `;
    const engine = compile(query);
    expect(engine({ isPublic: true }).sensitive).toBeUndefined();
    expect(engine({ isPublic: false }).sensitive).toBe('secret');
  });
});
