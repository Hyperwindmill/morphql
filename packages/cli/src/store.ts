import { Store } from '@morphql/store';
import { FolderAdapter } from '@morphql/store/node';
import * as readline from 'node:readline';
import { existsSync } from 'node:fs';

export async function storeAction(options: any, command: any) {
  const dir = options.dir;
  const query = options.query || command?.optsWithGlobals?.()?.query;

  if (!existsSync(dir)) {
    console.error(`Error: Directory not found at ${dir}`);
    process.exit(1);
  }

  const store = new Store(new FolderAdapter(dir));

  // Single-shot mode
  if (query) {
    try {
      const result = await store.query(query);
      if (Array.isArray(result)) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log(`Query OK. ${result.type.toUpperCase()} on "${result.table}" executed.`);
      }
    } catch (e: any) {
      console.error(`Error: ${e.message}`);
      process.exit(1);
    }
    return;
  }

  // REPL mode
  console.log(`MorphQL Store Interactive REPL`);
  console.log(`Connected to folder: ${dir}`);
  console.log(`Type your SQL-like query and press Enter. Type 'exit' to quit.\n`);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'morphql> '
  });

  rl.prompt();

  rl.on('line', async (line) => {
    const input = line.trim();
    
    if (!input) {
      rl.prompt();
      return;
    }

    if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
      rl.close();
      return;
    }

    try {
      const result = await store.query(input);
      if (Array.isArray(result)) {
        if (result.length > 0 && typeof result[0] === 'object' && !Array.isArray(result[0])) {
          console.table(result);
        } else {
          console.log(JSON.stringify(result, null, 2));
        }
      } else {
        console.log(`Query OK. ${result.type.toUpperCase()} on "${result.table}" executed.`);
      }
    } catch (e: any) {
      console.error(`\x1b[31mError:\x1b[0m ${e.message}`);
    }

    rl.prompt();
  }).on('close', () => {
    console.log('\nBye!');
    process.exit(0);
  });
}
