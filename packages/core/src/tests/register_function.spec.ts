import { describe, test, expect } from 'vitest';
import { compile, registerFunction } from '../index.js';

describe('Custom function registration (registerFunction)', () => {
  test('registers and uses a custom function (double)', async () => {
    // Register custom 'double' function using a simple JS closure
    registerFunction('double', (num: any) => {
      return Number(num) * 2;
    });

    const queryString = `
      from object to object
      transform
        set result = double(val)
    `;
    const engine = await compile(queryString);
    const output = await engine({ val: 21 });
    expect(output).toEqual({ result: 42 });
  });

  test('registers and uses a custom function with multiple arguments', async () => {
    registerFunction('greet_user', (name: any, greeting: any) => {
      return `${greeting || 'Hello'}, ${name}!`;
    });

    const queryString = `
      from object to object
      transform
        set message1 = greet_user("Alice")
        set message2 = greet_user("Bob", "Hi")
    `;
    const engine = await compile(queryString);
    const output = await engine({});
    expect(output).toEqual({ 
      message1: "Hello, Alice!",
      message2: "Hi, Bob!" 
    });
  });

  test('registers and uses a function with case-insensitivity', async () => {
    registerFunction('MyCAsEUppEr', (str: any) => {
      return String(str).toUpperCase();
    });

    const queryString = `
      from object to object
      transform
        set res = mycASEupper("wow")
    `;
    const engine = await compile(queryString);
    const output = await engine({});
    expect(output).toEqual({ res: "WOW" });
  });
});
