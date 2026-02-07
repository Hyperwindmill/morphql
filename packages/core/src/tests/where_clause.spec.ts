import { describe, it, expect } from 'vitest';
import { compile, morphQL } from '../index.js';

describe('Where Clause', () => {
  describe('section multiple with where', () => {
    it('should filter items with where clause', async () => {
      const engine = await compile(morphQL`
        from object to object
        transform
          section multiple activeUsers(
            set name = name
            set email = email
          ) from users where status == "active"
      `);

      const result = engine({
        users: [
          { name: 'Alice', email: 'alice@example.com', status: 'active' },
          { name: 'Bob', email: 'bob@example.com', status: 'inactive' },
          { name: 'Charlie', email: 'charlie@example.com', status: 'active' },
        ],
      });

      expect(result.activeUsers).toHaveLength(2);
      expect(result.activeUsers[0].name).toBe('Alice');
      expect(result.activeUsers[1].name).toBe('Charlie');
    });

    it('should filter with complex conditions', async () => {
      const engine = await compile(morphQL`
        from object to object
        transform
          section multiple expensiveItems(
            set productName = name
            set itemPrice = price
          ) from items where price > 50 && inStock == true
      `);

      const result = engine({
        items: [
          { name: 'Widget', price: 30, inStock: true },
          { name: 'Gadget', price: 100, inStock: true },
          { name: 'Gizmo', price: 80, inStock: false },
          { name: 'Thing', price: 60, inStock: true },
        ],
      });

      expect(result.expensiveItems).toHaveLength(2);
      expect(result.expensiveItems[0].productName).toBe('Gadget');
      expect(result.expensiveItems[1].productName).toBe('Thing');
    });

    it('should return empty array when no items match', async () => {
      const engine = await compile(morphQL`
        from object to object
        transform
          section multiple matches(
            set val = value
          ) from data where value > 1000
      `);

      const result = engine({
        data: [{ value: 1 }, { value: 2 }, { value: 3 }],
      });

      expect(result.matches).toHaveLength(0);
    });
  });

  describe('single section with where (find first match)', () => {
    it('should find first matching item', async () => {
      const engine = await compile(morphQL`
        from object to object
        transform
          section primaryContact(
            set name = name
            set phone = phone
          ) from contacts where isPrimary == true
      `);

      const result = engine({
        contacts: [
          { name: 'Work', phone: '555-0001', isPrimary: false },
          { name: 'Home', phone: '555-0002', isPrimary: true },
          { name: 'Mobile', phone: '555-0003', isPrimary: false },
        ],
      });

      expect(result.primaryContact).toBeDefined();
      expect(result.primaryContact.name).toBe('Home');
      expect(result.primaryContact.phone).toBe('555-0002');
    });

    it('should return undefined when no match found', async () => {
      const engine = await compile(morphQL`
        from object to object
        transform
          section found(
            set val = value
          ) from items where value == 999
      `);

      const result = engine({
        items: [{ value: 1 }, { value: 2 }],
      });

      expect(result.found).toBeUndefined();
    });
  });

  describe('EDIFACT use case', () => {
    it('should filter segments by qualifier', async () => {
      const engine = await compile(morphQL`
        from object to object
        transform
          section buyer(
            set partyId = segment[1]
            set name = segment[2]
          ) from NAD where segment[0] == "BY"
          
          section seller(
            set partyId = segment[1]
            set name = segment[2]
          ) from NAD where segment[0] == "SE"
      `);

      const result = engine({
        NAD: [
          { segment: ['BY', 'BUYER123', 'Buyer Corp'] },
          { segment: ['SE', 'SELLER456', 'Seller Inc'] },
          { segment: ['DP', 'DEPOT789', 'Depot Ltd'] },
        ],
      });

      expect(result.buyer).toBeDefined();
      expect(result.buyer.partyId).toBe('BUYER123');
      expect(result.buyer.name).toBe('Buyer Corp');

      expect(result.seller).toBeDefined();
      expect(result.seller.partyId).toBe('SELLER456');
      expect(result.seller.name).toBe('Seller Inc');
    });
  });
});
