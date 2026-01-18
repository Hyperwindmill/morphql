import { compile } from "@query-morph/core";
import { MQLFileCache } from "./file-cache.js";
import { Command } from "commander";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { existsSync } from "node:fs";

const program = new Command();

program
  .name("query-morph")
  .description(
    "CLI tool for query-morph - transform structural data from the command line.",
  )
  .version("0.1.2")
  .option("-f, --from <path>", "Path to the source file")
  .option("-i, --input <string>", "Raw source content as string")
  .option(
    "-t, --to <path>",
    "Path to the destination file (if omitted, result is printed to stdout)",
  )
  .requiredOption("-q, --query <string>", "MQL query string")
  .option("--cache-dir <path>", "Directory for compiled cache", ".compiled")
  .action(async (options) => {
    try {
      const { from, input, to, query, cacheDir } = options;

      // 1. Resolve source content
      let sourceContent: string;
      if (input) {
        sourceContent = input;
      } else if (from) {
        if (!existsSync(from)) {
          console.error(`Error: Source file not found: ${from}`);
          process.exit(1);
        }
        sourceContent = await fs.readFile(from, "utf8");
      } else {
        console.error(
          "Error: Either --from <path> or --input <string> must be provided.",
        );
        process.exit(1);
      }

      // 2. Initialize Cache
      const cache = new MQLFileCache(cacheDir);

      // 3. Compile Query
      const engine = await compile(query, { cache });

      // 4. Transform
      const result = await engine(sourceContent);

      // 5. Handle output
      if (to) {
        const destDir = path.dirname(to);
        if (!existsSync(destDir)) {
          await fs.mkdir(destDir, { recursive: true });
        }
        await fs.writeFile(to, result, "utf8");
        // Only log success if writing to file, otherwise we'd pollute stdout
        console.error(`Successfully transformed to ${to}`);
      } else {
        console.log(result);
      }
    } catch (error: any) {
      console.error(`Error during transformation: ${error.message}`);
      process.exit(1);
    }
  });

program.parse();
