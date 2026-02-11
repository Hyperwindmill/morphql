import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { watchAction } from "../watch.js";

describe("watch mode", () => {
  let tmpDir: string;
  let inDir: string;
  let outDir: string;
  let cacheDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "morphql-watch-test-"));
    inDir = path.join(tmpDir, "in");
    outDir = path.join(tmpDir, "out");
    cacheDir = path.join(tmpDir, ".compiled");

    fs.mkdirSync(inDir);
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  it("should detect and process new files", async () => {
    const originalExit = process.exit;
    (process.exit as any) = (code: number) => {
      if (code !== 0 && code !== 1) originalExit(code);
    };

    try {
      const watchPromise = watchAction({
        query: "from json to json transform set watched = true",
        in: inDir,
        out: outDir,
        pattern: "*.json",
        cacheDir,
        logFormat: "text",
      });

      await sleep(200);

      const inputFile = path.join(inDir, "new.json");
      fs.writeFileSync(inputFile, JSON.stringify({ hello: "world" }));

      await sleep(500);

      const outputFile = path.join(outDir, "new.json");
      expect(fs.existsSync(outputFile)).toBe(true);

      const result = JSON.parse(fs.readFileSync(outputFile, "utf8"));
      expect(result.watched).toBe(true);

      process.emit("SIGINT" as any);
      await watchPromise;
    } finally {
      process.exit = originalExit;
    }
  });

  it("should ignore non-matching files", async () => {
    const originalExit = process.exit;
    (process.exit as any) = (code: number) => {
      if (code !== 0 && code !== 1) originalExit(code);
    };

    try {
      const watchPromise = watchAction({
        query: "from json to json",
        in: inDir,
        out: outDir,
        pattern: "*.json",
        cacheDir,
        logFormat: "text",
      });

      await sleep(200);

      fs.writeFileSync(path.join(inDir, "ignore.txt"), "ignore me");
      await sleep(500);

      expect(fs.existsSync(path.join(outDir, "ignore.txt"))).toBe(false);

      process.emit("SIGINT" as any);
      await watchPromise;
    } finally {
      process.exit = originalExit;
    }
  });

  it("should delete source file after success if --delete is provided", async () => {
    const originalExit = process.exit;
    (process.exit as any) = (code: number) => {
      if (code !== 0 && code !== 1) originalExit(code);
    };

    try {
      const watchPromise = watchAction({
        query: "from json to json",
        in: inDir,
        out: outDir,
        pattern: "*.json",
        delete: true,
        cacheDir,
        logFormat: "text",
      });

      await sleep(200);

      const inputFile = path.join(inDir, "delete-me.json");
      fs.writeFileSync(inputFile, JSON.stringify({ hello: "world" }));

      await sleep(500);

      expect(fs.existsSync(path.join(outDir, "delete-me.json"))).toBe(true);
      expect(fs.existsSync(inputFile)).toBe(false);

      process.emit("SIGINT" as any);
      await watchPromise;
    } finally {
      process.exit = originalExit;
    }
  });
});
