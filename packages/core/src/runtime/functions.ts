export const runtimeFunctions = {
  /**
   * Transforms tabular data (array of objects with A, B, C... keys) into
   * an array of objects where keys are taken from the first row.
   */
  spreadsheet: (data: any) => {
    // console.log('SPREADSHEET INPUT:', JSON.stringify(data));
    let sheet = Array.isArray(data) ? data : data == null ? [] : [data];
    if (!Array.isArray(data) && data && typeof data === 'object' && Array.isArray(data.rows)) {
      sheet = data.rows;
    }
    if (sheet.length === 0) return [];

    const result: any[] = [];
    const titles: string[] = [];
    let propertyKeys: string[] = [];

    for (let i = 0; i < sheet.length; i++) {
      const line = sheet[i];
      if (!line || typeof line !== 'object') continue;

      if (i === 0) {
        // First row contains the headers (titles)
        propertyKeys = Object.keys(line);
        for (const k of propertyKeys) {
          titles.push(String(line[k]));
        }
      } else {
        // Subsequent rows contain data mapped from property keys to titles
        const rowObject: any = {};
        for (let j = 0; j < propertyKeys.length; j++) {
          const key = propertyKeys[j];
          const title = titles[j];
          rowObject[title] = line[key];
        }
        result.push(rowObject);
      }
    }
    // console.log('SPREADSHEET RESULT:', JSON.stringify(result));
    return result;
  },

  /**
   * Ensures the value is an array.
   */
  aslist: (val: any) => {
    return Array.isArray(val) ? val : val == null ? [] : [val];
  },

  /**
   * Encodes a string to Base64 (isomorphic).
   */
  to_base64: (val: any) => {
    const str = String(val);
    if (typeof btoa === 'function') {
      return btoa(unescape(encodeURIComponent(str)));
    }
    return Buffer.from(str, 'utf-8').toString('base64');
  },

  /**
   * Decodes a Base64 string (isomorphic).
   */
  from_base64: (val: any) => {
    const str = String(val);
    if (typeof atob === 'function') {
      return decodeURIComponent(escape(atob(str)));
    }
    return Buffer.from(str, 'base64').toString('utf-8');
  },

  /**
   * Builds an object compatible with the XML adapter's expected structure.
   */
  xmlnode: (value: any, ...attributesList: any[]) => {
    if (attributesList.length > 0) {
      const pairs: [string, any][] = [];
      for (let i = 0; i < attributesList.length; i += 2) {
        pairs.push([attributesList[i], attributesList[i + 1]]);
      }

      const builtAttrs = pairs.map(([key, val]) => [`$${key}`, val]);
      const attrsObj = Object.fromEntries(builtAttrs);
      return { _: value, ...attrsObj };
    }
    return value;
  },

  /**
   * Unpacks a fixed-width string into an object based on field specifications.
   * Specs: "name:start:length[:modifier]"
   */
  unpack: (str: any, ...specs: string[]) => {
    const input = String(str || '');
    const result: any = {};

    for (const spec of specs) {
      const parts = spec.split(':');
      if (parts.length < 3) continue;

      const [name, startStr, lengthStr, modifier] = parts;
      const start = parseInt(startStr, 10);
      const length = parseInt(lengthStr, 10);

      if (isNaN(start) || isNaN(length)) continue;

      let extraction = input.substring(start, start + length);
      if (modifier !== 'raw') {
        extraction = extraction.trim();
      }
      result[name] = extraction;
    }
    return result;
  },

  /**
   * Packs an object into a fixed-width string based on field specifications.
   * Specs: "name:start:length[:modifier]"
   */
  pack: (obj: any, ...specs: string[]) => {
    const targetObj = obj || {};

    const fields = specs
      .map((spec) => {
        const parts = spec.split(':');
        if (parts.length < 3) return null;
        const [name, startStr, lengthStr, modifier] = parts;
        return {
          name,
          start: parseInt(startStr, 10),
          length: parseInt(lengthStr, 10),
          left: modifier === 'left',
        };
      })
      .filter((f): f is NonNullable<typeof f> => f !== null);

    const totalWidth = fields.reduce((max, f) => Math.max(max, f.start + f.length), 0);
    let line = ' '.repeat(totalWidth);

    for (const f of fields) {
      const val = String(targetObj[f.name] ?? '');
      const padded = f.left ? val.padStart(f.length) : val.padEnd(f.length);
      const truncated = padded.substring(0, f.length);

      line = line.substring(0, f.start) + truncated + line.substring(f.start + f.length);
    }

    return line;
  },

  /**
   * Concatenates two or more arrays.
   */
  concat: (...args: any[]) => {
    return args.reduce(
      (acc, val) => acc.concat(Array.isArray(val) ? val : val == null ? [] : [val]),
      []
    );
  },

  /**
   * Transposes parallel arrays from a source object into an array of objects.
   * Signature: transpose(source, ...keys)
   * Example: transpose(src, "A", "B") -> [{ A: src.A[0], B: src.B[0] }, ...]
   */
  transpose: (source: any, ...keys: string[]) => {
    if (!source || typeof source !== 'object' || keys.length === 0) return [];

    let maxLen = 0;
    for (const key of keys) {
      const val = source[key];
      if (Array.isArray(val)) {
        maxLen = Math.max(maxLen, val.length);
      } else if (val != null) {
        maxLen = Math.max(maxLen, 1);
      }
    }

    const result = [];
    for (let i = 0; i < maxLen; i++) {
      const row: any = {};
      for (const key of keys) {
        const val = source[key];
        if (Array.isArray(val)) {
          row[key] = val[i];
        } else {
          row[key] = i === 0 ? val : undefined;
        }
      }
      result.push(row);
    }
    return result;
  },
};
