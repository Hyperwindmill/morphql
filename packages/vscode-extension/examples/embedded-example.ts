import { compile, morphQL } from "@morphql/core";

// Example 1: Using tagged template (recommended)
const transformQuery = morphQL`
  from json to xml
  transform
    set fullName = firstName + " " + lastName
    set age = number(ageString)
    
    section multiple items(
      set sku = itemSku
      set price = itemPrice * 1.2
    ) from products
`;

// Example 2: Using comment hint
//@morphQL
const convertQuery = `
  from xml to json
  transform
    clone(id, name)
    set status = if(active === true, "active", "inactive")
`;

// Example 3: Complex transformation with all features
const complexQuery = morphQL`
  from json to json
  transform
    // Define reusable values
    define \`taxRate\` = 0.22
    define discountThreshold = 100
    
    // Basic fields
    set orderId = id
    set customerName = customer.firstName + " " + customer.lastName
    
    // Conditional logic
    if (total > discountThreshold) (
      set discount = total * 0.1
    ) else (
      set discount = 0
    )
    
    // Nested sections
    section billing(
      set address = customer.billingAddress
      set city = customer.city
      set zipCode = substring(customer.postalCode, 0, 5)
    )
    
    // Array mapping
    section multiple lineItems(
      set productId = product.id
      set productName = uppercase(product.name)
      set quantity = qty
      set unitPrice = price
      set lineTotal = qty * price
      
      // Array index access
      set firstTag = tags[0]
      set category = categories[categoryIndex]
    ) from items
    
    // Calculate final total
    set subtotal = total - discount
    set tax = subtotal * taxRate
    set grandTotal = subtotal + tax
`;

// Compile and use
async function runExample() {
  const sourceData = {
    id: "ORD-123",
    customer: {
      firstName: "John",
      lastName: "Doe",
      billingAddress: "Via Roma 1",
      city: "Milano",
      postalCode: "20100-001",
    },
    total: 150,
    items: [
      {
        product: { id: "P1", name: "laptop" },
        qty: 1,
        price: 100,
        tags: ["electronics", "computers"],
        categoryIndex: 0,
        categories: ["Electronics", "Office"],
      },
      {
        product: { id: "P2", name: "mouse" },
        qty: 2,
        price: 25,
        tags: ["accessories"],
        categoryIndex: 0,
        categories: ["Accessories"],
      },
    ],
  };

  const engine = await compile(complexQuery);
  const result = engine(sourceData);

  console.log("Result:", result);
}

runExample().catch(console.error);
