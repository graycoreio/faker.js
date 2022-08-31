import type { Faker } from '../..';
import { toDate } from '../../internal/toDate';

export interface Cvss {
  score: number;
  vector: string;
  rating: 'none' | 'low' | 'medium' | 'high' | 'critical';
}

export class SecurityModule {
  constructor(private readonly faker: Faker) {
    // Bind `this` so namespaced is working correctly
    for (const name of Object.getOwnPropertyNames(SecurityModule.prototype)) {
      if (name === 'constructor' || typeof this[name] !== 'function') {
        continue;
      }
      this[name] = this[name].bind(this);
    }
  }

  /**
   * Generates a random CVE between the given boundaries.
   * Based on:
   * https://www.cve.org/
   *
   * @param options The options to use. Defaults to `{}`.
   * @param options.from The early date boundary. Defaults to `1999-01-01T00:00:00.000Z`.
   * @param options.to The late date boundary. Defaults to `now`.
   *
   * @example
   * faker.security.cve() // 'CVE-2011-0762'
   * faker.security.cve({from:'2020-01-01T00:00:00.000Z', to: '2030-01-01T00:00:00.000Z') // 'CVE-2028-0762'
   */
  cve(
    options: {
      from?: string | Date | number;
      to?: string | Date | number;
    } = {}
  ): string {
    const fromDateTime = toDate(options?.from || '1999-01-01T00:00:00.000Z');
    const toDateTime = toDate(options?.to);

    return [
      'CVE',
      // Year
      this.faker.date.between(fromDateTime, toDateTime).getFullYear(),
      // Sequence in the year
      this.faker.random.numeric(5, { allowLeadingZeros: true }),
    ].join('-');
  }

  /**
   * Generates a random CWE (Common Weakness Enumeration) identifier.
   * Based on:
   * https://cwe.mitre.org/data/index.html
   *
   * @example
   * faker.security.cwe() // 'CWE-####'
   */
  cwe(): string {
    return ['CWE', this.faker.datatype.number({ min: 0, max: 1388 })].join('-');
  }

  /**
   * Generates a random CVSS.
   * Based on:
   * https://www.first.org/cvss/calculator/3.1
   *
   * @example
   * faker.security.cvss()
   */
  cvss(): Cvss {
    return {
      score: 0.5,
      vector: [
        'CVSS:3.1',
        `AV:${this.faker.helpers.arrayElement('NALP'.split(''))}`,
        `AC:${this.faker.helpers.arrayElement('LH'.split(''))}`,
        `PR:${this.faker.helpers.arrayElement('NLH'.split(''))}`,
        `UI:${this.faker.helpers.arrayElement('NR'.split(''))}`,
        `S:${this.faker.helpers.arrayElement('UC'.split(''))}`,
        `C:${this.faker.helpers.arrayElement('NLH'.split(''))}`,
        `I:${this.faker.helpers.arrayElement('NLH'.split(''))}`,
        `A:${this.faker.helpers.arrayElement('NLH'.split(''))}`,
      ].join('/'),
      rating: this.faker.helpers.arrayElement([
        'none',
        'low',
        'medium',
        'high',
        'critical',
      ]),
    };
  }
}
