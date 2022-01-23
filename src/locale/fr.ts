/*
 * This file is automatically generated.
 * Run 'pnpm esno scripts/generateLocales.ts' to update.
 */

import { Faker } from '..';
import fr from '../locales/fr';
import en from '../locales/en';

const faker = new Faker({
  locale: 'fr',
  localeFallback: 'en',
  locales: {
    fr,
    en,
  },
});

export default faker;
