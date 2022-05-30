/*
 * This file is automatically generated.
 * Run 'pnpm run generate:locales' to update.
 */

import { Faker } from '../faker';
import en from '../locales/en';
import zh_TW from '../locales/zh_TW';

export { default } from '../locales/zh_TW';

export const faker = new Faker({
  locale: 'zh_TW',
  localeFallback: 'en',
  locales: {
    zh_TW,
    en,
  },
});
