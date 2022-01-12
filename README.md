### Please note: this library is still work in progress

Minimal runtime type decoding layer with reporting, graceful degradation, contextful assertions support (i.e. i18n). Made possible by TypeScript 4.1's recursive conditional types feature.

### Why

TypeScript won't check `JSON.parse()`'s result consistency against a type definition at runtime.

#### Graceful degradation

We use string error codes to provide a fallback in case of a property not being decodable from a JSON input.

- `#!CD` stands for **cannot decode**
- `#!NSP` stands for **no such property**

The main benefit is that we can let the UI fully render, instead of crashing by trying to access `undefined` values.

Upon decoding a JSON value aginst a schema, the tree shape is kept intact down to the leafs, these error codes are renderable in the UI and might let us immediately see which fields are suffering from issues, in a granular way.

##### Schema definition

```ts
const AddressSchema = {
  street: {
    qualifier: String(),
    name: String(),
    civic: Optional(Integer(isNonNegative)),
    postalCode: String(),
  },
  country: Optional(String()),
};

const PersonSchema = {
  age: Integer(isNonNegative),
  address: Optional(AddressSchema),
  brother: Optional(Self),
  name: String(),
};

export type Person = DType<typeof PersonSchema>;
```

##### Decoding

```ts
const personDecoder = decoder<Person>(PersonSchema);

const input = `{
  name: "Peppino",
  surname: "De Filippo",
  age: "24-08-1903",
  street: { qualifier: "Via" },
}`;

const result = personDecoder(myJSON);

// console.log(result):
//
// {
//   name: "Peppino",
//   age: '#!CD',
//   address: {
//     qualifier: "Via",
//     name: "#!NSP",
//     civic: "#!NSP",
//     postalCode: '#!NSP'
//   },
//   decodingReport: {
//     unexpected: {
//       surname: "De Filippo"
//     },
//     malformed: {
//       age: "24-08-1903"
//     }
//   }
// }
```

##### Contextful assertions (i18n support)

Assertors - currently, `matchesPattern` - can be aware of a current context.

Here's how to create a i18n-aware decoder:

```ts
const AddressSchema = {
  street: {
    qualifier: String(
      matchesPattern({
        it: /^(Via|Viale|Vicolo|Piazza|Corso)$/,
        en: /^(Street|Avenue)$/, // ...
      })
    ),
    name: String(),
    civic: Optional(Integer(isNonNegative)),
    postalCode: String(),
  },
  country: Optional(String()),
};

const addressDecoder = decoder(AddressSchema, {
  i18n: "it",
});
```
