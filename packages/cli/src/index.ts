import { compile } from "@morphql/core";
import { MorphQLFileCache } from "./file-cache.js";
import { Command } from "commander";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { existsSync } from "node:fs";

/**
 * Reads all data from stdin (for pipe support)
 */
async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

const program = new Command();

program
  .name("morphql")
  .description(
    "CLI tool for morphql - transform structural data from the command line.",
  )
  .version("0.1.10")
  .option("-f, --from <path>", "Path to the source file")
  .option("-i, --input <string>", "Raw source content as string")
  .option(
    "-t, --to <path>",
    "Path to the destination file (if omitted, result is printed to stdout)",
  )
  .requiredOption("-q, --query <string>", "MorphQL query string")
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
      } else if (!process.stdin.isTTY) {
        // Read from stdin (pipe)
        sourceContent = await readStdin();
      } else {
        console.error(
          "Error: Either --from <path>, --input <string>, or pipe data via stdin must be provided.",
        );
        process.exit(1);
      }

      // 2. Initialize Cache
      const cache = new MorphQLFileCache(cacheDir);

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
