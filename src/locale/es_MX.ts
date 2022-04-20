/*
 * This file is automatically generated.
 * Run 'pnpm run generate:locales' to update.
 */

import { Faker } from '../faker';
import en from '../locales/en';
import es_MX from '../locales/es_MX';

export const faker = new Faker({
  locale: 'es_MX',
  localeFallback: 'en',
  locales: {
    es_MX,
    en,
  },
});
