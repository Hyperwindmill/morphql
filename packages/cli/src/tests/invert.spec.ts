import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { execSync } from "node:child_process";
import { invertAction } from "../invert.js";

describe("invert subcommand", () => {
  let tmpDir: string;
  let queryFile: string;
  let outFile: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "morphql-invert-test-"));
    queryFile = path.join(tmpDir, "query.morphql");
    outFile = path.join(tmpDir, "query-inverse.morphql");
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("should invert inline query and print to console or write to file", async () => {
    const query = "from json to xml transform set id = orderId";

    // Test writing to file
    await invertAction({
      query,
      out: outFile,
      logFormat: "text",
    });

    expect(fs.existsSync(outFile)).toBe(true);
    const content = fs.readFileSync(outFile, "utf8");
    expect(content).toContain("from xml to json");
    expect(content).toContain("set orderId = id");
  });

  it("should read query from file, invert it, and write to output file", async () => {
    fs.writeFileSync(
      queryFile,
      "from json to xml\ntransform\n  section items(\n    set val = raw\n  ) from orderItems",
      "utf8"
    );

    await invertAction({
      queryFile,
      out: outFile,
      logFormat: "text",
    });

    expect(fs.existsSync(outFile)).toBe(true);
    const content = fs.readFileSync(outFile, "utf8");
    expect(content).toContain("from xml to json");
    expect(content).toContain("section orderItems(");
    expect(content).toContain("set raw = val");
    expect(content).toContain(") from items");
  });

  it("should run morphql invert CLI command end-to-end", () => {
    const binPath = path.resolve(process.cwd(), "packages/cli/bin/morphql.js");
    const result = execSync(
      `node ${binPath} invert -q "from json to xml transform set id = orderId"`
    ).toString();
    expect(result).toContain("from xml to json");
    expect(result).toContain("set orderId = id");
  });
});
