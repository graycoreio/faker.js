import type { LocaleEntry } from './definitions';

/**
 * The possible definitions related to lorem texts.
 *
 * The words in this module are determined by the ISO 15924 script of the locale.
 * If a locale uses the Latin script, it will utilize Latin lorem words, while a locale using the Cyrillic script will use Cyrillic lorem words, and so forth.
 */
export type LoremDefinition = LocaleEntry<{
  /**
   * Lorem words used to generate dummy texts.
   */
  word: string[];
}>;
