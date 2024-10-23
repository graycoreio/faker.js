/*
 * This file is automatically generated.
 * Run 'pnpm run generate:locales' to update.
 */

import { Faker } from '../faker';
import base from '../locales/base';
import en from '../locales/en';
import nb_NO from '../locales/nb_NO';

/**
 * The faker instance for the `nb_NO` locale.
 *
 * - Language: Norwegian (Norway)
 * - Endonym: Norsk bokmål (Norge)
 *
 * This instance uses the following locales internally (in descending precedence):
 *
 * - `nb_NO`
 * - `en`
 * - `base`
 */
export const faker = new Faker({
  locale: [nb_NO, en, base],
});
