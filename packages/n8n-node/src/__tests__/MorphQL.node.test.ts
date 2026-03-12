import { describe, it, expect, vi } from 'vitest';
import { MorphQL } from '../MorphQL.node';

describe('MorphQL Node', () => {
    it('should be defined', () => {
        const node = new MorphQL();
        expect(node.description.name).toBe('morphQL');
    });

    it('should have the correct properties', () => {
        const node = new MorphQL();
        const queryProp = node.description.properties.find(p => p.name === 'query');
        expect(queryProp).toBeDefined();
        expect(queryProp?.type).toBe('string');
    });
});
