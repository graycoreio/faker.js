import { describe, expect, it } from 'vitest';
import { allLocales } from '../src';
import './vitest-extensions';

function checkLocaleData(data: unknown) {
  if (Array.isArray(data)) {
    it('should not have duplicate entries', () => {
      expect(data).not.toContainDuplicates();
    });
  } else if (typeof data === 'object' && data != null) {
    describe.each(Object.entries(data))('%s', (_, nestedData) => {
      checkLocaleData(nestedData);
    });
  } else {
    it.skip('primitives cannot be tested');
  }
}

/**
 * A set of locale data paths that should be ignored when checking for characters.
 * Because these usually contain data using Latin characters that are otherwise not relevant to the locale.
 */
const ignoredCharacterData = new Set([
  '.airline.airline[].iataCode',
  '.airline.airplane[].iataTypeCode',
  '.airline.airport[].iataCode',
  '.finance.currency',
  '.finance.credit_card',
  '.hacker.abbreviation',
  '.internet.domain_suffix',
  '.internet.emoji',
  '.internet.example_email',
  '.internet.free_email',
  '.location.country_code',
  '.metadata',
  '.science.chemical_element[].symbol',
  '.science.unit[].symbol',
  '.system.directory_path',
  '.system.mime_type',
]);

function uniqueCharacters(data: string | string[]): string[] {
  return [...new Set(data)];
}

function allCharacters(data: unknown, path: string = ''): string[] {
  if (ignoredCharacterData.has(path)) {
    return [];
  } else if (Array.isArray(data)) {
    return uniqueCharacters(data.flatMap((e) => allCharacters(e, `${path}[]`)));
  } else if (typeof data === 'object' && data != null) {
    return uniqueCharacters(
      Object.entries(data).flatMap(([key, entry]) =>
        allCharacters(entry, `${path}.${key}`)
      )
    );
  } else if (typeof data === 'string') {
    return uniqueCharacters(
      data
        .replaceAll(/{{(?:[^{]|{(?!{))*?}}/g, '') // remove placeholders
        .replaceAll(/\d+/g, '') // remove numbers
    );
  }

  return [];
}

describe('locale-data', () => {
  checkLocaleData(allLocales);

  // This test exists to keep track of the characters used in each locale.
  // It doesn't matter if new characters are added as long as they belong to that language.
  it('should only have known characters', () => {
    const characterSets = Object.fromEntries(
      Object.entries(allLocales).map(([locale, data]) => [
        locale,
        allCharacters(data).sort().join(''),
      ])
    );
    expect(characterSets).toMatchSnapshot();
  });
});
