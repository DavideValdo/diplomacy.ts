import { Typifier } from "./type";
import { OptionalPropertyIdentity } from "./types/optional";
import { SelfIdentity } from "./types/self";

export type SchemaProperty =
  | Typifier<unknown>
  | Schema
  | SelfIdentity
  | OptionalPropertyIdentity;

export interface Schema {
  [key: string]: SchemaProperty;
}

type Intersection<S, T> = { [K in keyof (S & T)]: (S & T)[K] };

export type DType<T extends Schema> = T extends infer O
  ? Intersection<
      {
        [P in keyof O]?: O[P] extends {
          _tag: "OptionalSelf";
        }
          ? DType<T>
          : O[P] extends {
              _tag: "OptionalProperty";
              target: (input: unknown) => infer R;
            }
          ? R
          : never;
      },
      {
        [P in keyof O]: O[P] extends Schema
          ? DType<O[P]>
          : O[P] extends SelfIdentity
          ? DType<T>
          : O[P] extends (input: unknown) => infer R
          ? R
          : never;
      }
    >
  : never;
