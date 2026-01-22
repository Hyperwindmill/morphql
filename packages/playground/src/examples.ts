import { morphQL } from "@morphql/core";

export interface Example {
  name: string;
  query: string;
  source: string;
}

export const EXAMPLES: Example[] = [
  {
    name: 'Customer Profile (JSON to XML)',
    query: morphQL`from json
to xml("UserProfile")
transform
  section profile(
    set customerId = id
    set fullName = uppercase(name)
    set status = if(isActive, "Active", "Inactive")

    if (isActive) (
       set accountTier = "Premium"
    ) else (
       set accountTier = "Standard"
    )

    section contactInfo(
      set primaryEmail = email
      set phone = phone
    ) from contact

    section multiple addressBook(
      set type = type
      set fullAddress = street + ", " + city + " " + zip
      set isPrimary = if(primary, "Yes", "No")
    ) from addresses

    section multiple orderHistory(
      set orderRef = id
      set value = total
      set state = status

      section multiple lineItems(
        set productCode = sku
        set quantity = qty
        set unitPrice = price
        set totalLine = if(qty > 5, price * qty * 0.9, price * qty)
      ) from items
    ) from orders

    section stats(
       set visitCount = visits
       set accountType = if(visits > 40, "Frequent", "Casual")
       set lastSeen = substring(lastLogin, 0, 10)
    ) from metrics
  ) from customer`,
    source: JSON.stringify(
      {
        customer: {
          id: 'CUST-001',
          name: 'Jane Doe',
          isActive: true,
          contact: {
            email: 'jane.doe@example.com',
            phone: '+1-555-0199',
          },
          addresses: [
            {
              type: 'billing',
              street: '123 Main St',
              city: 'Metropolis',
              zip: '10001',
              primary: true,
            },
            {
              type: 'shipping',
              street: '456 Ocean Dr',
              city: 'Gotham',
              zip: '10200',
              primary: false,
            },
          ],
          orders: [
            {
              id: 'ORD-2023-001',
              date: '2023-10-15',
              total: 150.5,
              status: 'shipped',
              items: [
                { sku: 'WIDGET-A', qty: 2, price: 50.0 },
                { sku: 'GADGET-B', qty: 1, price: 50.5 },
              ],
            },
            {
              id: 'ORD-2023-009',
              date: '2023-11-01',
              total: 200.0,
              status: 'pending',
              items: [{ sku: 'LUX-ITEM', qty: 1, price: 200.0 }],
            },
          ],
          metrics: {
            visits: 42,
            lastLogin: '2023-11-05T10:00:00Z',
            tags: ['vip', 'early-adopter'],
          },
        },
      },
      null,
      2
    ),
  },
  {
    name: 'Simple Math (JSON to JSON)',
    query: morphQL`from json
to json
transform
  set sum = a + b
  set difference = a - b
  set product = a * b
  set quotient = a / b
  set formatted = "The result is " + (a + b)`,
    source: JSON.stringify(
      {
        a: 10,
        b: 5,
      },
      null,
      2
    ),
  },
  {
    name: 'Books (XML to JSON)',
    query: morphQL`from xml
to json
transform
  section library(
    section multiple books(
      set title = title
      set author = author
      set year = year
    ) from book
  ) from catalog`,
    source: `<catalog>
  <book>
    <title>The Great Gatsby</title>
    <author>F. Scott Fitzgerald</author>
    <year>1925</year>
  </book>
  <book>
    <title>1984</title>
    <author>George Orwell</author>
    <year>1949</year>
  </book>
</catalog>`,
  },
];
