# EDIFACT Mapping Example

This guide demonstrates how to use MorphQL to transform a complex UN/EDIFACT message into a structured JSON object.

## Source Data (EDIFACT)

Consider the following simplified **INVOIC** message:

```edifact
UNB+IATB:1+6PPH:ZZ+240509:1358+1'
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
UNZ+1+1'
```

## Transformation Query

We want to extract the invoice number, date, buyer/seller information, and the list of line items.

```morphql
from edifact to object
transform
  set invoiceNumber = BGM[0][1]
  set invoiceDate = DTM[0][0][1]

  section buyer(
    set id = source[1][0]
    set name = source[3]
    set address = source[4] + ", " + source[5]
  ) from NAD where source[0] == "BY"

  section seller(
    set id = source[1][0]
    set name = source[3]
    set address = source[4] + ", " + source[5]
  ) from NAD where source[0] == "SE"

  section multiple items(
    set lineNo = LIN[0]
    set productId = LIN[2][0]
    set quantity = number(QTY[0][1])
    set unit = QTY[0][2]
    set amount = number(MOA[0][1])
    set currency = MOA[0][2]
  ) from transpose(_source, "LIN", "QTY", "MOA")
```

Wait, what's happening here?

1. `transpose(_source, "LIN", "QTY", "MOA")` takes the root source and picks these three segment arrays.
2. It "zips" them so each iteration of the section gets an object like `{ LIN: [...], QTY: [...], MOA: [...] }`.
3. Inside the section, we can access these segments directly. This is much cleaner than using manual indices!

## Target Output (JSON)

The resulting object will look like this:

```json
{
  "invoiceNumber": "INV001",
  "invoiceDate": "20240509",
  "buyer": {
    "id": "87654321",
    "name": "BUYER CORP",
    "address": "STREET 1, CITY"
  },
  "seller": {
    "id": "12345678",
    "name": "SELLER INC",
    "address": "AVENUE 2, TOWN"
  },
  "items": [
    {
      "lineNo": "1",
      "productId": "PRODUCT_A",
      "quantity": 100,
      "unit": "PCE",
      "amount": 500.0,
      "currency": "USD"
    },
    {
      "lineNo": "2",
      "productId": "PRODUCT_B",
      "quantity": 50,
      "unit": "PCE",
      "amount": 250.0,
      "currency": "USD"
    }
  ]
}
```

## Key Concepts

- **Segment Access**: We access segments by their tag (e.g., `BGM`, `DTM`).
- **Array Notation**: Since many tags can repeat, each tag points to an array of segments. `BGM[0]` is the first BGM segment.
- **Nested Elements**: Data elements are arrays. `BGM[0][1]` is the second element of the first BGM segment. Composite elements are further nested: `DTM[0][0][1]` is the second component of the first data element of the first DTM segment.
- **Filtering Sections**: We use the `where` clause in sections to filter by segment content, like distinguishing between `BY` (Buyer) and `SE` (Seller) in `NAD` segments.
