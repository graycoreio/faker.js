/*
 * This file is automatically generated.
 * Run 'pnpm run generate:locales' to update.
 */

import { Faker } from '../faker';
import en from '../locales/en';
import it from '../locales/it';

export { default } from '../locales/it';

export const faker = new Faker({
  locale: 'it',
  localeFallback: 'en',
  locales: {
    it,
    en,
  },
});
