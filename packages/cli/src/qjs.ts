import { compile } from "@morphql/core";

// QuickJS modules are available via global 'std' and 'os' when using --std flag
declare const std: any;

const args =
  (globalThis as any).scriptArgs || (globalThis as any).os?.args || [];

/**
 * Minimal polyfill for Base64 (needed by some core functions)
 */
if (typeof btoa === "undefined") {
  (globalThis as any).btoa = (str: string) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    let output = "";
    for (
      let block = 0, charCode, i = 0, map = chars;
      str.charAt(i | 0) || ((map = "="), i % 1);
      output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
    ) {
      charCode = str.charCodeAt((i += 3 / 4));
      if (charCode > 0xff) {
        throw new Error(
          "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.",
        );
      }
      block = (block << 8) | charCode;
    }
    return output;
  };
}

if (typeof atob === "undefined") {
  (globalThis as any).atob = (input: string) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    const str = input.replace(/[=]+$/, "");
    let output = "";
    if (str.length % 4 === 1) {
      throw new Error(
        "'atob' failed: The string to be decoded is not correctly encoded.",
      );
    }
    for (
      let bc = 0, bs = 0, buffer, i = 0;
      (buffer = str.charAt(i++));
      ~buffer && ((bc = bc % 4), (bs = bs % 4))
        ? (output += String.fromCharCode(255 & (bc >> ((-2 * bs) & 6))))
        : 0
    ) {
      buffer = chars.indexOf(buffer);
    }
    return output;
  };
}

// Polyfill for Buffer (minimal needed by functions.ts if not available)
if (typeof Buffer === "undefined") {
  (globalThis as any).Buffer = {
    from: (str: string, encoding: string) => {
      if (encoding === "base64") {
        return {
          toString: (enc: string) => (enc === "utf-8" ? atob(str) : ""),
        };
      }
      return {
        toString: (enc: string) => (enc === "base64" ? btoa(str) : ""),
      };
    },
  };
}

async function main() {
  const options: Record<string, string> = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "-q" || arg === "--query") options.query = args[++i];
    if (arg === "-Q" || arg === "--query-file") options.queryFile = args[++i];
    if (arg === "-i" || arg === "--input") options.input = args[++i];
    if (arg === "-f" || arg === "--from") options.from = args[++i];
    if (arg === "-t" || arg === "--to") options.to = args[++i];
    if (arg === "--cache-dir") options.cacheDir = args[++i];
  }

  try {
    let query = options.query;
    if (!query && options.queryFile) {
      query = std.loadFile(options.queryFile);
    }

    if (!query) {
      std.err.printf("Error: No query provided (-q or -Q)\n");
      std.exit(1);
    }

    let sourceContent = options.input;
    if (!sourceContent && options.from) {
      sourceContent = std.loadFile(options.from);
    }

    if (!sourceContent) {
      // Try reading from stdin
      sourceContent = std.in.readAsString();
    }

    if (!sourceContent) {
      std.err.printf("Error: No input provided (-i, -f or stdin)\n");
      std.exit(1);
    }

    const engine = await compile(query);
    const result = await engine(sourceContent);

    if (options.to) {
      const f = std.open(options.to, "w");
      f.puts(result);
      f.close();
    } else {
      std.out.puts(result + "\n");
    }

    std.exit(0);
  } catch (e: any) {
    std.err.printf("Error: %s\n", e.message);
    std.exit(1);
  }
}

main();
