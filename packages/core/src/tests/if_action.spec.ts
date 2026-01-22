import { describe, it, expect } from 'vitest';
import { compile, morphQL } from '../index.js';

describe('Conditional Action Blocks (Statements)', async () => {
  it('should support if block (no else)', async () => {
    const query = morphQL`
      from object to object
      transform
        set base = 100
        if (isPremium) (
            set discount = 20
        )
    `;
    const engine = await compile(query);
    expect(engine({ isPremium: true }).discount).toBe(20);
    // If condition is false, discount should not be set (undefined)
    expect(engine({ isPremium: false }).discount).toBeUndefined();
    expect(engine({ isPremium: true }).base).toBe(100);
  });

  it('should support if-else block', async () => {
    const query = morphQL`
      from object to object
      transform
        if (age >= 18) (
            set type = "adult"
            set canVote = true
        ) else (
            set type = "minor"
            set canVote = false
        )
    `;
    const engine = await compile(query);

    const adult = engine({ age: 20 });
    expect(adult.type).toBe('adult');
    expect(adult.canVote).toBe(true);

    const minor = engine({ age: 15 });
    expect(minor.type).toBe('minor');
    expect(minor.canVote).toBe(false);
  });

  it('should support nested if blocks', async () => {
    const query = morphQL`
      from object to object
      transform
        if (active) (
            set status = "active"
            if (role == "admin") (
                set access = "full"
            ) else (
                set access = "limited"
            )
        ) else (
            set status = "inactive"
            set access = "none"
        )
    `;
    const engine = await compile(query);

    const admin = engine({ active: true, role: 'admin' });
    expect(admin.status).toBe('active');
    expect(admin.access).toBe('full');

    const user = engine({ active: true, role: 'user' });
    expect(user.status).toBe('active');
    expect(user.access).toBe('limited');

    const inactive = engine({ active: false });
    expect(inactive.status).toBe('inactive');
    expect(inactive.access).toBe('none');
  });

  it('should work inside sections', async () => {
    const query = morphQL`
      from object to object
      transform
        section meta (
            if (public) (
                set visible = true
            ) else (
                set visible = false
            )
        )
    `;
    const engine = await compile(query);
    expect(engine({ meta: { public: true } }).meta.visible).toBe(true);
    expect(engine({ meta: { public: false } }).meta.visible).toBe(false);
  });

  it('should work with complex conditions', async () => {
    const query = morphQL`
      from object to object
      transform
        if (val > 10 && val < 20) (
            set range = "medium"
        )
    `;
    const engine = await compile(query);
    expect(engine({ val: 15 }).range).toBe('medium');
    expect(engine({ val: 5 }).range).toBeUndefined();
    expect(engine({ val: 25 }).range).toBeUndefined();
  });
});
