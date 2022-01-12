import {
  Assertor,
  brand,
  Validator,
  Typifier,
  AssertorFactory,
  ContextConfiguration,
} from "../type";

const isString: Validator<string> = (target: unknown) => target as string;

export function String(...assertions: Assertor[]): Typifier<string> {
  return (context) => brand<string>(isString, assertions, context);
}

/**
 * @param pattern The target regular expressions.
 */
export const matchesPattern: AssertorFactory = (
  configuration: RegExp | ContextConfiguration
) => {
  const isContextful = typeof configuration == "object";

  return {
    isContextful,
    assertor: isContextful
      ? (context) => (target) =>
          configuration[context?.i18n].test(target as string)
      : (target) => (configuration as RegExp).test(target as string),
  };
};

// Typifier: injects context, executes vaildator and assertions
// Validator: The first
// Assertor: (maybe) reads context, tries to validate the input against a single assertion
