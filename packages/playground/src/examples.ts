import { morphQL } from "@morphql/core";

export interface Example {
  name: string;
  query: string;
  source: string;
}

export const EXAMPLES: Example[] = [
  {
    name: "Customer Profile (JSON to XML)",
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
          id: "CUST-001",
          name: "Jane Doe",
          isActive: true,
          contact: {
            email: "jane.doe@example.com",
            phone: "+1-555-0199",
          },
          addresses: [
            {
              type: "billing",
              street: "123 Main St",
              city: "Metropolis",
              zip: "10001",
              primary: true,
            },
            {
              type: "shipping",
              street: "456 Ocean Dr",
              city: "Gotham",
              zip: "10200",
              primary: false,
            },
          ],
          orders: [
            {
              id: "ORD-2023-001",
              date: "2023-10-15",
              total: 150.5,
              status: "shipped",
              items: [
                { sku: "WIDGET-A", qty: 2, price: 50.0 },
                { sku: "GADGET-B", qty: 1, price: 50.5 },
              ],
            },
            {
              id: "ORD-2023-009",
              date: "2023-11-01",
              total: 200.0,
              status: "pending",
              items: [{ sku: "LUX-ITEM", qty: 1, price: 200.0 }],
            },
          ],
          metrics: {
            visits: 42,
            lastLogin: "2023-11-05T10:00:00Z",
            tags: ["vip", "early-adopter"],
          },
        },
      },
      null,
      2,
    ),
  },
  {
    name: "Simple Math (JSON to JSON)",
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
      2,
    ),
  },
  {
    name: "Books (XML to JSON)",
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
  {
    name: "Inventory (CSV to JSON)",
    query: morphQL`from csv
to json
transform
  section multiple products(
    set id = ID
    set name = Name
    set stock = Number(Quantity)
    set price = Number(Price)
    set category = Category
  ) from spreadsheet(source)`,
    source: `ID,Name,Quantity,Price,Category
P001,Wireless Mouse,50,25.99,Accessories
P002,Mechanical Keyboard,30,89.50,Accessories
P003,USB-C Hub,100,15.00,Cables`,
  },
  {
    name: "Log Parsing (Plaintext to JSON)",
    query: morphQL`from plaintext
to json
transform
  section multiple entries(
    set result = unpack(source,
      "timestamp:0:19",
      "level:20:5",
      "message:26:50"
    )
  ) from rows`,
    source: `2023-10-27 10:00:01 INFO  Application started successfully
2023-10-27 10:05:23 WARN  Memory usage reaching 80%
2023-10-27 10:10:12 ERROR Failed to connect to database`,
  },
  {
    name: "Data Utilities (JSON to JSON)",
    query: morphQL`from json
to json
transform
  set original = textValue
  set encoded = to_base64(textValue)
  set decoded = from_base64(to_base64(textValue))
  set listData = aslist(singleValue)
  set emptyList = aslist(null)`,
    source: JSON.stringify(
      {
        textValue: "Hello MorphQL!",
        singleValue: 42,
      },
      null,
      2,
    ),
  },
  {
    name: "XML Attributes (JSON to XML)",
    query: morphQL`from json
to xml("Store")
transform
  section multiple items(
    set result = xmlnode(name, "id", id, "qty", quantity)
  ) from products`,
    source: JSON.stringify(
      {
        products: [
          { id: "item-1", name: "Apple", quantity: 10 },
          { id: "item-2", name: "Banana", quantity: 20 },
        ],
      },
      null,
      2,
    ),
  },
  {
    name: "Fixed-Width Output (JSON to Plaintext)",
    query: morphQL`from json
to plaintext
transform
  section multiple rows(
    return pack(source,
      "id:0:5:left",
      "name:5:15",
      "score:20:5:left"
    )
  ) from users`,
    source: JSON.stringify(
      {
        users: [
          { id: "1", name: "Alice", score: "100" },
          { id: "2", name: "Bob", score: "85" },
          { id: "3", name: "Charlie", score: "92" },
        ],
      },
      null,
      2,
    ),
  },
  {
    name: "Invoice Mapping (EDIFACT to JSON)",
    query: morphQL`from edifact to object
transform
  set invoiceNumber = BGM[0][1]
  set invoiceDate = DTM[0][0][1]
  
  section buyer(
    set id = source[1][0]
    set name = source[4]
    set address = source[5] + ", " + source[6]
  ) from NAD where source[0] == "BY"
  
  section seller(
    set id = source[1][0]
    set name = source[4]
    set address = source[5] + ", " + source[6]
  ) from NAD where source[0] == "SE"
  
  section multiple items(
    set lineNo = source[0]
    set productId = source[2][0]
    set quantity = number(source[3][1])
    set unit = source[3][2]
    set amount = number(source[4][1])
    set currency = source[4][2]
  ) from LIN`,
    source: `UNB+IATB:1+6PPH:ZZ+240509:1358+1'
UNH+1+INVOIC:D:97B:UN'
BGM+380+INV001+9'
DTM+137:20240509:102'
NAD+BY+87654321::9++BUYER CORP+STREET 1+CITY++12345+US'
NAD+SE+12345678::9++SELLER INC+AVENUE 2+TOWN++54321+UK'
LIN+1++PRODUCT_A:EN'
QTY+47:100:PCE'
MOA+203:500.00:USD'
LIN+2++PRODUCT_B:EN'
QTY+47:50:PCE'
MOA+203:250.00:USD'
UNS+S'
MOA+77:750.00:USD'
UNT+13+1'
UNZ+1+1'`,
  },
];
