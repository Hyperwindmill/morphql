import * as fs from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import * as path from "node:path";

/**
 * Resolves the query string from either --query or --query-file.
 * Throws if neither is provided or the file doesn't exist.
 */
export function resolveQuery(query?: string, queryFile?: string): string {
  if (query) return query;
  if (queryFile) {
    if (!existsSync(queryFile)) {
      throw new Error(`Query file not found: ${queryFile}`);
    }
    return readFileSync(queryFile, "utf8").trim();
  }
  throw new Error("Either --query (-q) or --query-file (-Q) must be provided.");
}

export interface ProcessResult {
  success: boolean;
  inputPath: string;
  outputPath?: string;
  duration?: number;
  error?: string;
}

export interface ProcessOptions {
  engine: (source: string) => Promise<string> | string;
  inputPath: string;
  outputPath: string;
  doneDir?: string;
  errorDir?: string;
  deleteSource?: boolean;
}

/**
 * Maps MorphQL formats to file extensions.
 */
export function formatToExtension(format: string): string {
  const f = format.toLowerCase();
  switch (f) {
    case "json":
    case "object":
      return ".json";
    case "xml":
      return ".xml";
    case "csv":
      return ".csv";
    case "edifact":
      return ".edi";
    case "plaintext":
      return ".txt";
    default:
      return ".json";
  }
}

/**
 * Extracts the target format from a MorphQL query string.
 * Basic regex for "from X to Y"
 */
export function extractTargetFormat(query: string): string {
  const match = query.match(/to\s+(\w+)/i);
  return match ? match[1] : "json";
}

/**
 * Resolves the output file path.
 */
export function resolveOutputPath(
  inputPath: string,
  inputDir: string,
  outputDir: string,
  targetFormat: string,
): string {
  const relPath = path.relative(inputDir, inputPath);
  const ext = formatToExtension(targetFormat);
  const parsed = path.parse(relPath);

  // Reconstruct path with new extension
  return path.join(outputDir, path.join(parsed.dir, parsed.name + ext));
}

/**
 * Minimal glob matcher for * and ?.
 * Skips dotfiles by default.
 */
export function matchesPattern(filename: string, pattern: string): boolean {
  // 1. Dotfile convention: skip if starts with . and pattern doesn't
  if (filename.startsWith(".") && !pattern.startsWith(".")) {
    return false;
  }

  if (pattern === "*") return true;

  // Simple glob to Regex conversion
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(
    `^${escaped.replace(/\*/g, ".*").replace(/\?/g, ".")}$`,
  );

  return regex.test(filename);
}

/**
 * Centralized file processing logic.
 */
export async function processFile(
  options: ProcessOptions,
): Promise<ProcessResult> {
  const start = Date.now();
  const { inputPath, outputPath, engine, doneDir, errorDir } = options;

  try {
    const content = await fs.readFile(inputPath, "utf8");
    const result = await engine(content);

    // Ensure output directory exists
    const outDir = path.dirname(outputPath);
    if (!existsSync(outDir)) {
      await fs.mkdir(outDir, { recursive: true });
    }

    await fs.writeFile(outputPath, result, "utf8");

    // Handle --done-dir or --delete
    if (doneDir) {
      if (!existsSync(doneDir)) await fs.mkdir(doneDir, { recursive: true });
      const dest = path.join(doneDir, path.basename(inputPath));
      await fs.rename(inputPath, dest);
    } else if (options.deleteSource) {
      await fs.unlink(inputPath);
    }

    return {
      success: true,
      inputPath,
      outputPath,
      duration: Date.now() - start,
    };
  } catch (err: any) {
    // Handle --error-dir
    if (errorDir) {
      try {
        if (!existsSync(errorDir))
          await fs.mkdir(errorDir, { recursive: true });
        const dest = path.join(errorDir, path.basename(inputPath));
        await fs.rename(inputPath, dest);
      } catch {
        // Ignore move errors if the primary error already happened
      }
    }

    return {
      success: false,
      inputPath,
      error: err.message,
    };
  }
}
