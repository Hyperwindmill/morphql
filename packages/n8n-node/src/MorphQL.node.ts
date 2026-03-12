import {
	IDataObject,
	IExecuteFunctions,
	IGetNodeOutputSchemaFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { compile, SchemaNode } from '@morphql/core';

function morphToSchema(node: SchemaNode): any {
	const schema: any = { type: node.type === 'any' ? 'object' : node.type };
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

export class MorphQL implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'MorphQL',
		name: 'morphQL',
		icon: 'file:morphql.svg',
		group: ['transform'],
		version: 1,
		description: 'Transform data using MorphQL declarative queries',
		defaults: {
			name: 'MorphQL',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				typeOptions: {
					rows: 5,
				},
				default: 'from object to object\ntransform\n  set newField = existingField',
				placeholder: 'from object to object transform ...',
				description: 'The MorphQL query to execute',
				required: true,
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Analyze Schema',
						name: 'analyze',
						type: 'boolean',
						default: true,
						description: 'Whether to analyze the query schema for hinting',
					},
				],
			},
		],
	};

	methods = {
		async getOutputSchema(
			this: IGetNodeOutputSchemaFunctions,
		): Promise<any> {
			const query = this.getNodeParameter('query') as string;
			const options = this.getNodeParameter('options') as IDataObject;

			if (!query || options.analyze === false) {
				return null;
			}

			try {
				const morph = await compile(query, { analyze: true });
				if (morph.analysis?.target) {
					return morphToSchema(morph.analysis.target);
				}
			} catch (e) {
				// Silent failure for schema detection
			}
			return null;
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const query = this.getNodeParameter('query', 0) as string;
		const options = this.getNodeParameter('options', 0) as IDataObject;

		const morph = await compile(query, { analyze: options.analyze as boolean });

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
							error: (error as Error).message,
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

		return [returnData];
	}
}
