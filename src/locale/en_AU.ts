/*
 * This file is automatically generated.
 * Run 'pnpm run generate:locales' to update.
 */

import { Faker } from '../faker';
import base from '../locales/base';
import en from '../locales/en';
import en_AU from '../locales/en_AU';

/**
 * The faker instance for the `en_AU` locale.
 *
 * - Language: English (Australia)
 * - Endonym: English (Australia)
 *
 * This instance uses the following locales internally (in descending precedence):
 *
 * - `en_AU`
 * - `en`
 * - `base`
 */
export const faker = new Faker({
  locale: [en_AU, en, base],
});
