export const scriptCommand = 'pnpm run generate:api-docs';

export function onlyOne<T>(input: ReadonlyArray<T>, property: string): T {
  if (input.length !== 1) {
    throw new Error(
      `Expected exactly one element for ${property}, got ${input.length}`
    );
  }

  return input[0];
}

export function optionalOne<T>(
  input: ReadonlyArray<T>,
  property: string
): T | undefined {
  if (input.length > 1) {
    throw new Error(
      `Expected one optional element for ${property}, got ${input.length}`
    );
  }

  return input[0];
}

export function required<T>(
  input: T | undefined,
  property: string
): NonNullable<T> {
  if (input == null) {
    throw new Error(`Expected a value for ${property}, got undefined`);
  }

  return input;
}

export function allRequired<T>(
  input: ReadonlyArray<T | undefined>,
  property: string
): Array<NonNullable<T>> {
  return input.map((v, i) => required(v, `${property}[${i}]`));
}

export function valuesForKeys<T>(
  input: Record<string, T>,
  keys: string[]
): T[] {
  return keys.map((key) => required(input[key], key));
}
