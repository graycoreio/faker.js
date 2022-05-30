/*
 * This file is automatically generated.
 * Run 'pnpm run generate:locales' to update.
 */

import { Faker } from '../faker';
import en from '../locales/en';
import fa from '../locales/fa';

export { default } from '../locales/fa';

export const faker = new Faker({
  locale: 'fa',
  localeFallback: 'en',
  locales: {
    fa,
    en,
  },
});
