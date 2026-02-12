import { compile } from "@morphql/core";
import { MorphQLFileCache } from "./file-cache.js";
import { Command } from "commander";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { existsSync } from "node:fs";
import { batchAction } from "./batch.js";
import { watchAction } from "./watch.js";
import { createLogger, LogFormat } from "./logger.js";
import { resolveQuery } from "./file-utils.js";

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
  .version("0.1.19");

// --- 1. Batch Subcommand ---
program
  .command("batch")
  .description("Transform all files in a directory")
  .option("-q, --query <string>", "MorphQL query string")
  .option(
    "-Q, --query-file <path>",
    "Path to a file containing the MorphQL query",
  )
  .requiredOption("--in <path>", "Input directory")
  .requiredOption("--out <path>", "Output directory")
  .option("--pattern <glob>", "Include pattern for source files", "*")
  .option("--done-dir <path>", "Move processed files here")
  .option("--error-dir <path>", "Move failed files here")
  .option(
    "--delete",
    "Delete source files after successful processing (if --done-dir is missing)",
  )
  .option("--cache-dir <path>", "Directory for compiled cache", ".compiled")
  .option("--log-format <format>", "Log output format: text or json", "text")
  .action(batchAction);

// --- 2. Watch Subcommand ---
program
  .command("watch")
  .description("Watch a directory and transform new files")
  .option("-q, --query <string>", "MorphQL query string")
  .option(
    "-Q, --query-file <path>",
    "Path to a file containing the MorphQL query",
  )
  .requiredOption("--in <path>", "Input directory")
  .requiredOption("--out <path>", "Output directory")
  .option("--pattern <glob>", "Include pattern for source files", "*")
  .option("--done-dir <path>", "Move processed files here")
  .option("--error-dir <path>", "Move failed files here")
  .option(
    "--delete",
    "Delete source files after successful processing (if --done-dir is missing)",
  )
  .option("--cache-dir <path>", "Directory for compiled cache", ".compiled")
  .option("--pid-file <path>", "Write PID to file for process management")
  .option("--log-format <format>", "Log output format: text or json", "text")
  .action(watchAction);

// --- 3. Default Command (Single File) ---
program
  .option("-f, --from <path>", "Path to the source file")
  .option("-i, --input <string>", "Raw source content as string")
  .option(
    "-t, --to <path>",
    "Path to the destination file (if omitted, result is printed to stdout)",
  )
  .option("-q, --query <string>", "MorphQL query string")
  .option(
    "-Q, --query-file <path>",
    "Path to a file containing the MorphQL query",
  )
  .option("--cache-dir <path>", "Directory for compiled cache", ".compiled")
  .option("--log-format <format>", "Log output format: text or json", "text")
  .action(async (options) => {
    // If no query is provided (inline or file), show help
    if (!options.query && !options.queryFile) {
      program.help();
      return;
    }

    const logger = createLogger(options.logFormat as LogFormat);

    try {
      const { from, input, to, cacheDir } = options;
      const query = resolveQuery(options.query, options.queryFile);

      // 1. Resolve source content
      let sourceContent: string;
      if (input) {
        sourceContent = input;
      } else if (from) {
        if (!existsSync(from)) {
          logger.error(`Source file not found: ${from}`);
          process.exit(1);
        }
        sourceContent = await fs.readFile(from, "utf8");
      } else if (!process.stdin.isTTY) {
        // Read from stdin (pipe)
        sourceContent = await readStdin();
      } else {
        logger.error(
          "Either --from <path>, --input <string>, or pipe data via stdin must be provided.",
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
        logger.info(`Successfully transformed to ${to}`);
      } else {
        process.stdout.write(result + "\n");
      }
    } catch (error: any) {
      logger.error(`Error during transformation: ${error.message}`);
      process.exit(1);
    }
  });

program.parse();
