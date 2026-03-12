import { describe, it, expect, vi } from "vitest";
import { MorphQLTransform } from "../MorphQLTransform";

describe("MorphQL Node", () => {
  it("should be defined", () => {
    const node = new MorphQLTransform();
    expect(node.description.name).toBe("morphQL");
  });

  it("should have the correct properties", () => {
    const node = new MorphQLTransform();
    const queryProp = node.description.properties.find(
      (p: any) => p.name === "query",
    );
    expect(queryProp).toBeDefined();
    expect(queryProp?.type).toBe("string");
  });

  it("should have mode property with local and server options", () => {
    const node = new MorphQLTransform();
    const modeProp = node.description.properties.find(
      (p: any) => p.name === "mode",
    );
    expect(modeProp).toBeDefined();
    expect(modeProp?.type).toBe("options");
    expect(modeProp?.options).toEqual([
      { name: "Local", value: "local" },
      { name: "Server", value: "server" },
    ]);
    expect(modeProp?.default).toBe("local");
  });

  it("should have credentials configured for server mode", () => {
    const node = new MorphQLTransform();
    expect(node.description.credentials).toBeDefined();
    expect(node.description.credentials!).toHaveLength(1);
    expect(node.description.credentials![0].name).toBe(
      "MorphQLServerCredentials",
    );
  });

  it("should generate output schema for local mode", async () => {
    const node = new MorphQLTransform();
    const mockExecuteFunctions = {
      getNodeParameter: vi.fn().mockImplementation((name) => {
        if (name === "mode") return "local";
        if (name === "query")
          return "from object to object transform set a = 1";
        if (name === "options") return { analyze: true };
      }),
    } as any;

    const schema = await node.getOutputSchema.call(mockExecuteFunctions);
    expect(schema).toBeDefined();
    expect(schema.properties).toHaveProperty("a");
  });

  it("should return null output schema for server mode", async () => {
    const node = new MorphQLTransform();
    const mockExecuteFunctions = {
      getNodeParameter: vi.fn().mockImplementation((name) => {
        if (name === "mode") return "server";
      }),
    } as any;

    const schema = await node.getOutputSchema.call(mockExecuteFunctions);
    expect(schema).toBeNull();
  });

  it("should execute transformation in local mode", async () => {
    const node = new MorphQLTransform();
    const mockExecuteFunctions = {
      getInputData: vi.fn().mockReturnValue([{ json: { x: 10 } }]),
      getNodeParameter: vi.fn().mockImplementation((name) => {
        if (name === "mode") return "local";
        if (name === "query")
          return "from object to object transform set y = x * 2";
        if (name === "options") return { analyze: true };
      }),
      continueOnFail: vi.fn().mockReturnValue(false),
    } as any;

    const result = await node.execute.call(mockExecuteFunctions);
    expect(result[0][0].json).toEqual({ y: 20 });
  });
});

describe("MorphQL Server Mode", () => {
  it("should execute inline query on server", async () => {
    const node = new MorphQLTransform();
    const mockHttpRequest = vi.fn().mockResolvedValue({
      success: true,
      result: { transformed: "data" },
    });

    const mockExecuteFunctions = {
      getInputData: vi.fn().mockReturnValue([{ json: { input: "value" } }]),
      getNodeParameter: vi.fn().mockImplementation((name) => {
        if (name === "mode") return "server";
        if (name === "queryType") return "inline";
        if (name === "serverQuery") return "from object to object";
      }),
      getCredentials: vi.fn().mockResolvedValue({
        serverUrl: "https://api.example.com",
        apiKey: "test-key",
      }),
      helpers: {
        httpRequest: mockHttpRequest,
      },
      continueOnFail: vi.fn().mockReturnValue(false),
    } as any;

    const result = await node.execute.call(mockExecuteFunctions);

    expect(mockHttpRequest).toHaveBeenCalledWith({
      method: "POST",
      url: "https://api.example.com/v1/execute",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": "test-key",
      },
      body: {
        query: "from object to object",
        data: { input: "value" },
      },
      json: true,
    });
    expect(result[0][0].json).toEqual({ transformed: "data" });
  });

  it("should execute staged query on server", async () => {
    const node = new MorphQLTransform();
    const mockHttpRequest = vi.fn().mockResolvedValue({
      success: true,
      result: { result: "from-staged" },
    });

    const mockExecuteFunctions = {
      getInputData: vi.fn().mockReturnValue([{ json: { x: 5 } }]),
      getNodeParameter: vi.fn().mockImplementation((name) => {
        if (name === "mode") return "server";
        if (name === "queryType") return "staged";
        if (name === "queryName") return "my-query";
      }),
      getCredentials: vi.fn().mockResolvedValue({
        serverUrl: "https://api.example.com/",
        apiKey: undefined,
      }),
      helpers: {
        httpRequest: mockHttpRequest,
      },
      continueOnFail: vi.fn().mockReturnValue(false),
    } as any;

    const result = await node.execute.call(mockExecuteFunctions);

    expect(mockHttpRequest).toHaveBeenCalledWith({
      method: "POST",
      url: "https://api.example.com/v1/q/my-query",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        data: { x: 5 },
      },
      json: true,
    });
    expect(result[0][0].json).toEqual({ result: "from-staged" });
  });

  it("should handle server error", async () => {
    const node = new MorphQLTransform();
    const mockHttpRequest = vi.fn().mockResolvedValue({
      success: false,
      error: "Query not found",
    });

    const mockExecuteFunctions = {
      getInputData: vi.fn().mockReturnValue([{ json: {} }]),
      getNodeParameter: vi.fn().mockImplementation((name) => {
        if (name === "mode") return "server";
        if (name === "queryType") return "inline";
        if (name === "serverQuery") return "test query";
      }),
      getCredentials: vi.fn().mockResolvedValue({
        serverUrl: "https://api.example.com",
      }),
      helpers: {
        httpRequest: mockHttpRequest,
      },
      continueOnFail: vi.fn().mockReturnValue(false),
    } as any;

    await expect(node.execute.call(mockExecuteFunctions)).rejects.toThrow(
      "Query not found",
    );
  });

  it("should handle server error with continueOnFail", async () => {
    const node = new MorphQLTransform();
    const mockHttpRequest = vi.fn().mockResolvedValue({
      success: false,
      error: "Server error",
    });

    const mockExecuteFunctions = {
      getInputData: vi.fn().mockReturnValue([{ json: { test: 1 } }]),
      getNodeParameter: vi.fn().mockImplementation((name) => {
        if (name === "mode") return "server";
        if (name === "queryType") return "inline";
        if (name === "serverQuery") return "query";
      }),
      getCredentials: vi.fn().mockResolvedValue({
        serverUrl: "https://api.example.com",
      }),
      helpers: {
        httpRequest: mockHttpRequest,
      },
      continueOnFail: vi.fn().mockReturnValue(true),
    } as any;

    const result = await node.execute.call(mockExecuteFunctions);
    expect(result[0][0].json).toHaveProperty("error");
    expect(result[0][0].json.error).toContain("Server error");
  });

  it("should work without API key", async () => {
    const node = new MorphQLTransform();
    const mockHttpRequest = vi.fn().mockResolvedValue({
      success: true,
      result: { ok: true },
    });

    const mockExecuteFunctions = {
      getInputData: vi.fn().mockReturnValue([{ json: {} }]),
      getNodeParameter: vi.fn().mockImplementation((name) => {
        if (name === "mode") return "server";
        if (name === "queryType") return "inline";
        if (name === "serverQuery") return "test";
      }),
      getCredentials: vi.fn().mockResolvedValue({
        serverUrl: "https://api.example.com",
      }),
      helpers: {
        httpRequest: mockHttpRequest,
      },
      continueOnFail: vi.fn().mockReturnValue(false),
    } as any;

    await node.execute.call(mockExecuteFunctions);

    const callArgs = mockHttpRequest.mock.calls[0][0];
    expect(callArgs.headers).not.toHaveProperty("X-API-KEY");
  });

  it("should handle multiple items in server mode", async () => {
    const node = new MorphQLTransform();
    const mockHttpRequest = vi
      .fn()
      .mockResolvedValueOnce({ success: true, result: { item: 1 } })
      .mockResolvedValueOnce({ success: true, result: { item: 2 } });

    const mockExecuteFunctions = {
      getInputData: vi
        .fn()
        .mockReturnValue([{ json: { val: 1 } }, { json: { val: 2 } }]),
      getNodeParameter: vi.fn().mockImplementation((name) => {
        if (name === "mode") return "server";
        if (name === "queryType") return "inline";
        if (name === "serverQuery") return "test";
      }),
      getCredentials: vi.fn().mockResolvedValue({
        serverUrl: "https://api.example.com",
      }),
      helpers: {
        httpRequest: mockHttpRequest,
      },
      continueOnFail: vi.fn().mockReturnValue(false),
    } as any;

    const result = await node.execute.call(mockExecuteFunctions);
    expect(result[0]).toHaveLength(2);
    expect(result[0][0].json).toEqual({ item: 1 });
    expect(result[0][1].json).toEqual({ item: 2 });
  });
});
