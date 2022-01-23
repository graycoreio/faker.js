/*
 * This file is automatically generated.
 * Run 'pnpm esno scripts/generateLocales.ts' to update.
 */

import { Faker } from '..';
import es from '../locales/es';
import en from '../locales/en';

const faker = new Faker({
  locale: 'es',
  localeFallback: 'en',
  locales: {
    es,
    en,
  },
});

export default faker;
