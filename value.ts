import { DContext, DError, Schema, Typifier } from "./type";

type DecodingReport<T> = {
  invalidJSON?: string;
  decodingReport?: {
    unexpected: {
      [key: string]: unknown;
    };
    malformed: {
      [Property in keyof T]+?: {
        sourceValue: T[Property] | unknown;
      };
    };
  };
};

// DT Stands for DiplomacyValue
export type DV<T> = T & DecodingReport<T>;

function createFallback<TargetType>(schema: Schema) {
  return Object.keys(schema).reduce(
    (accumulator, key) => (accumulator[key] = DError.CannotDecode),
    {}
  ) as DV<TargetType>;
}

export async function decoder<TargetType>(schema: Schema, context?: DContext) {
  return async (input: string): Promise<DV<TargetType>> => {
    let outcome: DV<TargetType>;

    let parsedInput;

    try {
      parsedInput = await JSON.parse(input);
    } catch (e) {
      return createFallback<TargetType>(schema);
    }

    Object.keys(parsedInput).forEach((key) => {
      const value = parsedInput[key];

      // Unexpected value, track it
      if (!(key in schema)) {
        outcome.decodingReport.unexpected[key] = value;
        return;
      }

      // Key exists, try to decode it
      const decodingTaskOutcome = (schema[key] as Typifier<unknown>)(context)(
        value
      );

      // Decoding failed, track it
      if (decodingTaskOutcome == DError.CannotDecode) {
        outcome.decodingReport.malformed[key] = value;
        return;
      }

      // All good.
      outcome[key] = value;
    });

    return outcome;
  };
}
