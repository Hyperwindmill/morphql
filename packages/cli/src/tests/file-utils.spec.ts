import { describe, it, expect } from "vitest";
import * as path from "node:path";
import {
  matchesPattern,
  extractTargetFormat,
  resolveOutputPath,
  formatToExtension,
  resolveQuery,
} from "../file-utils.js";
import * as fs from "node:fs";
import * as os from "node:os";

describe("file-utils", () => {
  describe("matchesPattern", () => {
    it("should match simple patterns", () => {
      expect(matchesPattern("file.json", "*.json")).toBe(true);
      expect(matchesPattern("file.json", "file.json")).toBe(true);
      expect(matchesPattern("other.xml", "*.json")).toBe(false);
    });

    it("should skip dotfiles by default", () => {
      expect(matchesPattern(".env", "*")).toBe(false);
      expect(matchesPattern(".gitignore", "*")).toBe(false);
      expect(matchesPattern("normal.json", "*")).toBe(true);
    });

    it("should match dotfiles if pattern explicitly starts with a dot", () => {
      expect(matchesPattern(".env", ".*")).toBe(true);
      expect(matchesPattern(".test.json", ".*.json")).toBe(true);
    });

    it("should support ? wildcard", () => {
      expect(matchesPattern("file1.json", "file?.json")).toBe(true);
      expect(matchesPattern("file12.json", "file?.json")).toBe(false);
    });
  });

  describe("extractTargetFormat", () => {
    it('should extract format from "to format"', () => {
      expect(extractTargetFormat("from json to xml")).toBe("xml");
      expect(extractTargetFormat("from xml to csv transform...")).toBe("csv");
    });

    it("should default to json if not found", () => {
      expect(extractTargetFormat("from json select *")).toBe("json");
    });

    it("should be case insensitive", () => {
      expect(extractTargetFormat("FROM json TO XML")).toBe("XML");
    });
  });

  describe("formatToExtension", () => {
    it("should map formats to extensions", () => {
      expect(formatToExtension("json")).toBe(".json");
      expect(formatToExtension("xml")).toBe(".xml");
      expect(formatToExtension("csv")).toBe(".csv");
      expect(formatToExtension("edifact")).toBe(".edi");
      expect(formatToExtension("plaintext")).toBe(".txt");
      expect(formatToExtension("object")).toBe(".json");
    });
  });

  describe("resolveOutputPath", () => {
    it("should maintain directory structure and change extension", () => {
      const input = "/in/sub/file.xml";
      const inDir = "/in";
      const outDir = "/out";
      const format = "json";

      const result = resolveOutputPath(input, inDir, outDir, format);
      // Normalized for cross-platform
      expect(result.replace(/\\/g, "/")).toContain("/out/sub/file.json");
    });
  });

  describe("resolveQuery", () => {
    it("should return inline query if provided", () => {
      expect(resolveQuery("from json to xml", undefined)).toBe(
        "from json to xml",
      );
    });

    it("should read from file if query-file is provided", () => {
      const tmpFile = path.join(os.tmpdir(), `query_${Date.now()}.mql`);
      fs.writeFileSync(tmpFile, "from xml to json", "utf8");

      try {
        expect(resolveQuery(undefined, tmpFile)).toBe("from xml to json");
      } finally {
        fs.unlinkSync(tmpFile);
      }
    });

    it("should throw if neither is provided", () => {
      expect(() => resolveQuery(undefined, undefined)).toThrow();
    });

    it("should throw if query file does not exist", () => {
      expect(() => resolveQuery(undefined, "non-existent.mql")).toThrow();
    });
  });
});
