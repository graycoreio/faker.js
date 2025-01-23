import { isHexadecimal, isOctal } from 'validator';
import { describe, expect, it, vi } from 'vitest';
import { FakerError, SimpleFaker, faker } from '../../src';
import { seededTests } from '../support/seeded-runs';
import { MERSENNE_MAX_VALUE } from '../utils/mersenne-test-utils';
import { times } from './../support/times';

function isFloat(value: number): boolean {
  return value % 1 !== 0;
}

function isBinary(str: string): boolean {
  return [...str].every((char) => char === '0' || char === '1');
}

describe('number', () => {
  seededTests(faker, 'number', (t) => {
    t.describeEach(
      'int',
      'binary',
      'octal',
      'hex'
    )((t) => {
      t.it('noArgs')
        .it('with value', 1)
        .it('with options', { min: 0, max: 10 });
    });

    t.describe('float', (t) => {
      t.it('with plain number', 4)
        .it('with min', { min: -42 })
        .it('with max', { max: 69 })
        .it('with min and max', { min: -42, max: 69 })
        .it('with min, max and fractionDigits', {
          min: -42,
          max: 69,
          fractionDigits: 4,
        })
        .it('with min, max and multipleOf', {
          min: -42,
          max: 69,
          multipleOf: 0.0001,
        });
    });

    t.describe('bigInt', (t) => {
      t.it('noArgs')
        .it('with number value', 42)
        .it('with string value', '69')
        .it('with boolean value', true)
        .it('with bigint value', 123n)
        .it('with options', { min: -42, max: 69 })
        .it('with big options', {
          min: 6135715171537515454317351n,
          max: 32465761264574654845432354n,
        });
    });

    t.describe('romanNumeral', (t) => {
      t.it('noArgs')
        .it('with number value', 1000)
        .it('with only min', { min: 5 })
        .it('with only max', { max: 165 })
        .it('with min as 1', { min: 1 })
        .it('with max as 3999', { max: 3999 })
        .it('with min and max', { min: 100, max: 502 });
    });

    t.describe('exponentialDistribution', (t) => {
      t.it('noArgs')
        .it('with max', 10)
        .it('with low base', { base: 0.1 })
        .it('with high base', { base: 10 })
        .it('with low bias', { bias: -9 })
        .it('with high bias', { bias: 9 })
        .it('with min and max', { min: 10, max: 100 });
    });
  });

  describe(`random seeded tests for seed ${faker.seed()}`, () => {
    describe('int', () => {
      it('should return an integer between 0 and Number.MAX_SAFE_INTEGER (inclusive) by default', () => {
        const actual = faker.number.int();

        expect(actual).toBeTypeOf('number');
        expect(actual).toSatisfy(Number.isInteger);

        expect(actual).toBeGreaterThanOrEqual(0);
        expect(actual).lessThanOrEqual(Number.MAX_SAFE_INTEGER);
      });

      it('should return an even integer', () => {
        const actual = faker.number.int({ multipleOf: 2 });

        expect(actual).toBeTypeOf('number');
        expect(actual).toSatisfy(Number.isInteger);
        expect(actual).toSatisfy((x: number) => x % 2 === 0);
        expect(actual).toBeGreaterThanOrEqual(0);
        expect(actual).toBeLessThanOrEqual(Number.MAX_SAFE_INTEGER);
      });

      it('provides numbers with a given multipleOf of 10 with exclusive ends', () => {
        const results = [
          ...new Set(
            Array.from({ length: 100 }, () =>
              faker.number.int({
                min: 12,
                max: 37,
                multipleOf: 10,
              })
            )
          ),
        ].sort();
        expect(results).toEqual([20, 30]);
      });

      it('provides numbers with a given multipleOf of 10 with inclusive ends', () => {
        const results = [
          ...new Set(
            Array.from({ length: 100 }, () =>
              faker.number.int({
                min: 10,
                max: 50,
                multipleOf: 10,
              })
            )
          ),
        ].sort();
        expect(results).toEqual([10, 20, 30, 40, 50]);
      });

      it('throws for float multipleOf', () => {
        const input = {
          min: 0,
          max: 10,
          multipleOf: 0.1,
        };

        expect(() => faker.number.int(input)).toThrow(
          new FakerError('multipleOf should be an integer.')
        );
      });

      it('throws for negative multipleOf', () => {
        const input = {
          min: -10,
          max: 10,
          multipleOf: -1,
        };

        expect(() => faker.number.int(input)).toThrow(
          new FakerError('multipleOf should be greater than 0.')
        );
      });

      it('throws for impossible multipleOf', () => {
        const input = {
          min: 11,
          max: 19,
          multipleOf: 10,
        };

        expect(() => faker.number.int(input)).toThrow(
          new FakerError('No suitable integer value between 11 and 19 found.')
        );
      });

      it('should return a random number given a maximum value as Number', () => {
        const actual = faker.number.int(10);

        expect(actual).toBeTypeOf('number');
        expect(actual).toSatisfy(Number.isInteger);

        expect(actual).toBeGreaterThanOrEqual(0);
        expect(actual).toBeLessThanOrEqual(10);
      });

      it('should return a random number given a maximum value as Object', () => {
        const actual = faker.number.int({ max: 10 });

        expect(actual).toBeTypeOf('number');
        expect(actual).toSatisfy(Number.isInteger);

        expect(actual).toBeGreaterThanOrEqual(0);
        expect(actual).toBeLessThanOrEqual(10);
      });

      it('should return a random number given a maximum value of 0', () => {
        const actual = faker.number.int({ max: 0 });

        expect(actual).toBe(0);
      });

      it('should return a random number given a negative number minimum and maximum value of 0', () => {
        const actual = faker.number.int({ min: -100, max: 0 });

        expect(actual).toBeTypeOf('number');
        expect(actual).toSatisfy(Number.isInteger);

        expect(actual).toBeGreaterThanOrEqual(-100);
        expect(actual).toBeLessThanOrEqual(0);
      });

      it('should return a random number between a range', () => {
        for (let i = 0; i < 100; i++) {
          const actual = faker.number.int({ min: 22, max: 33 });

          expect(actual).toBeTypeOf('number');
          expect(actual).toSatisfy(Number.isInteger);

          expect(actual).toBeGreaterThanOrEqual(22);
          expect(actual).toBeLessThanOrEqual(33);
        }
      });

      it('should return inclusive negative max value', () => {
        let foundNegative4 = false;
        let foundNegative5 = false;

        for (let iter = 0; iter < 1000; iter++) {
          const actual = faker.number.int({ min: -5, max: -4 });

          if (actual === -4) {
            foundNegative4 = true;
          } else if (actual === -5) {
            foundNegative5 = true;
          }

          expect(actual).toBeTypeOf('number');
          expect(actual).toSatisfy(Number.isInteger);

          expect(actual).toBeGreaterThanOrEqual(-5);
          expect(actual).toBeLessThanOrEqual(-4);

          if (foundNegative4 && foundNegative5) {
            break;
          }
        }

        expect(foundNegative4).toBeTruthy();
        expect(foundNegative5).toBeTruthy();
      });

      it('should not mutate the input object', () => {
        const input: {
          min?: number;
          max?: number;
          precision?: number;
          otherProperty: string;
        } = Object.freeze({
          min: 1,
          precision: 1,
          otherProperty: 'hello darkness my old friend',
        });

        expect(() => faker.number.int(input)).not.toThrow();
      });

      it('should throw when min > max', () => {
        const min = 10;
        const max = 9;

        expect(() => {
          faker.number.int({ min, max });
        }).toThrow(
          new FakerError(`Max ${max} should be greater than min ${min}.`)
        );
      });

      it('should throw when there is no integer between min and max', () => {
        expect(() => {
          faker.number.int({ min: 2.1, max: 2.9 });
        }).toThrow(
          new FakerError(`No suitable integer value between 2.1 and 2.9 found.`)
        );
      });
    });

    describe('float', () => {
      it('should return a float between 0 and 1 (inclusive) by default', () => {
        const actual = faker.number.float();

        expect(actual).toBeTypeOf('number');
        expect(actual).toSatisfy(isFloat);

        expect(actual).toBeGreaterThanOrEqual(0);
        expect(actual).toBeLessThanOrEqual(1);
      });

      it('should return a random float with given max', () => {
        const actual = faker.number.float(3);

        expect(actual).toBeTypeOf('number');
        expect(actual).toSatisfy(isFloat);

        expect(actual).toBeGreaterThanOrEqual(0);
        expect(actual).toBeLessThanOrEqual(3);
      });

      it('should return a random number given a max value of 10', () => {
        const actual = faker.number.float({ max: 10 });

        expect(actual).toBeTypeOf('number');
        expect(actual).toSatisfy(isFloat);

        expect(actual).toBeGreaterThanOrEqual(0);
        expect(actual).toBeLessThanOrEqual(10);
      });

      it('should return 0 given a max value of 0', () => {
        expect(faker.number.float({ max: 0 })).toBe(0);
      });

      it('should return a random number given a negative number min and max value of 0', () => {
        const actual = faker.number.float({ min: -100, max: 0 });

        expect(actual).toBeTypeOf('number');
        expect(actual).toSatisfy(isFloat);

        expect(actual).toBeGreaterThanOrEqual(-100);
        expect(actual).toBeLessThanOrEqual(0);
      });

      it('should return a random number between a range', () => {
        for (let i = 0; i < 5; i++) {
          const actual = faker.number.float({ min: 22, max: 33 });

          expect(actual).toBeTypeOf('number');
          expect(actual).toSatisfy(isFloat);

          expect(actual).toBeGreaterThanOrEqual(22);
          expect(actual).toBeLessThanOrEqual(33);
        }
      });

      it('provides numbers with a given multipleOf of 0.5 steps', () => {
        const results = [
          ...new Set(
            Array.from({ length: 50 }, () =>
              faker.number.float({
                min: 0,
                max: 1.5,
                multipleOf: 0.5,
              })
            )
          ),
        ].sort();

        expect(results).toEqual([0, 0.5, 1, 1.5]);
      });

      it.each(times(100))(
        'provides numbers with an exact fractional digits',
        () => {
          const actual = faker.number.float({
            min: 0.5,
            max: 0.99,
            fractionDigits: 2,
          });
          expect(actual).toBe(Number(actual.toFixed(2)));
        }
      );

      it('throws an error if fractionDigits and multipleOf is provided at the same time', () => {
        expect(() =>
          faker.number.float({
            min: 0,
            max: 10,
            multipleOf: 0.25,
            fractionDigits: 6,
          })
        ).toThrow(
          new FakerError(
            'multipleOf and fractionDigits cannot be set at the same time.'
          )
        );
      });

      it('throws an error for non integer fractionDigits numbers', () => {
        expect(() => faker.number.float({ fractionDigits: 1.337 })).toThrow(
          new FakerError('fractionDigits should be an integer.')
        );
      });

      it('throws an error for negative fractionDigits', () => {
        expect(() => faker.number.float({ fractionDigits: -2 })).toThrow(
          new FakerError('fractionDigits should be greater than or equal to 0.')
        );
      });

      it('throws an error for multipleOf 0', () => {
        expect(() => faker.number.float({ multipleOf: 0 })).toThrow(
          new FakerError('multipleOf should be greater than 0.')
        );
      });

      it('throws an error for negative multipleOf', () => {
        expect(() => faker.number.float({ multipleOf: -0.01 })).toThrow(
          new FakerError('multipleOf should be greater than 0.')
        );
      });

      it('should not modify the input object', () => {
        expect(() =>
          faker.number.float(Object.freeze({ min: 1, max: 2 }))
        ).not.toThrow();
      });

      it('should throw when min > max', () => {
        const min = 10;
        const max = 9;

        expect(() => {
          faker.number.float({ min, max });
        }).toThrow(
          new FakerError(`Max ${max} should be greater than min ${min}.`)
        );
      });
    });

    describe('binary', () => {
      it('generates single binary character when no additional argument was provided', () => {
        const binary = faker.number.binary();

        expect(binary).toBeTypeOf('string');
        expect(binary).toSatisfy(isBinary);

        expect(binary).toHaveLength(1);
      });

      it('generates a random binary string with a custom max value', () => {
        const binary = faker.number.binary(5);

        expect(binary).toBeTypeOf('string');
        expect(binary).toSatisfy(isBinary);

        const binaryNum = Number.parseInt(binary, 2);
        expect(binaryNum).toBeLessThanOrEqual(5);
      });

      it('generates a random binary in a specific range', () => {
        const binary = faker.number.binary({ min: 15, max: 255 });

        expect(binary).toBeTypeOf('string');
        expect(binary).toSatisfy(isBinary);

        const binaryNum = Number.parseInt(binary, 2);
        expect(binaryNum).toBeLessThanOrEqual(255);
        expect(binaryNum).greaterThanOrEqual(15);
      });

      it('should throw when min > max', () => {
        const min = 10;
        const max = 9;

        expect(() => {
          faker.number.binary({ min, max });
        }).toThrow(
          new FakerError(`Max ${max} should be greater than min ${min}.`)
        );
      });

      it('should throw when there is no integer between min and max', () => {
        expect(() => {
          faker.number.binary({ min: 2.1, max: 2.9 });
        }).toThrow(
          new FakerError(`No suitable integer value between 2.1 and 2.9 found.`)
        );
      });
    });

    describe('octal', () => {
      it('generates single octal character when no additional argument was provided', () => {
        const octal = faker.number.octal();

        expect(octal).toBeTypeOf('string');
        expect(octal).toSatisfy(isOctal);

        expect(octal).toHaveLength(1);
      });

      it('generates a random octal string with a custom max value', () => {
        const octal = faker.number.octal(5);

        expect(octal).toBeTypeOf('string');
        expect(octal).toSatisfy(isOctal);

        const octalNum = Number.parseInt(octal, 8);
        expect(octalNum).toBeLessThanOrEqual(5);
      });

      it('generates a random octal in a specific range', () => {
        const octal = faker.number.octal({ min: 15, max: 255 });

        expect(octal).toBeTypeOf('string');
        expect(octal).toSatisfy(isOctal);

        const octalNum = Number.parseInt(octal, 8);
        expect(octalNum).toBeLessThanOrEqual(255);
        expect(octalNum).greaterThanOrEqual(15);
      });

      it('should throw when min > max', () => {
        const min = 10;
        const max = 9;

        expect(() => {
          faker.number.octal({ min, max });
        }).toThrow(
          new FakerError(`Max ${max} should be greater than min ${min}.`)
        );
      });

      it('should throw when there is no integer between min and max', () => {
        expect(() => {
          faker.number.octal({ min: 2.1, max: 2.9 });
        }).toThrow(
          new FakerError(`No suitable integer value between 2.1 and 2.9 found.`)
        );
      });
    });

    describe('hex', () => {
      it('generates single hex character when no additional argument was provided', () => {
        const hex = faker.number.hex();

        expect(hex).toBeTypeOf('string');
        expect(hex).toSatisfy(isHexadecimal);

        expect(hex).toHaveLength(1);
      });

      it('generates a random hex string', () => {
        const hex = faker.number.hex(5);

        expect(hex).toBeTypeOf('string');
        expect(hex).toSatisfy(isHexadecimal);
      });

      it('generates a random hex in a specific range', () => {
        const hex = faker.number.hex({ min: 15, max: 255 });

        expect(hex).toBeTypeOf('string');
        expect(hex).toSatisfy(isHexadecimal);

        const hexNum = Number.parseInt(hex, 16);
        expect(hexNum).toBeLessThanOrEqual(255);
        expect(hexNum).greaterThanOrEqual(15);
      });

      it('should throw when min > max', () => {
        const min = 10;
        const max = 9;

        expect(() => {
          faker.number.hex({ min, max });
        }).toThrow(
          new FakerError(`Max ${max} should be greater than min ${min}.`)
        );
      });

      it('should throw when there is no integer between min and max', () => {
        expect(() => {
          faker.number.hex({ min: 2.1, max: 2.9 });
        }).toThrow(
          new FakerError(`No suitable integer value between 2.1 and 2.9 found.`)
        );
      });
    });

    describe('bigInt', () => {
      it('should generate a bigInt value', () => {
        const generateBigInt = faker.number.bigInt();
        expect(generateBigInt).toBeTypeOf('bigint');
      });

      it('should generate a big bigInt value with low delta', () => {
        const generateBigInt = faker.number.bigInt({
          min: 999999999n,
          max: 1000000000n,
        });
        expect(generateBigInt).toBeTypeOf('bigint');
        expect(generateBigInt).toBeGreaterThanOrEqual(999999999n);
        expect(generateBigInt).toBeLessThanOrEqual(1000000000n);
      });

      it('should return a random bigint given a maximum value as BigInt', () => {
        const generateBigInt = faker.number.bigInt(10n);
        expect(generateBigInt).toBeGreaterThanOrEqual(0n);
        expect(generateBigInt).toBeLessThanOrEqual(10n);
      });

      it('should return a random bigint given a maximum value as Object', () => {
        const generateBigInt = faker.number.bigInt({ max: 10n });
        expect(generateBigInt).toBeGreaterThanOrEqual(0n);
        expect(generateBigInt).toBeLessThanOrEqual(10n);
      });

      it('should return a random bigint given a maximum value of 0', () => {
        expect(faker.number.bigInt({ max: 0n })).toBe(0n);
      });

      it('should return a random bigint given a negative bigint minimum and maximum value of 0', () => {
        const generateBigInt = faker.number.bigInt({ min: -100n, max: 0n });
        expect(generateBigInt).toBeGreaterThanOrEqual(-100n);
        expect(generateBigInt).toBeLessThanOrEqual(0n);
      });

      it('should return a random bigint between a range', () => {
        const randomBigInt = faker.number.bigInt({ min: 22, max: 33 });
        expect(randomBigInt).toBeGreaterThanOrEqual(22);
        expect(randomBigInt).toBeLessThanOrEqual(33);
      });

      it('should return a random bigint for a very large range', () => {
        const randomBigInt = faker.number.bigInt({
          min: 0n,
          max: 10000000000000000000000n,
        });
        expect(randomBigInt).toBeGreaterThanOrEqual(0n);
        expect(randomBigInt).toBeLessThanOrEqual(10000000000000000000000n);
      });

      it('should not mutate the input object', () => {
        const input: {
          min?: bigint;
          max?: bigint;
          otherProperty: string;
        } = Object.freeze({
          min: 1n,
          otherProperty: 'hello darkness my old friend',
        });

        expect(() => faker.number.bigInt(input)).not.toThrow();
      });

      it('should throw when min > max', () => {
        const min = 10000n;
        const max = 999n;

        expect(() => {
          faker.number.bigInt({ min, max });
        }).toThrow(
          new FakerError(`Max ${max} should be larger then min ${min}.`)
        );
      });
    });

    describe('romanNumeral', () => {
      it('should generate a Roman numeral within default range', () => {
        const roman = faker.number.romanNumeral();
        expect(roman).toBeTypeOf('string');
        expect(roman).toMatch(/^[IVXLCDM]+$/);
      });

      it('should generate a Roman numeral with max value of 1000', () => {
        const roman = faker.number.romanNumeral(1000);
        expect(roman).toMatch(/^[IVXLCDM]+$/);
      });

      it.each(
        Object.entries({
          I: 1,
          IV: 4,
          IX: 9,
          X: 10,
          XXVII: 27,
          XC: 90,
          XCIX: 99,
          CCLXIII: 263,
          DXXXVI: 536,
          DCCXIX: 719,
          MDCCCLI: 1851,
          MDCCCXCII: 1892,
          MMCLXXXIII: 2183,
          MMCMXLIII: 2943,
          MMMDCCLXVI: 3766,
          MMMDCCLXXIV: 3774,
          MMMCMXCIX: 3999,
        })
      )(
        'should generate a Roman numeral %s for value %d',
        (expected: string, value: number) => {
          const mock = vi.spyOn(faker.number, 'int');
          mock.mockReturnValue(value);
          const actual = faker.number.romanNumeral();
          mock.mockRestore();
          expect(actual).toBe(expected);
        }
      );

      it('should throw when min value is less than 1', () => {
        expect(() => {
          faker.number.romanNumeral({ min: 0 });
        }).toThrow(new FakerError('Min value 0 should be 1 or greater.'));
      });

      it('should throw when max value is greater than 3999', () => {
        expect(() => {
          faker.number.romanNumeral({ max: 4000 });
        }).toThrow(new FakerError('Max value 4000 should be 3999 or less.'));
      });

      it('should throw when max value is less than min value', () => {
        expect(() => {
          faker.number.romanNumeral({ min: 500, max: 100 });
        }).toThrow(new FakerError('Max 100 should be greater than min 500.'));
      });
    });

    describe('exponentialDistribution', () => {
      it('should generate a number between 0 and 1 by default', () => {
        const actual = faker.number.exponentialDistribution();
        expect(actual).toBeTypeOf('number');
        expect(actual).toBeGreaterThanOrEqual(0);
        expect(actual).toBeLessThan(1);
      });

      it('should generate a number between 0 and 10', () => {
        const actual = faker.number.exponentialDistribution(10);
        expect(actual).toBeTypeOf('number');
        expect(actual).toBeGreaterThanOrEqual(0);
        expect(actual).toBeLessThan(10);
      });

      it('should generate a number between 10 and 100', () => {
        const actual = faker.number.exponentialDistribution({
          min: 10,
          max: 100,
        });
        expect(actual).toBeTypeOf('number');
        expect(actual).toBeGreaterThanOrEqual(10);
        expect(actual).toBeLessThan(100);
      });

      it('should generate a number with low base', () => {
        const results = Array.from({ length: 10 }, (_, i) => i);
        for (let i = 0; i < 1000; i++) {
          results[
            Math.floor(
              faker.number.exponentialDistribution({ max: 10, base: 0.1 })
            )
          ]++;
        }

        expect(results[0]).toBeLessThan(75);
        expect(results[9]).toBeGreaterThan(200);
      });

      it('should generate a number with high base', () => {
        const results = Array.from({ length: 10 }, (_, i) => i);
        for (let i = 0; i < 1000; i++) {
          results[
            Math.floor(
              faker.number.exponentialDistribution({ max: 10, base: 10 })
            )
          ]++;
        }

        expect(results[0]).toBeGreaterThan(200);
        expect(results[9]).toBeLessThan(75);
      });

      it('should generate a number with low bias', () => {
        const results = Array.from({ length: 10 }, (_, i) => i);
        for (let i = 0; i < 1000; i++) {
          results[
            Math.floor(
              faker.number.exponentialDistribution({ max: 10, bias: -9 })
            )
          ]++;
        }

        expect(results[0]).toBeGreaterThan(200);
        expect(results[9]).toBeLessThan(75);
      });

      it('should generate a number with high bias', () => {
        const results = Array.from({ length: 10 }, (_, i) => i);
        for (let i = 0; i < 1000; i++) {
          results[
            Math.floor(
              faker.number.exponentialDistribution({ max: 10, bias: 9 })
            )
          ]++;
        }

        expect(results[0]).toBeLessThan(75);
        expect(results[9]).toBeGreaterThan(200);
      });
    });

    it('should throw when min > max', () => {
      const min = 10;
      const max = 9;

      expect(() => {
        faker.number.exponentialDistribution({ min, max });
      }).toThrow(
        new FakerError(`Max ${max} should be greater than min ${min}.`)
      );
    });

    it('should throw when base is less than or equal to 0', () => {
      expect(() => {
        faker.number.exponentialDistribution({ base: 0 });
      }).toThrow(new FakerError('Base should be greater than 0.'));
      expect(() => {
        faker.number.exponentialDistribution({ base: -1 });
      }).toThrow(new FakerError('Base should be greater than 0.'));
    });
  });

  describe('value range tests', () => {
    const customFaker = new SimpleFaker();
    // @ts-expect-error: access private member field
    const randomizer = customFaker._randomizer;
    describe('int', () => {
      it('should be able to return 0', () => {
        randomizer.next = () => 0;
        const actual = customFaker.number.int();
        expect(actual).toBe(0);
      });

      // TODO @ST-DDT 2023-10-12: This requires a randomizer with 53 bits of precision
      it.todo('should be able to return MAX_SAFE_INTEGER', () => {
        randomizer.next = () => MERSENNE_MAX_VALUE;
        const actual = customFaker.number.int();
        expect(actual).toBe(Number.MAX_SAFE_INTEGER);
      });
    });

    describe('float', () => {
      it('should be able to return 0', () => {
        randomizer.next = () => 0;
        const actual = customFaker.number.float();
        expect(actual).toBe(0);
      });

      it('should be able to return almost 1', () => {
        randomizer.next = () => MERSENNE_MAX_VALUE;
        const actual = customFaker.number.float();
        expect(actual).toBe(MERSENNE_MAX_VALUE);
      });
    });
  });
});
