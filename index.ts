import { DType } from "./type";
import { Integer, isNonNegative } from "./types/numbers";
import Optional from "./types/optional";
import { Self } from "./types/self";
import { matchesPattern, String } from "./types/strings";
import { decoder } from "./Value";

const AddressSchema = {
  street: {
    qualifier: String(),
    name: String(),
    civic: Integer(isNonNegative),
  },
  country: Optional(String()),
};

const PersonSchema = {
  age: Integer(isNonNegative),
  address: Optional(AddressSchema),
  brother: Self,
  name: String(
    matchesPattern({
      it: /^$/,
      en: /^$/,
    })
  ),
};

export type Person = DType<typeof PersonSchema>;

const personDecoder = decoder<Person>(PersonSchema, {
  i18n: "it",
});

// const myJSON = `{"name":"Peppino","surname": "Gesà","isCitizen":true, age: "ventiquattranni"}`;

// const result = personDecoder(myJSON);

// {
//   name: "Peppino",
//   age: '#!CD',
//   address: {
//     qualifier: "#!NSP",
//     name: "#!NSP",
//     civic: "#!NSP"
//   },
//   decodingReport: {
//     unexpected: {
//       surname: "Gesà"
//       isCitizen: true
//     },
//     malformed: {
//       age: "ventiquattranni"
//     }
//   }
// }
