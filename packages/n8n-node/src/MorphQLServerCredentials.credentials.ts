import { ICredentialType, INodeProperties } from "n8n-workflow";

export class MorphQLServerCredentials implements ICredentialType {
  name = "morphqlServerApi";
  displayName = "MorphQL Server API";
  properties: INodeProperties[] = [
    {
      displayName: "Server URL",
      name: "serverUrl",
      type: "string",
      default: "http://localhost:3000",
      description: "The URL of the MorphQL server",
      required: true,
    },
    {
      displayName: "API Key",
      name: "apiKey",
      type: "string",
      typeOptions: {
        password: true,
      },
      default: "",
      description: "Optional API key for authentication",
      required: false,
    },
  ];

  test = {
    request: {
      method: "GET" as const,
      url: "={{$credentials.serverUrl}}/v1/health",
      headers: {
        "X-API-KEY": "={{$credentials.apiKey}}",
      },
    },
    rules: [
      {
        type: "responseCode" as const,
        properties: {
          value: 200,
          message: "Connection successful",
        },
      },
    ],
  };
}
