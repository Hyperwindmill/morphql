import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { batchAction } from "../batch.js";

describe("batch mode", () => {
  let tmpDir: string;
  let inDir: string;
  let outDir: string;
  let doneDir: string;
  let errorDir: string;
  let cacheDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "morphql-batch-test-"));
    inDir = path.join(tmpDir, "in");
    outDir = path.join(tmpDir, "out");
    doneDir = path.join(tmpDir, "done");
    errorDir = path.join(tmpDir, "error");
    cacheDir = path.join(tmpDir, ".compiled");

    fs.mkdirSync(inDir);
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("should process matching files and output results", async () => {
    // Create input files
    fs.writeFileSync(
      path.join(inDir, "a.json"),
      JSON.stringify({ name: "Alice" }),
    );
    fs.writeFileSync(
      path.join(inDir, "b.json"),
      JSON.stringify({ name: "Bob" }),
    );
    fs.writeFileSync(path.join(inDir, "ignore.txt"), "ignore me");

    await batchAction({
      query: 'from json to json transform set greeting = "Hello " + name',
      in: inDir,
      out: outDir,
      pattern: "*.json",
      cacheDir,
      logFormat: "text",
    });

    expect(fs.existsSync(path.join(outDir, "a.json"))).toBe(true);
    expect(fs.existsSync(path.join(outDir, "b.json"))).toBe(true);
    expect(fs.existsSync(path.join(outDir, "ignore.txt"))).toBe(false);

    const resultA = JSON.parse(
      fs.readFileSync(path.join(outDir, "a.json"), "utf8"),
    );
    expect(resultA.greeting).toBe("Hello Alice");
  });

  it("should move files to done-dir on success", async () => {
    fs.writeFileSync(
      path.join(inDir, "file.json"),
      JSON.stringify({ ok: true }),
    );

    await batchAction({
      query: "from json to json",
      in: inDir,
      out: outDir,
      pattern: "*",
      doneDir,
      cacheDir,
      logFormat: "text",
    });

    expect(fs.existsSync(path.join(inDir, "file.json"))).toBe(false);
    expect(fs.existsSync(path.join(doneDir, "file.json"))).toBe(true);
    expect(fs.existsSync(path.join(outDir, "file.json"))).toBe(true);
  });

  it("should move failed files to error-dir", async () => {
    fs.writeFileSync(path.join(inDir, "bad.json"), "invalid json");

    // We expect the catch block in batchAction to handle errors per file
    // without crashing the whole process, but it exits with 1 at the end.
    // For testing, we might need to mock process.exit or check outputs.
    // But verify the file move first.

    // Mock process.exit to prevent test runner from exiting
    const originalExit = process.exit;
    (process.exit as any) = (code: number) => {
      if (code !== 0 && code !== 1) originalExit(code);
    };

    try {
      await batchAction({
        query: "from json to json",
        in: inDir,
        out: outDir,
        pattern: "*",
        errorDir,
        cacheDir,
        logFormat: "text",
      });
    } finally {
      process.exit = originalExit;
    }

    expect(fs.existsSync(path.join(inDir, "bad.json"))).toBe(false);
    expect(fs.existsSync(path.join(errorDir, "bad.json"))).toBe(true);
  });
});
