import { describe, it, expect } from 'vitest';
import { compile, morphQL } from '../index.js';

describe('If Function and Conditional Logic', async () => {
  it('should support basic if-then-else values', async () => {
    const query = morphQL`
      from object to object
      transform
        set status = if(age >= 18, "adult", "minor")
    `;
    const engine = await compile(query);
    expect(engine({ age: 20 }).status).toBe('adult');
    expect(engine({ age: 15 }).status).toBe('minor');
    expect(engine({ age: 18 }).status).toBe('adult');
  });

  describe('Comparison Operators', async () => {
    it('should support less than (<)', async () => {
      const query = morphQL`
        from object to object
        transform
          set result = if(val < 10, "small", "large")
      `;
      const engine = await compile(query);
      expect(engine({ val: 5 }).result).toBe('small');
      expect(engine({ val: 10 }).result).toBe('large');
      expect(engine({ val: 15 }).result).toBe('large');
    });

    it('should support greater than (>)', async () => {
      const query = morphQL`
        from object to object
        transform
          set result = if(val > 10, "large", "small")
      `;
      const engine = await compile(query);
      expect(engine({ val: 15 }).result).toBe('large');
      expect(engine({ val: 10 }).result).toBe('small');
      expect(engine({ val: 5 }).result).toBe('small');
    });

    it('should support less than or equal (<=)', async () => {
      const query = morphQL`
        from object to object
        transform
          set result = if(val <= 10, "small", "large")
      `;
      const engine = await compile(query);
      expect(engine({ val: 5 }).result).toBe('small');
      expect(engine({ val: 10 }).result).toBe('small');
      expect(engine({ val: 15 }).result).toBe('large');
    });

    it('should support greater than or equal (>=)', async () => {
      const query = morphQL`
        from object to object
        transform
          set result = if(val >= 10, "large", "small")
      `;
      const engine = await compile(query);
      expect(engine({ val: 15 }).result).toBe('large');
      expect(engine({ val: 10 }).result).toBe('large');
      expect(engine({ val: 5 }).result).toBe('small');
    });

    it('should support equality (==)', async () => {
      const query = morphQL`
        from object to object
        transform
          set result = if(type == "admin", "full", "limited")
      `;
      const engine = await compile(query);
      expect(engine({ type: 'admin' }).result).toBe('full');
      expect(engine({ type: 'user' }).result).toBe('limited');
    });

    it('should support inequality (!=)', async () => {
      const query = morphQL`
        from object to object
        transform
          set result = if(type != "admin", "limited", "full")
      `;
      const engine = await compile(query);
      expect(engine({ type: 'user' }).result).toBe('limited');
      expect(engine({ type: 'admin' }).result).toBe('full');
    });
  });

  describe('Logical Operators', async () => {
    it('should support logical AND (&&)', async () => {
      const query = morphQL`
        from object to object
        transform
          set discount = if(member && amount > 100, 20, 0)
      `;
      const engine = await compile(query);
      expect(engine({ member: true, amount: 150 }).discount).toBe(20);
      expect(engine({ member: false, amount: 150 }).discount).toBe(0);
      expect(engine({ member: true, amount: 50 }).discount).toBe(0);
    });

    it('should support logical OR (||)', async () => {
      const query = morphQL`
        from object to object
        transform
          set access = if(admin || moderator, "granted", "denied")
      `;
      const engine = await compile(query);
      expect(engine({ admin: true, moderator: false }).access).toBe('granted');
      expect(engine({ admin: false, moderator: true }).access).toBe('granted');
      expect(engine({ admin: false, moderator: false }).access).toBe('denied');
    });

    it('should support logical NOT (!)', async () => {
      const query = morphQL`
        from object to object
        transform
          set result = if(!valid, "invalid", "valid")
      `;
      const engine = await compile(query);
      expect(engine({ valid: false }).result).toBe('invalid');
      expect(engine({ valid: true }).result).toBe('valid');
    });
  });

  describe('Complex Scenarios', async () => {
    it('should support nested if expressions', async () => {
      const query = morphQL`
        from object to object
        transform
          set grade = if(score >= 90, "A", if(score >= 80, "B", "C"))
      `;
      const engine = await compile(query);
      expect(engine({ score: 95 }).grade).toBe('A');
      expect(engine({ score: 85 }).grade).toBe('B');
      expect(engine({ score: 75 }).grade).toBe('C');
    });

    it('should work with arithmetic expressions in branches', async () => {
      const query = morphQL`
        from object to object
        transform
          set total = if(hasTax, price * 1.2, price)
      `;
      const engine = await compile(query);
      expect(engine({ hasTax: true, price: 100 }).total).toBe(120);
      expect(engine({ hasTax: false, price: 100 }).total).toBe(100);
    });

    it('should work with complex conditions', async () => {
      const query = morphQL`
        from object to object
        transform
          set status = if((age > 60 || disabled) && income < 20000, "qualified", "ineligible")
      `;
      const engine = await compile(query);
      // Age qualify
      expect(engine({ age: 65, disabled: false, income: 15000 }).status).toBe('qualified');
      // Disability qualify
      expect(engine({ age: 40, disabled: true, income: 15000 }).status).toBe('qualified');
      // Income too high
      expect(engine({ age: 65, disabled: false, income: 25000 }).status).toBe('ineligible');
      // Neither age nor disability
      expect(engine({ age: 40, disabled: false, income: 15000 }).status).toBe('ineligible');
    });
  });
});
