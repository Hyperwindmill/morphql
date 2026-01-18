import { Command } from "commander";
import { compile, MQLFileCache } from "@query-morph/core";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { existsSync } from "node:fs";

const program = new Command();

program
  .name("query-morph")
  .description(
    "CLI tool for query-morph - transform structural data from the command line.",
  )
  .version("0.1.0")
  .requiredOption("-f, --from <path>", "Path to the source file")
  .requiredOption("-t, --to <path>", "Path to the destination file")
  .requiredOption("-q, --query <string>", "MQL query string")
  .option("--cache-dir <path>", "Directory for compiled cache", ".compiled")
  .action(async (options) => {
    try {
      const { from, to, query, cacheDir } = options;

      // 1. Read source file
      if (!existsSync(from)) {
        console.error(`Error: Source file not found: ${from}`);
        process.exit(1);
      }
      const sourceContent = await fs.readFile(from, "utf8");

      // 2. Initialize Cache
      const cache = new MQLFileCache(cacheDir);

      // 3. Compile Query
      const engine = await compile(query, { cache });

      // 4. Transform
      const result = await engine(sourceContent);

      // 5. Write to destination
      const destDir = path.dirname(to);
      if (!existsSync(destDir)) {
        await fs.mkdir(destDir, { recursive: true });
      }
      await fs.writeFile(to, result, "utf8");

      console.log(`Successfully transformed ${from} to ${to}`);
    } catch (error: any) {
      console.error(`Error during transformation: ${error.message}`);
      process.exit(1);
    }
  });

program.parse();
