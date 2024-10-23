/*
 * This file is automatically generated.
 * Run 'pnpm run generate:locales' to update.
 */

import { Faker } from '../faker';
import base from '../locales/base';
import de from '../locales/de';
import de_AT from '../locales/de_AT';
import en from '../locales/en';

/**
 * The faker instance for the `de_AT` locale.
 *
 * - Language: German (Austria)
 * - Endonym: Deutsch (Österreich)
 *
 * This instance uses the following locales internally (in descending precedence):
 *
 * - `de_AT`
 * - `de`
 * - `en`
 * - `base`
 */
export const faker = new Faker({
  locale: [de_AT, de, en, base],
});
