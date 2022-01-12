import { Assertor, brand, DiplomacyError, Typifier } from "../type";

const isInteger: Typifier<number> = (target: unknown) => {
  const number = parseInt(target as string);

  return number !== undefined ? number : DiplomacyError.CannotDecode;
};

export const Integer: (...assertions: Assertor[]) => Typifier<number> = (
  ...assertions
) => brand<number>(isInteger, assertions);

export const isNonNegative: Assertor = (target: unknown) =>
  (target as number) > 0 || DiplomacyError.CannotDecode;
