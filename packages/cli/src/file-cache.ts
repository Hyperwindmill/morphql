import { MQLCache } from "@morphql/core";
import * as fs from "node:fs";
import * as path from "node:path";
import { createHash } from "node:crypto";

export class MQLFileCache implements MQLCache {
  private cacheDir: string;

  constructor(cacheDir: string = ".compiled") {
    this.cacheDir = path.resolve(process.cwd(), cacheDir);
  }

  async retrieve(query: string): Promise<string | null> {
    try {
      const hash = this.getHash(query);
      const filePath = path.join(this.cacheDir, `morph_${hash}.js`);

      if (fs.existsSync(filePath)) {
        return fs.promises.readFile(filePath, "utf8");
      }
    } catch (err) {
      // Ignore errors (e.g., file permissions, directory missing)
    }
    return null;
  }

  async save(query: string, code: string): Promise<void> {
    try {
      if (!fs.existsSync(this.cacheDir)) {
        fs.mkdirSync(this.cacheDir, { recursive: true });
      }

      const hash = this.getHash(query);
      const filePath = path.join(this.cacheDir, `morph_${hash}.js`);

      const content = `/* 
Query:
${query}
*/

${code}`;

      await fs.promises.writeFile(filePath, content, "utf8");
    } catch (err) {
      // Ignore save errors
    }
  }

  private getHash(content: string): string {
    return createHash("sha256").update(content).digest("hex").substring(0, 12);
  }
}
