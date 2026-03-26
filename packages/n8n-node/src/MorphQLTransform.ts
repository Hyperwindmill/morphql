import {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from "n8n-workflow";
import { compile, SchemaNode } from "@morphql/core";

const VERSION = "0.1.37";

function morphToSchema(node: SchemaNode): any {
  const schema: any = { type: node.type === "any" ? "object" : node.type };
  if (node.properties) {
    schema.properties = {};
    for (const [key, subNode] of Object.entries(node.properties)) {
      schema.properties[key] = morphToSchema(subNode);
    }
  }
  if (node.items) {
    schema.items = morphToSchema(node.items);
  }
  return schema;
}

interface ServerResponse {
  success: boolean;
  result?: any;
  message?: string;
  error?: string;
}

async function executeServerQuery(
  executeFunctions: IExecuteFunctions,
  serverUrl: string,
  apiKey: string | undefined,
  queryType: "inline" | "staged",
  query: string | undefined,
  queryName: string | undefined,
  data: IDataObject,
): Promise<any> {
  let endpoint: string;
  let body: IDataObject;

  if (queryType === "inline") {
    endpoint = `${serverUrl.replace(/\/$/, "")}/v1/execute`;
    body = {
      query,
      data,
    };
  } else {
    if (!queryName) {
      throw new Error("Query name is required for staged queries");
    }
    endpoint = `${serverUrl.replace(/\/$/, "")}/v1/q/${encodeURIComponent(queryName)}`;
    body = {
      data,
    };
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (apiKey) {
    headers["X-API-KEY"] = apiKey;
  }

  const response = await executeFunctions.helpers.httpRequest({
    method: "POST",
    url: endpoint,
    headers,
    body,
    json: true,
  });

  const serverResponse = response as ServerResponse;

  if (!serverResponse.success) {
    throw new Error(
      serverResponse.error || serverResponse.message || "Server request failed",
    );
  }

  return serverResponse.result;
}

export class MorphQLTransform implements INodeType {
  description: INodeTypeDescription = {
    displayName: "MorphQL",
    name: "morphQL",
    icon: "file:morphql.svg",
    group: ["transform"],
    version: 1,
    description: "Transform data using MorphQL declarative queries",
    subtitle:
      '={{$parameter.mode === "server" ? "Server: " + $parameter.queryType : "Local"}}',
    codex: {
      categories: ["Data Transformation"],
    },
    defaults: {
      name: "MorphQL",
    },
    inputs: ["main"],
    outputs: ["main"],
    credentials: [
      {
        name: "morphqlServerApi",
        required: true,
        displayOptions: {
          show: {
            mode: ["server"],
          },
        },
      },
    ],
    properties: [
      {
        displayName: "Mode",
        name: "mode",
        type: "options",
        options: [
          { name: "Local", value: "local" },
          { name: "Server", value: "server" },
        ],
        default: "local",
        description:
          "Whether to execute queries locally or connect to a remote MorphQL server",
      },
      {
        displayName: "Query Type",
        name: "queryType",
        type: "options",
        options: [
          { name: "Inline", value: "inline" },
          { name: "Staged", value: "staged" },
        ],
        default: "inline",
        description:
          "Whether to use an inline query or a staged query from the server",
        displayOptions: {
          show: {
            mode: ["server"],
          },
        },
      },
      {
        displayName: "Query",
        name: "query",
        type: "string",
        typeOptions: {
          rows: 5,
        },
        default:
          "from object to object\ntransform\n  set newField = existingField",
        placeholder: "from object to object transform ...",
        description: "The MorphQL query to execute",
        required: true,
        displayOptions: {
          show: {
            mode: ["local"],
          },
        },
      },
      {
        displayName: "Query",
        name: "serverQuery",
        type: "string",
        typeOptions: {
          rows: 5,
        },
        default: "",
        placeholder: "from object to object transform ...",
        description: "The MorphQL query to execute on the server",
        displayOptions: {
          show: {
            mode: ["server"],
            queryType: ["inline"],
          },
        },
      },
      {
        displayName: "Query Name",
        name: "queryName",
        type: "string",
        default: "",
        placeholder: "my-staged-query",
        description: "The name of the staged query to execute on the server",
        displayOptions: {
          show: {
            mode: ["server"],
            queryType: ["staged"],
          },
        },
      },
      {
        displayName: "Options",
        name: "options",
        type: "collection",
        placeholder: "Add Option",
        default: {},
        displayOptions: {
          show: {
            mode: ["local"],
          },
        },
        options: [
          {
            displayName: "Analyze Schema",
            name: "analyze",
            type: "boolean",
            default: true,
            description: "Whether to analyze the query schema for hinting",
          },
        ],
      },
    ],
  };

  async getOutputSchema(this: IExecuteFunctions): Promise<any> {
    const mode = this.getNodeParameter("mode", 0) as string;

    if (mode === "server") {
      return null;
    }

    const query = this.getNodeParameter("query", 0) as string;
    const options = this.getNodeParameter("options", 0) as IDataObject;

    if (options.analyze === false) {
      return null;
    }

    try {
      const engine = await compile(query, { analyze: true });
      if (engine.analysis?.target) {
        return morphToSchema(engine.analysis.target);
      }
    } catch (e) {
      return null;
    }
    return null;
  }

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const mode = this.getNodeParameter("mode", 0) as string;

    if (mode === "server") {
      const queryType = this.getNodeParameter("queryType", 0) as
        | "inline"
        | "staged";
      const credentials = await this.getCredentials("morphqlServerApi");
      const serverUrl = credentials.serverUrl as string;
      const apiKey = credentials.apiKey as string | undefined;

      let query: string | undefined;
      let queryName: string | undefined;

      if (queryType === "inline") {
        query = this.getNodeParameter("serverQuery", 0) as string;
      } else {
        queryName = this.getNodeParameter("queryName", 0) as string;
      }

      for (let i = 0; i < items.length; i++) {
        try {
          const inputData = items[i].json;
          const transformed = await executeServerQuery(
            this,
            serverUrl,
            apiKey,
            queryType,
            query,
            queryName,
            inputData,
          );

          returnData.push({
            json: transformed as IDataObject,
            pairedItem: {
              item: i,
            },
          });
        } catch (error: any) {
          if (this.continueOnFail()) {
            returnData.push({
              json: {
                error: `Server execution error at item ${i}: ${error.message}`,
              },
              pairedItem: {
                item: i,
              },
            });
            continue;
          }
          throw error;
        }
      }
    } else {
      const query = this.getNodeParameter("query", 0) as string;
      const options = this.getNodeParameter("options", 0) as IDataObject;

      let morph: any;
      try {
        morph = await compile(query, { analyze: options.analyze as boolean });
      } catch (error: any) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: `Compilation error: ${error.message}`,
            },
          });
          return [returnData];
        }
        throw error;
      }

      for (let i = 0; i < items.length; i++) {
        try {
          const inputData = items[i].json;
          const transformed = morph(inputData);

          returnData.push({
            json: transformed as IDataObject,
            pairedItem: {
              item: i,
            },
          });
        } catch (error: any) {
          if (this.continueOnFail()) {
            returnData.push({
              json: {
                error: `Execution error at item ${i}: ${error.message}`,
              },
              pairedItem: {
                item: i,
              },
            });
            continue;
          }
          throw error;
        }
      }
    }

    return [returnData];
  }
}
