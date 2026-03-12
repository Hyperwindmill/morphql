import { describe, it, expect, vi } from 'vitest';
import { MorphQL } from '../MorphQLTransform';

describe('MorphQL Node', () => {
    it('should be defined', () => {
        const node = new MorphQL();
        expect(node.description.name).toBe('morphQL');
    });

    it('should have the correct properties', () => {
        const node = new MorphQL();
        const queryProp = node.description.properties.find((p: any) => p.name === 'query');
        expect(queryProp).toBeDefined();
        expect(queryProp?.type).toBe('string');
    });

    it('should generate output schema', async () => {
        const node = new MorphQL();
        const mockExecuteFunctions = {
            getNodeParameter: vi.fn().mockImplementation((name) => {
                if (name === 'query') return 'from object to object transform set a = 1';
                if (name === 'options') return { analyze: true };
            }),
        } as any;

        const schema = await node.getOutputSchema.call(mockExecuteFunctions);
        expect(schema).toBeDefined();
        expect(schema.properties).toHaveProperty('a');
    });

    it('should execute transformation', async () => {
        const node = new MorphQL();
        const mockExecuteFunctions = {
            getInputData: vi.fn().mockReturnValue([{ json: { x: 10 } }]),
            getNodeParameter: vi.fn().mockImplementation((name) => {
                if (name === 'query') return 'from object to object transform set y = x * 2';
                if (name === 'options') return { analyze: true };
            }),
            continueOnFail: vi.fn().mockReturnValue(false),
        } as any;

        const result = await node.execute.call(mockExecuteFunctions);
        expect(result[0][0].json).toEqual({ y: 20 });
    });
});
