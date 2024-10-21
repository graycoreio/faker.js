/*
 * This file is automatically generated.
 * Run 'pnpm run generate:locales' to update.
 */

import { Faker } from '../faker';
import base from '../locales/base';
import en from '../locales/en';
import eo from '../locales/eo';

/**
 * The faker instance for the `eo` locale.
 *
 * - Language: Esperanto
 * - Endonym: Esperanto
 *
 * This instance uses the following locales internally (in descending precedence):
 *
 * - `eo`
 * - `en`
 * - `base`
 */
export const faker = new Faker({
  locale: [eo, en, base],
});
