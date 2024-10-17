import { describe, expect, it } from 'vitest';
import { faker, resolveLocaleData } from '../../src';
import { seededTests } from '../support/seeded-runs';
import { times } from './../support/times';

const NON_SEEDED_BASED_RUN = 5;

describe('food', () => {
  seededTests(faker, 'food', (t) => {
    t.it('adjective');

    t.it('description');

    t.it('dish');

    t.it('ethnicCategory');

    t.it('fruit');

    t.it('ingredient');

    t.it('meat');

    t.it('spice');

    t.it('vegetable');
  });

  describe.each(times(NON_SEEDED_BASED_RUN).map(() => faker.seed()))(
    'random seeded tests for seed %i',
    () => {
      describe('adjective', () => {
        it(`should return random value from adjective array`, () => {
          const actual = faker.food.adjective();
          expect(
            resolveLocaleData(faker.fakerCore, 'food', 'adjective')
          ).toContain(actual);
        });
      });

      describe('dish', () => {
        it(`should be a capitalized string`, () => {
          const actual = faker.food.dish();
          expect(actual[0]).toBe(actual[0].toUpperCase());
        });
      });

      describe('ethnicCategory', () => {
        it(`should return random value from ethnic_category array`, () => {
          const actual = faker.food.ethnicCategory();
          expect(
            resolveLocaleData(faker.fakerCore, 'food', 'ethnic_category')
          ).toContain(actual);
        });
      });

      describe('fruit', () => {
        it(`should return random value from fruit array`, () => {
          const actual = faker.food.fruit();
          expect(resolveLocaleData(faker.fakerCore, 'food', 'fruit')).toContain(
            actual
          );
        });
      });

      describe('ingredient', () => {
        it(`should return random value from ingredient array`, () => {
          const actual = faker.food.ingredient();
          expect(
            resolveLocaleData(faker.fakerCore, 'food', 'ingredient')
          ).toContain(actual);
        });
      });

      describe('meat', () => {
        it(`should return random value from meat array`, () => {
          const actual = faker.food.meat();
          expect(resolveLocaleData(faker.fakerCore, 'food', 'meat')).toContain(
            actual
          );
        });
      });

      describe('spice', () => {
        it(`should return random value from spice array`, () => {
          const actual = faker.food.spice();
          expect(resolveLocaleData(faker.fakerCore, 'food', 'spice')).toContain(
            actual
          );
        });
      });

      describe('vegetable', () => {
        it(`should return random value from vegetable array`, () => {
          const actual = faker.food.vegetable();
          expect(
            resolveLocaleData(faker.fakerCore, 'food', 'vegetable')
          ).toContain(actual);
        });
      });
    }
  );
});
