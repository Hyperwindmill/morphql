import { describe, it, expect } from 'vitest';
import { compile, morphQL } from '../index.js';

describe('Subquery Sections', () => {
  it('should parse XML to object in a section', async () => {
    const query = morphQL`
      from json to object
      transform
        section metadata(
          from xml to object
          transform
            set name = root.productName
            set price = number(root.cost)
        ) from xmlString
    `;
    const transform = await compile(query);

    const source = {
      xmlString: '<root><productName>Widget</productName><cost>29.99</cost></root>',
    };

    const result = transform(source);

    expect(result).toEqual({
      metadata: {
        name: 'Widget',
        price: 29.99,
      },
    });
  });

  it('should serialize object to XML in a section', async () => {
    const query = morphQL`
      from json to object
      transform
        section xmlData(
          from object to xml
          transform
            set name = productName
            set price = productPrice
        ) from productData
    `;
    const transform = await compile(query);

    const source = {
      productData: {
        productName: 'Widget',
        productPrice: 29.99,
      },
    };

    const result = transform(source);

    expect(result.xmlData).toContain('<name>Widget</name>');
    expect(result.xmlData).toContain('<price>29.99</price>');
  });

  it('should serialize object to XML with custom root name', async () => {
    const query = morphQL`
      from json to object
      transform
        section xmlOutput(
          from object to xml("product")
          transform
            set name = productName
            set price = productPrice
        ) from data
    `;
    const transform = await compile(query);

    const source = {
      data: {
        productName: 'Widget',
        productPrice: 29.99,
      },
    };

    const result = transform(source);

    expect(result.xmlOutput).toContain('<product>');
    expect(result.xmlOutput).toContain('</product>');
    expect(result.xmlOutput).toContain('<name>Widget</name>');
  });

  it('should handle pure format conversion (no transform)', async () => {
    const query = morphQL`
      from json to object
      transform
        section xmlOutput(
          from object to xml
        ) from data
    `;
    const transform = await compile(query);

    const source = {
      data: {
        name: 'Widget',
        price: 29.99,
      },
    };

    const result = transform(source);

    expect(result.xmlOutput).toContain('<name>Widget</name>');
    expect(result.xmlOutput).toContain('<price>29.99</price>');
  });

  it('should handle multiple (array) subquery sections', async () => {
    const query = morphQL`
      from json to object
      transform
        section multiple items(
          from xml to object
          transform
            set name = product.name
            set price = number(product.cost)
        ) from xmlItems
    `;
    const transform = await compile(query);

    const source = {
      xmlItems: [
        '<product><name>Widget</name><cost>29.99</cost></product>',
        '<product><name>Gadget</name><cost>19.99</cost></product>',
      ],
    };

    const result = transform(source);

    expect(result.items).toHaveLength(2);
    expect(result.items[0]).toEqual({ name: 'Widget', price: 29.99 });
    expect(result.items[1]).toEqual({ name: 'Gadget', price: 19.99 });
  });

  it('should parse JSON string to object in a section', async () => {
    const query = morphQL`
      from json to object
      transform
        section userData(
          from json to object
          transform
            set userId = id
            set userName = name
        ) from jsonString
    `;
    const transform = await compile(query);

    const source = {
      jsonString: '{"id": 123, "name": "Alice"}',
    };

    const result = transform(source);

    expect(result).toEqual({
      userData: {
        userId: 123,
        userName: 'Alice',
      },
    });
  });

  it('should work with nested sections', async () => {
    const query = morphQL`
      from json to object
      transform
        section order(
          set orderId = id
          section metadata(
            from xml to object
            transform
              set name = root.productName
          ) from xmlData
        )
    `;
    const transform = await compile(query);

    const source = {
      order: {
        id: 'ORD-123',
        xmlData: '<root><productName>Widget</productName></root>',
      },
    };

    const result = transform(source);

    expect(result).toEqual({
      order: {
        orderId: 'ORD-123',
        metadata: {
          name: 'Widget',
        },
      },
    });
  });

  it('should serialize object to JSON string in a section', async () => {
    const query = morphQL`
      from json to object
      transform
        section jsonOutput(
          from object to json
          transform
            set id = userId
            set name = userName
        ) from userData
    `;
    const transform = await compile(query);

    const source = {
      userData: {
        userId: 123,
        userName: 'Alice',
      },
    };

    const result = transform(source);

    expect(result.jsonOutput).toBeTruthy();
    const parsed = JSON.parse(result.jsonOutput);
    expect(parsed).toEqual({
      id: 123,
      name: 'Alice',
    });
  });
});
