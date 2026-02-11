import * as fs from "node:fs/promises";
import * as path from "node:path";
import { existsSync } from "node:fs";
import { compile } from "@morphql/core";
import { MorphQLFileCache } from "./file-cache.js";
import { createLogger, LogFormat } from "./logger.js";
import {
  extractTargetFormat,
  matchesPattern,
  processFile,
  resolveOutputPath,
} from "./file-utils.js";

export interface BatchOptions {
  query: string;
  in: string;
  out: string;
  pattern: string;
  doneDir?: string;
  errorDir?: string;
  cacheDir: string;
  logFormat: LogFormat;
}

export async function batchAction(options: BatchOptions) {
  const logger = createLogger(options.logFormat);
  const start = Date.now();

  try {
    const {
      in: inDir,
      out: outDir,
      query,
      pattern,
      cacheDir,
      doneDir,
      errorDir,
    } = options;

    // 1. Validate Input
    if (!existsSync(inDir)) {
      logger.error(`Input directory does not exist: ${inDir}`);
      process.exit(1);
    }

    const absInDir = path.resolve(process.cwd(), inDir);
    const absOutDir = path.resolve(process.cwd(), outDir);
    const absDoneDir = doneDir
      ? path.resolve(process.cwd(), doneDir)
      : undefined;
    const absErrorDir = errorDir
      ? path.resolve(process.cwd(), errorDir)
      : undefined;

    // 2. Prepare Directories
    if (!existsSync(absOutDir)) await fs.mkdir(absOutDir, { recursive: true });

    // 3. Compile Query Once
    const cache = new MorphQLFileCache(cacheDir);
    const engine = await compile(query, { cache });
    const targetFormat = extractTargetFormat(query);

    // 4. List Files
    const allFiles = await fs.readdir(absInDir);
    const targetFiles = allFiles.filter((f) => matchesPattern(f, pattern));

    if (targetFiles.length === 0) {
      logger.info("No files found matching pattern", { pattern, in: inDir });
      return;
    }

    logger.info(`Starting batch processing of ${targetFiles.length} files...`);

    // 5. Process Files
    let processed = 0;
    let errors = 0;

    for (const filename of targetFiles) {
      const inputPath = path.join(absInDir, filename);
      const outputPath = resolveOutputPath(
        inputPath,
        absInDir,
        absOutDir,
        targetFormat,
      );

      const result = await processFile({
        engine,
        inputPath,
        outputPath,
        doneDir: absDoneDir,
        errorDir: absErrorDir,
      });

      if (result.success) {
        processed++;
        logger.info("Transformed", {
          input: path.basename(inputPath),
          output: path.basename(result.outputPath!),
          duration: result.duration,
        });
      } else {
        errors++;
        logger.error(result.error || "Unknown error", {
          input: path.basename(inputPath),
        });
      }
    }

    // 6. Final Summary
    logger.summary({
      processed,
      errors,
      duration: Date.now() - start,
    });

    if (errors > 0) {
      process.exit(1);
    }
  } catch (error: any) {
    logger.error(`Batch execution failed: ${error.message}`);
    process.exit(1);
  }
}
