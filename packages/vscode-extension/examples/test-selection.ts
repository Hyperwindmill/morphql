import { compile, mql } from "@morphql/core";

// Example 1: Tagged template - select the query inside the backticks
const transformQuery = mql`
from json to json
transform
  set fullName = firstName + " " + lastName
  set age = number(ageString)
  set email = lowercase(email)
`;

// Example 2: Regular template string - select the query text
// @mql
const convertQuery = `
from json to xml
transform
  set name = firstName
  set status = if(active === true, "active", "inactive")
`;

// Example 3: Inline query - select this entire query
const inlineQuery = `from json to json transform set id = userId set name = userName`;

// To test:
// 1. Select any of the queries above (the text between backticks)
// 2. Right-click and choose "MQL: Execute Selection"
// 3. Enter test data like: {"firstName": "John", "lastName": "Doe", "ageString": "25", "email": "JOHN@EXAMPLE.COM", "active": true}
// 4. See the result in the MQL Output panel!

async function example() {
  const data = {
    firstName: "Mario",
    lastName: "Rossi",
    ageString: "35",
    email: "MARIO.ROSSI@EXAMPLE.COM",
    active: true,
  };

  const engine = await compile(transformQuery);
  const result = engine(JSON.stringify(data));
  console.log(result);
}
