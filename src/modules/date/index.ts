import type { Faker } from '../..';
import type { DateEntryDefinition } from '../../definitions';
import { FakerError } from '../../errors/faker-error';
import { toDate } from '../../internal/date';
import { assertLocaleData } from '../../internal/locale-proxy';
import { SimpleModuleBase } from '../../internal/module-base';

/**
 * Module to generate dates (without methods requiring localized data).
 */
export class SimpleDateModule extends SimpleModuleBase {
  /**
   * Generates a random date that can be either in the past or in the future.
   *
   * @param options The optional options object.
   * @param options.refDate The date to use as reference point for the newly generated date. Defaults to `faker.defaultRefDate()`.
   *
   * @see faker.date.between(): For generating dates in a specific range.
   * @see faker.date.past(): For generating dates explicitly in the past.
   * @see faker.date.future(): For generating dates explicitly in the future.
   *
   * @example
   * faker.date.anytime() // '2025-02-05T14:12:45.320Z'
   *
   * @since 8.0.0
   */
  anytime(
    options: {
      /**
       * The date to use as reference point for the newly generated date.
       *
       * @default faker.defaultRefDate()
       */
      refDate?: string | Date | number;
    } = {}
  ): Date {
    const { refDate = this.faker.defaultRefDate() } = options;
    const time = toDate(refDate).getTime();

    return this.between({
      from: time - 1000 * 60 * 60 * 24 * 365,
      to: time + 1000 * 60 * 60 * 24 * 365,
    });
  }

  /**
   * Generates a random date in the past.
   *
   * @param options The optional options object.
   * @param options.years The range of years the date may be in the past. Defaults to `1`.
   * @param options.refDate The date to use as reference point for the newly generated date. Defaults to `faker.defaultRefDate()`.
   *
   * @see faker.date.recent(): For generating dates in the recent past (days instead of years).
   *
   * @example
   * faker.date.past() // '2024-07-20T06:36:22.111Z'
   * faker.date.past({ years: 10 }) // '2022-02-26T09:35:17.864Z'
   * faker.date.past({ years: 10, refDate: '2020-01-01T00:00:00.000Z' }) // '2016-01-12T02:04:17.675Z'
   *
   * @since 8.0.0
   */
  past(
    options: {
      /**
       * The range of years the date may be in the past.
       *
       * @default 1
       */
      years?: number;
      /**
       * The date to use as reference point for the newly generated date.
       *
       * @default faker.defaultRefDate()
       */
      refDate?: string | Date | number;
    } = {}
  ): Date {
    const { years = 1, refDate = this.faker.defaultRefDate() } = options;

    if (years <= 0) {
      throw new FakerError('Years must be greater than 0.');
    }

    const time = toDate(refDate).getTime();

    return this.between({
      from: time - years * 365 * 24 * 3600 * 1000,
      to: time - 1000,
    });
  }

  /**
   * Generates a random date in the future.
   *
   * @param options The optional options object.
   * @param options.years The range of years the date may be in the future. Defaults to `1`.
   * @param options.refDate The date to use as reference point for the newly generated date. Defaults to `faker.defaultRefDate()`.
   *
   * @see faker.date.soon(): For generating dates in the near future (days instead of years).
   *
   * @example
   * faker.date.future() // '2025-07-20T06:36:23.111Z'
   * faker.date.future({ years: 10 }) // '2032-02-24T09:35:18.864Z'
   * faker.date.future({ years: 10, refDate: '2020-01-01T00:00:00.000Z' }) // '2026-01-09T02:04:18.675Z'
   *
   * @since 8.0.0
   */
  future(
    options: {
      /**
       * The range of years the date may be in the future.
       *
       * @default 1
       */
      years?: number;
      /**
       * The date to use as reference point for the newly generated date.
       *
       * @default faker.defaultRefDate()
       */
      refDate?: string | Date | number;
    } = {}
  ): Date {
    const { years = 1, refDate = this.faker.defaultRefDate() } = options;

    if (years <= 0) {
      throw new FakerError('Years must be greater than 0.');
    }

    const time = toDate(refDate).getTime();

    return this.between({
      from: time + 1000,
      to: time + years * 365 * 24 * 3600 * 1000,
    });
  }

  /**
   * Generates a random date between the given boundaries.
   *
   * @param options The options object.
   * @param options.from The early date boundary.
   * @param options.to The late date boundary.
   *
   * @throws If `from` or `to` are not provided.
   * @throws If `from` is after `to`.
   *
   * @example
   * faker.date.between({ from: '2020-01-01T00:00:00.000Z', to: '2030-01-01T00:00:00.000Z' }) // '2025-06-27T19:34:39.059Z'
   *
   * @since 8.0.0
   */
  between(options: {
    /**
     * The early date boundary.
     */
    from: string | Date | number;
    /**
     * The late date boundary.
     */
    to: string | Date | number;
  }): Date {
    // TODO @matthewmayer 2023-03-27: Consider removing in v10 as this check is only needed in JS
    if (options == null || options.from == null || options.to == null) {
      throw new FakerError(
        'Must pass an options object with `from` and `to` values.'
      );
    }

    const { from, to } = options;

    const fromMs = toDate(from, 'from').getTime();
    const toMs = toDate(to, 'to').getTime();
    if (fromMs > toMs) {
      throw new FakerError('`from` date must be before `to` date.');
    }

    return new Date(this.faker.number.int({ min: fromMs, max: toMs }));
  }

  /**
   * Generates random dates between the given boundaries. The dates will be returned in an array sorted in chronological order.
   *
   * @param options The options object.
   * @param options.from The early date boundary.
   * @param options.to The late date boundary.
   * @param options.count The number of dates to generate. Defaults to `3`.
   *
   * @throws If `from` or `to` are not provided.
   * @throws If `from` is after `to`.
   *
   * @example
   * faker.date.betweens({ from: '2020-01-01T00:00:00.000Z', to: '2030-01-01T00:00:00.000Z' }) // [ '2025-06-27T19:34:39.059Z', '2026-01-10T21:28:14.545Z', '2027-02-25T14:04:55.663Z' ]
   * faker.date.betweens({ from: '2020-01-01T00:00:00.000Z', to: '2030-01-01T00:00:00.000Z', count: 2 }) // [ '2024-03-27T14:39:48.843Z', '2025-06-13T10:59:54.311Z' ]
   * faker.date.betweens({ from: '2020-01-01T00:00:00.000Z', to: '2030-01-01T00:00:00.000Z', count: { min: 2, max: 5 }}) // [ '2023-11-01T17:05:05.418Z', '2024-05-17T12:08:45.549Z', '2028-12-01T15:31:21.089Z', '2029-08-21T06:14:29.540Z' ]
   *
   * @since 8.0.0
   */
  betweens(options: {
    /**
     * The early date boundary.
     */
    from: string | Date | number;
    /**
     * The late date boundary.
     */
    to: string | Date | number;
    /**
     * The number of dates to generate.
     *
     * @default 3
     */
    count?:
      | number
      | {
          /**
           * The minimum number of dates to generate.
           */
          min: number;
          /**
           * The maximum number of dates to generate.
           */
          max: number;
        };
  }): Date[] {
    // TODO @matthewmayer 2023-03-27: Consider removing in v10 as this check is only needed in JS
    if (options == null || options.from == null || options.to == null) {
      throw new FakerError(
        'Must pass an options object with `from` and `to` values.'
      );
    }

    const { from, to, count = 3 } = options;
    return this.faker.helpers
      .multiple(() => this.between({ from, to }), { count })
      .sort((a, b) => a.getTime() - b.getTime());
  }

  /**
   * Generates a random date in the recent past.
   *
   * @param options The optional options object.
   * @param options.days The range of days the date may be in the past. Defaults to `1`.
   * @param options.refDate The date to use as reference point for the newly generated date. Defaults to `faker.defaultRefDate()`.
   *
   * @see faker.date.past(): For generating dates further back in time (years instead of days).
   *
   * @example
   * faker.date.recent() // '2024-12-31T12:10:16.938Z'
   * faker.date.recent({ days: 10 }) // '2024-12-29T02:38:42.898Z'
   * faker.date.recent({ days: 10, refDate: '2020-01-01T00:00:00.000Z' }) // '2019-12-28T00:39:46.954Z'
   *
   * @since 8.0.0
   */
  recent(
    options: {
      /**
       * The range of days the date may be in the past.
       *
       * @default 1
       */
      days?: number;
      /**
       * The date to use as reference point for the newly generated date.
       *
       * @default faker.defaultRefDate()
       */
      refDate?: string | Date | number;
    } = {}
  ): Date {
    const { days = 1, refDate = this.faker.defaultRefDate() } = options;

    if (days <= 0) {
      throw new FakerError('Days must be greater than 0.');
    }

    const time = toDate(refDate).getTime();

    return this.between({
      from: time - days * 24 * 3600 * 1000,
      to: time - 1000,
    });
  }

  /**
   * Generates a random date in the near future.
   *
   * @param options The optional options object.
   * @param options.days The range of days the date may be in the future. Defaults to `1`.
   * @param options.refDate The date to use as reference point for the newly generated date. Defaults to `faker.defaultRefDate()`.
   *
   * @see faker.date.future(): For generating dates further in the future (years instead of days).
   *
   * @example
   * faker.date.soon() // '2025-01-01T12:10:17.938Z'
   * faker.date.soon({ days: 10 }) // '2025-01-08T02:38:43.898Z'
   * faker.date.soon({ days: 10, refDate: '2020-01-01T00:00:00.000Z' }) // '2020-01-07T00:39:47.954Z'
   *
   * @since 8.0.0
   */
  soon(
    options: {
      /**
       * The range of days the date may be in the future.
       *
       * @default 1
       */
      days?: number;
      /**
       * The date to use as reference point for the newly generated date.
       *
       * @default faker.defaultRefDate()
       */
      refDate?: string | Date | number;
    } = {}
  ): Date {
    const { days = 1, refDate = this.faker.defaultRefDate() } = options;

    if (days <= 0) {
      throw new FakerError('Days must be greater than 0.');
    }

    const time = toDate(refDate).getTime();

    return this.between({
      from: time + 1000,
      to: time + days * 24 * 3600 * 1000,
    });
  }

  /**
   * Returns a random birthdate. By default, the birthdate is generated for an adult between 18 and 80 years old.
   * But you can customize the `'age'` range or the `'year'` range to generate a more specific birthdate.
   *
   * @param options The options to use to generate the birthdate.
   * @param options.refDate The date to use as reference point for the newly generated date. Defaults to `faker.defaultRefDate()`.
   *
   * @example
   * faker.date.birthdate() // '1978-07-30T03:46:09.872Z'
   *
   * @since 7.0.0
   */
  birthdate(options?: {
    /**
     * The date to use as reference point for the newly generated date.
     *
     * @default faker.defaultRefDate()
     */
    refDate?: string | Date | number;
  }): Date;
  /**
   * Returns a random birthdate for a given age range.
   *
   * @param options The options to use to generate the birthdate.
   * @param options.mode `'age'` to generate a birthdate based on the age range. It is also possible to generate a birthdate based on a `'year'` range.
   * @param options.min The minimum age to generate a birthdate for.
   * @param options.max The maximum age to generate a birthdate for.
   * @param options.refDate The date to use as reference point for the newly generated date. Defaults to `faker.defaultRefDate()`.
   *
   * @example
   * faker.date.birthdate({ mode: 'age', min: 18, max: 65 }) // '1985-05-06T04:59:20.027Z'
   *
   * @since 7.0.0
   */
  birthdate(options: {
    /**
     * `'age'` to generate a birthdate based on the age range.
     * It is also possible to generate a birthdate based on a `'year'` range.
     */
    mode: 'age';
    /**
     * The minimum age to generate a birthdate for.
     */
    min: number;
    /**
     * The maximum age to generate a birthdate for.
     */
    max: number;
    /**
     * The date to use as reference point for the newly generated date.
     *
     * @default faker.defaultRefDate()
     */
    refDate?: string | Date | number;
  }): Date;
  /**
   * Returns a random birthdate in the given range of years.
   *
   * @param options The options to use to generate the birthdate.
   * @param options.mode `'year'` to generate a birthdate based on the year range. It is also possible to generate a birthdate based on a `'age'` range.
   * @param options.min The minimum year to generate a birthdate in.
   * @param options.max The maximum year to generate a birthdate in.
   *
   * @example
   * faker.date.birthdate({ mode: 'year', min: 1900, max: 2000 }) // '1955-06-07T02:00:33.353Z'
   *
   * @since 7.0.0
   */
  birthdate(options: {
    /**
     * `'year'` to generate a birthdate based on the year range.
     * It is also possible to generate a birthdate based on an `'age'` range.
     */
    mode: 'year';
    /**
     * The minimum year to generate a birthdate in.
     */
    min: number;
    /**
     * The maximum year to generate a birthdate in.
     */
    max: number;
  }): Date;
  /**
   * Returns a random birthdate. By default, the birthdate is generated for an adult between 18 and 80 years old.
   * But you can customize the `'age'` range or the `'year'` range to generate a more specific birthdate.
   *
   * @param options The options to use to generate the birthdate.
   * @param options.mode Either `'age'` or `'year'` to generate a birthdate based on the age or year range.
   * @param options.min The minimum age or year to generate a birthdate in.
   * @param options.max The maximum age or year to generate a birthdate in.
   * @param options.refDate The date to use as reference point for the newly generated date.
   * Only used when `mode` is `'age'`.
   * Defaults to `faker.defaultRefDate()`.
   *
   * @example
   * faker.date.birthdate() // '1978-07-30T03:46:09.872Z'
   * faker.date.birthdate({ mode: 'age', min: 18, max: 65 }) // '1993-04-30T22:38:05.154Z'
   * faker.date.birthdate({ mode: 'year', min: 1900, max: 2000 }) // '1960-11-17T03:11:01.233Z'
   *
   * @since 7.0.0
   */
  birthdate(
    options?:
      | {
          /**
           * The date to use as reference point for the newly generated date.
           *
           * @default faker.defaultRefDate()
           */
          refDate?: string | Date | number;
        }
      | {
          /**
           * Either `'age'` or `'year'` to generate a birthdate based on the age or year range.
           */
          mode: 'age' | 'year';
          /**
           * The minimum age/year to generate a birthdate for/in.
           */
          min: number;
          /**
           * The maximum age/year to generate a birthdate for/in.
           */
          max: number;
          /**
           * The date to use as reference point for the newly generated date.
           * Only used when `mode` is `'age'`.
           *
           * @default faker.defaultRefDate()
           */
          refDate?: string | Date | number;
        }
  ): Date;
  birthdate(
    options: {
      mode?: 'age' | 'year';
      min?: number;
      max?: number;
      refDate?: string | Date | number;
    } = {}
  ): Date {
    const {
      mode = 'age',
      min = 18,
      max = 80,
      refDate: rawRefDate = this.faker.defaultRefDate(),
      mode: originalMode,
      min: originalMin,
      max: originalMax,
    } = options;

    // TODO @ST-DDT 2024-03-17: Remove check in v10
    const optionsSet = [originalMin, originalMax, originalMode].filter(
      (x) => x != null
    ).length;
    if (optionsSet % 3 !== 0) {
      throw new FakerError(
        "The 'min', 'max', and 'mode' options must be set together."
      );
    }

    const refDate = toDate(rawRefDate);
    const refYear = refDate.getUTCFullYear();

    switch (mode) {
      case 'age': {
        // Add one day to the `from` date to avoid generating the same date as the reference date.
        const oneDay = 24 * 60 * 60 * 1000;
        const from =
          new Date(refDate).setUTCFullYear(refYear - max - 1) + oneDay;
        const to = new Date(refDate).setUTCFullYear(refYear - min);

        if (from > to) {
          throw new FakerError(
            `Max age ${max} should be greater than or equal to min age ${min}.`
          );
        }

        return this.between({ from, to });
      }

      case 'year': {
        // Avoid generating dates on the first and last date of the year
        // to avoid running into other years depending on the timezone.
        const from = new Date(Date.UTC(0, 0, 2)).setUTCFullYear(min);
        const to = new Date(Date.UTC(0, 11, 30)).setUTCFullYear(max);

        if (from > to) {
          throw new FakerError(
            `Max year ${max} should be greater than or equal to min year ${min}.`
          );
        }

        return this.between({ from, to });
      }
    }
  }
}

/**
 * Module to generate dates.
 *
 * ### Overview
 *
 * To quickly generate a date in the past, use [`recent()`](https://fakerjs.dev/api/date.html#recent) (last day) or [`past()`](https://fakerjs.dev/api/date.html#past) (last year).
 * To quickly generate a date in the future, use [`soon()`](https://fakerjs.dev/api/date.html#soon) (next day) or [`future()`](https://fakerjs.dev/api/date.html#future) (next year).
 * For a realistic birthdate for an adult, use [`birthdate()`](https://fakerjs.dev/api/date.html#birthdate).
 *
 * For more control, any of these methods can be customized with further options, or use [`between()`](https://fakerjs.dev/api/date.html#between) to generate a single date between two dates, or [`betweens()`](https://fakerjs.dev/api/date.html#betweens) for multiple dates.
 *
 * If you need to generate a date range (start-end), you can do so using either of these two methods:
 *
 * - `const start = faker.date.soon(); const end = faker.date.soon({ refDate: start });`
 * - `const [start, end] = faker.date.betweens({ from, to, count: 2 });` // does not work with tsconfig's `noUncheckedIndexedAccess: true`
 *
 * Dates can be specified as Javascript Date objects, strings or UNIX timestamps.
 * For example to generate a date between 1st January 2000 and now, use:
 * ```ts
 * faker.date.between({ from: '2000-01-01', to: Date.now() });
 * ```
 *
 * You can generate random localized month and weekday names using [`month()`](https://fakerjs.dev/api/date.html#month) and [`weekday()`](https://fakerjs.dev/api/date.html#weekday).
 *
 * These methods have additional concerns about reproducibility, see [Reproducible Results](https://fakerjs.dev/guide/usage.html#reproducible-results).
 */
export class DateModule extends SimpleDateModule {
  constructor(protected readonly faker: Faker) {
    super(faker);
  }

  /**
   * Returns a random name of a month.
   *
   * @param options The optional options to use.
   * @param options.abbreviated Whether to return an abbreviation. Defaults to `false`.
   * @param options.context Whether to return the name of a month in the context of a date. In the default `en` locale this has no effect, however, in other locales like `fr` or `ru`, this may affect grammar or capitalization, for example `'январь'` with `{ context: false }` and `'января'` with `{ context: true }` in `ru`. Defaults to `false`.
   *
   * @example
   * faker.date.month() // 'June'
   * faker.date.month({ abbreviated: true }) // 'May'
   * faker.date.month({ context: true }) // 'March'
   * faker.date.month({ abbreviated: true, context: true }) // 'Jun'
   *
   * @since 3.0.1
   */
  month(
    options: {
      /**
       * Whether to return an abbreviation.
       *
       * @default false
       */
      abbreviated?: boolean;
      /**
       * Whether to return the name of a month in the context of a date.
       *
       * In the default `en` locale this has no effect,
       * however, in other locales like `fr` or `ru`, this may affect grammar or capitalization,
       * for example `'январь'` with `{ context: false }` and `'января'` with `{ context: true }` in `ru`.
       *
       * @default false
       */
      context?: boolean;
    } = {}
  ): string {
    const { abbreviated = false, context = false } = options;

    const source = this.faker.definitions.date.month;
    let type: keyof DateEntryDefinition;
    if (abbreviated) {
      const useContext = context && source['abbr_context'] != null;
      type = useContext ? 'abbr_context' : 'abbr';
    } else {
      const useContext = context && source['wide_context'] != null;
      type = useContext ? 'wide_context' : 'wide';
    }

    const values = source[type];
    assertLocaleData(values, 'date.month', type);
    return this.faker.helpers.arrayElement(values);
  }

  /**
   * Returns a random day of the week.
   *
   * @param options The optional options to use.
   * @param options.abbreviated Whether to return an abbreviation. Defaults to `false`.
   * @param options.context Whether to return the day of the week in the context of a date. In the default `en` locale this has no effect, however, in other locales like `fr` or `ru`, this may affect grammar or capitalization, for example `'Lundi'` with `{ context: false }` and `'lundi'` with `{ context: true }` in `fr`. Defaults to `false`.
   *
   * @example
   * faker.date.weekday() // 'Sunday'
   * faker.date.weekday({ abbreviated: true }) // 'Tue'
   * faker.date.weekday({ context: true }) // 'Thursday'
   * faker.date.weekday({ abbreviated: true, context: true }) // 'Sun'
   *
   * @since 3.0.1
   */
  weekday(
    options: {
      /**
       * Whether to return an abbreviation.
       *
       * @default false
       */
      abbreviated?: boolean;
      /**
       * Whether to return the day of the week in the context of a date.
       *
       * In the default `en` locale this has no effect,
       * however, in other locales like `fr` or `ru`, this may affect grammar or capitalization,
       * for example `'Lundi'` with `{ context: false }` and `'lundi'` with `{ context: true }` in `fr`.
       *
       * @default false
       */
      context?: boolean;
    } = {}
  ): string {
    const { abbreviated = false, context = false } = options;

    const source = this.faker.definitions.date.weekday;
    let type: keyof DateEntryDefinition;
    if (abbreviated) {
      const useContext = context && source['abbr_context'] != null;
      type = useContext ? 'abbr_context' : 'abbr';
    } else {
      const useContext = context && source['wide_context'] != null;
      type = useContext ? 'wide_context' : 'wide';
    }

    const values = source[type];
    assertLocaleData(values, 'date.weekday', type);
    return this.faker.helpers.arrayElement(values);
  }

  /**
   * Returns a random IANA time zone name.
   *
   * The returned time zone is not tied to the current locale.
   *
   * @see [IANA Time Zone Database](https://www.iana.org/time-zones)
   * @see faker.location.timeZone(): For generating a timezone based on the current locale.
   *
   * @example
   * faker.location.timeZone() // 'Asia/Dili'
   *
   * @since 9.0.0
   */
  timeZone(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.date.time_zone
    );
  }
}
