import { Validator, Schema } from "../type";
import { Self, SelfIdentity } from "./self";

export type OptionalProperties<T extends Schema> = Partial<
  Pick<
    T,
    {
      [K in keyof T]: T[K] extends OptionalPropertyIdentity ? K : never;
    }[keyof T]
  >
>;

export type RequiredProperties<T extends Schema> = Required<
  Pick<
    T,
    {
      [K in keyof T]: T[K] extends OptionalPropertyIdentity ? never : K;
    }[keyof T]
  >
>;

export type Intersection<A, B> = A & B extends infer U
  ? { [P in keyof U]: U[P] }
  : never;

export interface OptionalPropertyIdentity {
  tag: "OptionalProperty" | "OptionalSelf";
  target?: Validator<unknown> | Schema | SelfIdentity;
}

const Optional: (
  property: Validator<unknown> | Schema | SelfIdentity
) => OptionalPropertyIdentity = (property) =>
  property === Self
    ? {
        tag: "OptionalSelf",
      }
    : {
        tag: "OptionalProperty",
        target: property,
      };

export default Optional;
