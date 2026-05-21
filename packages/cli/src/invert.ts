import * as fs from "node:fs/promises";
import * as path from "node:path";
import { existsSync } from "node:fs";
import { invert } from "@morphql/core";
import { createLogger, LogFormat } from "./logger.js";
import { resolveQuery } from "./file-utils.js";

export interface InvertOptions {
  query?: string;
  queryFile?: string;
  out?: string;
  logFormat?: LogFormat;
}

export async function invertAction(options: InvertOptions, cmd?: any) {
  const logger = createLogger(options.logFormat || "text");

  try {
    const queryVal = options.query || cmd?.parent?.opts()?.query;
    const queryFileVal = options.queryFile || cmd?.parent?.opts()?.queryFile;
    const query = resolveQuery(queryVal, queryFileVal);
    const invertedQuery = invert(query);

    if (options.out) {
      const destDir = path.dirname(options.out);
      if (!existsSync(destDir)) {
        await fs.mkdir(destDir, { recursive: true });
      }
      await fs.writeFile(options.out, invertedQuery, "utf8");
      logger.info(`Successfully inverted query and wrote to ${options.out}`);
    } else {
      process.stdout.write(invertedQuery + "\n");
    }
  } catch (error: any) {
    logger.error(`Error during query inversion: ${error.message}`);
    process.exit(1);
  }
}
