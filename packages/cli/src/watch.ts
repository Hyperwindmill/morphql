import * as fs from "node:fs/promises";
import { watch, existsSync, writeFileSync, unlinkSync } from "node:fs";
import * as path from "node:path";
import { compile } from "@morphql/core";
import { MorphQLFileCache } from "./file-cache.js";
import { createLogger, LogFormat } from "./logger.js";
import {
  extractTargetFormat,
  matchesPattern,
  processFile,
  resolveOutputPath,
  resolveQuery,
} from "./file-utils.js";

export interface WatchOptions {
  query?: string;
  queryFile?: string;
  in: string;
  out: string;
  pattern: string;
  doneDir?: string;
  errorDir?: string;
  cacheDir: string;
  logFormat: LogFormat;
  pidFile?: string;
  delete?: boolean;
}

export async function watchAction(options: WatchOptions) {
  const logger = createLogger(options.logFormat);

  try {
    const {
      in: inDir,
      out: outDir,
      pattern,
      cacheDir,
      doneDir,
      errorDir,
      pidFile,
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
    const query = resolveQuery(options.query, options.queryFile);
    const cache = new MorphQLFileCache(cacheDir);
    const engine = await compile(query, { cache });
    const targetFormat = extractTargetFormat(query);

    // 4. Initial Sweep
    logger.info("Starting initial sweep...");
    const allFiles = await fs.readdir(absInDir);
    for (const filename of allFiles) {
      if (matchesPattern(filename, pattern)) {
        const inputPath = path.join(absInDir, filename);
        const outputPath = resolveOutputPath(
          inputPath,
          absInDir,
          absOutDir,
          targetFormat,
        );
        await processFile({
          engine,
          inputPath,
          outputPath,
          doneDir: absDoneDir,
          errorDir: absErrorDir,
          deleteSource: options.delete,
        });
      }
    }

    // 5. PID File management
    if (pidFile) {
      writeFileSync(pidFile, process.pid.toString());
      logger.info(`PID ${process.pid} written to ${pidFile}`);
    }

    // 6. Graceful Shutdown
    const cleanup = () => {
      if (pidFile && existsSync(pidFile)) {
        unlinkSync(pidFile);
      }
      logger.info("Shutting down watch mode...");
      process.exit(0);
    };

    process.on("SIGINT", cleanup);
    process.on("SIGTERM", cleanup);

    // 7. Watcher Setup
    logger.info(`Watching directory: ${absInDir} [Pattern: ${pattern}]`);

    const pending = new Map<string, NodeJS.Timeout>();

    watch(absInDir, { recursive: false }, async (eventType, filename) => {
      if (!filename || !matchesPattern(filename, pattern)) return;

      const inputPath = path.join(absInDir, filename);

      // Debounce: Wait 100ms for file to stabilize (handles multi-step writes/renames)
      const existing = pending.get(filename);
      if (existing) clearTimeout(existing);

      pending.set(
        filename,
        setTimeout(async () => {
          pending.delete(filename);

          // Verify file still exists (could have been a temp file that was renamed)
          if (!existsSync(inputPath)) return;

          const stats = await fs.stat(inputPath);
          if (stats.isDirectory()) return;

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
            deleteSource: options.delete,
          });

          if (result.success) {
            logger.info("Transformed", {
              input: filename,
              output: path.basename(result.outputPath!),
              duration: result.duration,
            });
          } else {
            logger.error(result.error || "Unknown error", {
              input: filename,
            });
          }
        }, 100),
      );
    });
  } catch (error: any) {
    logger.error(`Watch execution failed: ${error.message}`);
    process.exit(1);
  }
}
