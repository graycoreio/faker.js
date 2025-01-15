import { FakerError } from '../../errors/faker-error';
import { deprecated } from '../../internal/deprecated';
import { ModuleBase } from '../../internal/module-base';

/**
 * Represents a language with its full name, 2 character ISO 639-1 code, and 3 character ISO 639-2 code.
 */
export interface Language {
  /**
   * The full name for the language (e.g. `English`).
   */
  name: string;

  /**
   * The 2 character [ISO 639-1](https://en.wikipedia.org/wiki/ISO_639-1) code.
   */
  alpha2: string;

  /**
   * The 3 character [ISO 639-2](https://en.wikipedia.org/wiki/ISO_639-2) code.
   */
  alpha3: string;
}

/**
 * Module to generate addresses and locations. Prior to Faker 8.0.0, this module was known as `faker.address`.
 *
 * ### Overview
 *
 * For a typical street address for a locale, use [`streetAddress()`](https://fakerjs.dev/api/location.html#streetaddress), [`city()`](https://fakerjs.dev/api/location.html#city), [`state()`](https://fakerjs.dev/api/location.html#state)), and [`zipCode()`](https://fakerjs.dev/api/location.html#zipcode). Most locales provide localized versions for a specific country.
 *
 * If you need latitude and longitude coordinates, use [`latitude()`](https://fakerjs.dev/api/location.html#latitude) and [`longitude()`](https://fakerjs.dev/api/location.html#longitude), or [`nearbyGPSCoordinate()`](https://fakerjs.dev/api/location.html#nearbygpscoordinate) for a latitude/longitude near a given location.
 *
 * For a random country, you can use [`country()`](https://fakerjs.dev/api/location.html#country) or [`countryCode()`](https://fakerjs.dev/api/location.html#countrycode).
 */
export class LocationModule extends ModuleBase {
  /**
   * Generates random zip code for the entire locale or the given state.
   *
   * @param options The optional options object.
   * @param options.state The state to generate the zip code for.
   * If the current locale does not have a corresponding `postcode_by_state` definition, an error is thrown.
   *
   * @example
   * faker.location.zipCode() // '17839'
   * fakerEN_US.location.zipCode({ state: 'CA' }) // '90210'
   *
   * @since 8.0.0
   */
  zipCode(options?: {
    /**
     * The state to generate the zip code for.
     *
     * If the current locale does not have a corresponding `postcode_by_state` definition, an error is thrown.
     */
    state?: string;
  }): string;
  /**
   * Generates random zip code from specified format. If format is not specified,
   * the locale's zip format is used.
   *
   * @param options The format used to generate the zip code or an options object.
   * @param options.format The optional format used to generate the zip code.
   * By default, a random format is used from the locale zip formats.
   * This won't be used if the state option is specified.
   *
   * @see faker.helpers.replaceSymbols(): For more information about how the pattern is used.
   *
   * @example
   * faker.location.zipCode() // '17839'
   * faker.location.zipCode('####') // '6925'
   *
   * @since 8.0.0
   *
   * @deprecated Use `faker.location.zipCode()` or `faker.location.zipCode({ state })` or `faker.helpers.replaceSymbols(format)` instead.
   */
  zipCode(
    options?:
      | string
      | {
          /**
           * The optional format used to generate the zip code.
           *
           * This won't be used if the state option is specified.
           *
           * @default faker.definitions.location.postcode
           */
          format?: string;
        }
  ): string;
  /**
   * Generates random zip code from specified format. If format is not specified,
   * the locale's zip format is used.
   *
   * @param options The format used to generate the zip code or an options object.
   * @param options.state The state to generate the zip code for.
   * If the current locale does not have a corresponding `postcode_by_state` definition, an error is thrown.
   * @param options.format The optional format used to generate the zip code.
   * By default, a random format is used from the locale zip formats.
   * This won't be used if the state option is specified.
   *
   * @see faker.helpers.replaceSymbols(): For more information about how the pattern is used.
   *
   * @example
   * faker.location.zipCode() // '17839'
   * fakerEN_US.location.zipCode({ state: 'CA' }) // '90210'
   *
   * @since 8.0.0
   */
  zipCode(
    options?:
      | string
      | {
          /**
           * The state to generate the zip code for.
           *
           * If the current locale does not have a corresponding `postcode_by_state` definition, an error is thrown.
           */
          state?: string;
          /**
           * The optional format used to generate the zip code.
           *
           * This won't be used if the state option is specified.
           *
           * @default faker.definitions.location.postcode
           */
          format?: string;
        }
  ): string;
  /**
   * Generates random zip code from specified format. If format is not specified,
   * the locale's zip format is used.
   *
   * @param options The format used to generate the zip code or an options object.
   * @param options.state The state to generate the zip code for.
   * If the current locale does not have a corresponding `postcode_by_state` definition, an error is thrown.
   * @param options.format The optional format used to generate the zip code.
   * By default, a random format is used from the locale zip formats.
   * This won't be used if the state option is specified.
   *
   * @see faker.helpers.replaceSymbols(): For more information about how the pattern is used.
   *
   * @example
   * faker.location.zipCode() // '17839'
   * fakerEN_US.location.zipCode({ state: 'CA' }) // '90210'
   *
   * @since 8.0.0
   */
  zipCode(
    options:
      | string
      | {
          /**
           * The state to generate the zip code for.
           *
           * If the current locale does not have a corresponding `postcode_by_state` definition, an error is thrown.
           */
          state?: string;
          /**
           * The optional format used to generate the zip code.
           *
           * This won't be used if the state option is specified.
           *
           * @default faker.definitions.location.postcode
           */
          format?: string;
        } = {}
  ): string {
    if (typeof options === 'string') {
      options = { format: options };
    }

    const { state } = options;

    if (state != null) {
      const zipPattern =
        this.faker.definitions.location.postcode_by_state[state];

      if (zipPattern == null) {
        throw new FakerError(
          `No zip code definition found for state "${state}"`
        );
      }

      return this.faker.helpers.fake(zipPattern);
    }

    const { format } = options;

    if (format != null) {
      deprecated({
        deprecated:
          'faker.location.zipCode(format) and faker.location.zipCode({ format })',
        proposed:
          'faker.location.zipCode(), faker.location.zipCode({ state }), or faker.helpers.replaceSymbols(format)',
        since: '9.2.0',
        until: '10.0.0',
      });
      return this.faker.helpers.replaceSymbols(format);
    }

    let zipPattern = this.faker.definitions.location.postcode;

    if (typeof zipPattern === 'string') {
      zipPattern = [zipPattern];
    }

    zipPattern = this.faker.helpers.arrayElement(zipPattern);

    return this.faker.helpers.replaceSymbols(zipPattern);
  }

  /**
   * Generates a random localized city name.
   *
   * @example
   * faker.location.city() // 'East Jarretmouth'
   * fakerDE.location.city() // 'Bad Lilianadorf'
   *
   * @since 8.0.0
   */
  city(): string {
    return this.faker.helpers.fake(
      this.faker.definitions.location.city_pattern
    );
  }

  /**
   * Generates a random building number.
   *
   * @example
   * faker.location.buildingNumber() // '379'
   *
   * @since 8.0.0
   */
  buildingNumber(): string {
    return this.faker.helpers
      .arrayElement(this.faker.definitions.location.building_number)
      .replaceAll(/#+/g, (m) =>
        this.faker.string.numeric({
          length: m.length,
          allowLeadingZeros: false,
        })
      );
  }

  /**
   * Generates a random localized street name.
   *
   * @example
   * faker.location.street() // 'Schroeder Isle'
   *
   * @since 8.0.0
   */
  street(): string {
    return this.faker.helpers.fake(
      this.faker.definitions.location.street_pattern
    );
  }

  /**
   * Generates a random localized street address.
   *
   * @param options Whether to use a full address or an options object.
   * @param options.useFullAddress When true this will generate a full address.
   * Otherwise it will just generate a street address.
   *
   * @example
   * faker.location.streetAddress() // '0917 O'Conner Estates'
   * faker.location.streetAddress(false) // '34830 Erdman Hollow'
   * faker.location.streetAddress(true) // '3393 Ronny Way Apt. 742'
   * faker.location.streetAddress({ useFullAddress: true }) // '7917 Miller Park Apt. 410'
   *
   * @since 8.0.0
   */
  streetAddress(
    options:
      | boolean
      | {
          /**
           * When true this will generate a full address.
           * Otherwise it will just generate a street address.
           */
          useFullAddress?: boolean;
        } = {}
  ): string {
    if (typeof options === 'boolean') {
      options = { useFullAddress: options };
    }

    const { useFullAddress } = options;

    const formats = this.faker.definitions.location.street_address;
    const format = formats[useFullAddress ? 'full' : 'normal'];

    return this.faker.helpers.fake(format);
  }

  /**
   * Generates a random localized secondary address. This refers to a specific location at a given address
   * such as an apartment or room number.
   *
   * @example
   * faker.location.secondaryAddress() // 'Apt. 861'
   *
   * @since 8.0.0
   */
  secondaryAddress(): string {
    return this.faker.helpers
      .fake(this.faker.definitions.location.secondary_address)
      .replaceAll(/#+/g, (m) =>
        this.faker.string.numeric({
          length: m.length,
          allowLeadingZeros: false,
        })
      );
  }

  /**
   * Returns a random localized county, or other equivalent second-level administrative entity for the locale's country such as a district or department.
   *
   * @example
   * fakerEN_GB.location.county() // 'Cambridgeshire'
   * fakerEN_US.location.county() // 'Monroe County'
   *
   * @since 8.0.0
   */
  county(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.location.county
    );
  }

  /**
   * Returns a random country name.
   *
   * @example
   * faker.location.country() // 'Greece'
   *
   * @since 8.0.0
   */
  country(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.location.country
    );
  }

  /**
   * Returns a random continent name.
   *
   * @example
   * faker.location.continent() // 'Asia'
   *
   * @since 9.1.0
   */
  continent(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.location.continent
    );
  }

  /**
   * Returns a random [ISO_3166-1](https://en.wikipedia.org/wiki/ISO_3166-1) country code.
   *
   * @param options The code to return or an options object.
   * @param options.variant The variant to return. Can be one of:
   *
   * - `'alpha-2'` (two-letter code)
   * - `'alpha-3'` (three-letter code)
   * - `'numeric'` (numeric code)
   *
   * Defaults to `'alpha-2'`.
   *
   * @example
   * faker.location.countryCode() // 'SJ'
   * faker.location.countryCode('alpha-2') // 'GA'
   * faker.location.countryCode('alpha-3') // 'TJK'
   * faker.location.countryCode('numeric') // '528'
   *
   * @since 8.0.0
   */
  countryCode(
    options:
      | 'alpha-2'
      | 'alpha-3'
      | 'numeric'
      | {
          /**
           * The code to return.
           * Can be either `'alpha-2'` (two-letter code),
           * `'alpha-3'` (three-letter code)
           * or `'numeric'` (numeric code).
           *
           * @default 'alpha-2'
           */
          variant?: 'alpha-2' | 'alpha-3' | 'numeric';
        } = {}
  ): string {
    if (typeof options === 'string') {
      options = { variant: options };
    }

    const { variant = 'alpha-2' } = options;
    const key = (() => {
      switch (variant) {
        case 'numeric': {
          return 'numeric';
        }

        case 'alpha-3': {
          return 'alpha3';
        }

        case 'alpha-2': {
          return 'alpha2';
        }
      }
    })();

    return this.faker.helpers.arrayElement(
      this.faker.definitions.location.country_code
    )[key];
  }

  /**
   * Returns a random localized state, or other equivalent first-level administrative entity for the locale's country such as a province or region.
   * Generally, these are the ISO 3166-2 subdivisions for a country.
   * If a locale doesn't correspond to one specific country, the method may return ISO 3166-2 subdivisions from one or more countries that uses that language. For example, the `ar` locale includes subdivisions from Arabic-speaking countries, such as Tunisia, Algeria, Syria, Lebanon, etc.
   * For historical compatibility reasons, the default `en` locale only includes states in the United States (identical to `en_US`). However, you can use other English locales, such as `en_IN`, `en_GB`, and `en_AU`, if needed.
   *
   * @param options An options object.
   * @param options.abbreviated If true this will return abbreviated first-level administrative entity names.
   * Otherwise this will return the long name. Defaults to `false`.
   *
   * @example
   * faker.location.state() // 'Mississippi'
   * fakerEN_CA.location.state() // 'Saskatchewan'
   * fakerDE.location.state() // 'Nordrhein-Westfalen'
   * faker.location.state({ abbreviated: true }) // 'LA'
   *
   * @since 8.0.0
   */
  state(
    options: {
      /**
       * If true this will return abbreviated first-level administrative entity names.
       * Otherwise this will return the long name.
       *
       * @default false
       */
      abbreviated?: boolean;
    } = {}
  ): string {
    const { abbreviated = false } = options;
    const stateDataSet = abbreviated
      ? this.faker.definitions.location.state_abbr
      : this.faker.definitions.location.state;

    return this.faker.helpers.arrayElement(stateDataSet);
  }

  /**
   * Generates a random latitude.
   *
   * @param options An options object.
   * @param options.max The upper bound for the latitude to generate. Defaults to `90`.
   * @param options.min The lower bound for the latitude to generate. Defaults to `-90`.
   * @param options.precision The number of decimal points of precision for the latitude. Defaults to `4`.
   *
   * @example
   * faker.location.latitude() // -30.9501
   * faker.location.latitude({ max: 10 }) // 5.7225
   * faker.location.latitude({ max: 10, min: -10 }) // -9.6273
   * faker.location.latitude({ max: 10, min: -10, precision: 5 }) // 2.68452
   *
   * @since 8.0.0
   */
  latitude(
    options: {
      /**
       * The upper bound for the latitude to generate.
       *
       * @default 90
       */
      max?: number;
      /**
       * The lower bound for the latitude to generate.
       *
       * @default -90
       */
      min?: number;
      /**
       * The number of decimal points of precision for the latitude.
       *
       * @default 4
       */
      precision?: number;
    } = {}
  ): number {
    const { max = 90, min = -90, precision = 4 } = options;

    return this.faker.number.float({ min, max, fractionDigits: precision });
  }

  /**
   * Generates a random longitude.
   *
   * @param options An options object.
   * @param options.max The upper bound for the longitude to generate. Defaults to `180`.
   * @param options.min The lower bound for the longitude to generate. Defaults to `-180`.
   * @param options.precision The number of decimal points of precision for the longitude. Defaults to `4`.
   *
   * @example
   * faker.location.longitude() // -30.9501
   * faker.location.longitude({ max: 10 }) // 5.7225
   * faker.location.longitude({ max: 10, min: -10 }) // -9.6273
   * faker.location.longitude({ max: 10, min: -10, precision: 5 }) // 2.68452
   *
   * @since 8.0.0
   */
  longitude(
    options: {
      /**
       * The upper bound for the longitude to generate.
       *
       * @default 180
       */
      max?: number;
      /**
       * The lower bound for the longitude to generate.
       *
       * @default -180
       */
      min?: number;
      /**
       * The number of decimal points of precision for the longitude.
       *
       * @default 4
       */
      precision?: number;
    } = {}
  ): number {
    const { max = 180, min = -180, precision = 4 } = options;

    return this.faker.number.float({ max, min, fractionDigits: precision });
  }

  /**
   * Returns a random direction (cardinal and ordinal; northwest, east, etc).
   *
   * @param options The options to use.
   * @param options.abbreviated If true this will return abbreviated directions (NW, E, etc).
   * Otherwise this will return the long name. Defaults to `false`.
   *
   * @example
   * faker.location.direction() // 'Northeast'
   * faker.location.direction({ abbreviated: true }) // 'SW'
   *
   * @since 8.0.0
   */
  direction(
    options: {
      /**
       * If true this will return abbreviated directions (NW, E, etc).
       * Otherwise this will return the long name.
       *
       * @default false
       */
      abbreviated?: boolean;
    } = {}
  ): string {
    const { abbreviated = false } = options;

    if (!abbreviated) {
      return this.faker.helpers.arrayElement([
        ...this.faker.definitions.location.direction.cardinal,
        ...this.faker.definitions.location.direction.ordinal,
      ]);
    }

    return this.faker.helpers.arrayElement([
      ...this.faker.definitions.location.direction.cardinal_abbr,
      ...this.faker.definitions.location.direction.ordinal_abbr,
    ]);
  }

  /**
   * Returns a random cardinal direction (north, east, south, west).
   *
   * @param options The options to use.
   * @param options.abbreviated If true this will return abbreviated directions (N, E, etc).
   * Otherwise this will return the long name. Defaults to `false`.
   *
   * @example
   * faker.location.cardinalDirection() // 'North'
   * faker.location.cardinalDirection({ abbreviated: true }) // 'W'
   *
   * @since 8.0.0
   */
  cardinalDirection(
    options: {
      /**
       * If true this will return abbreviated directions (N, E, etc).
       * Otherwise this will return the long name.
       *
       * @default false
       */
      abbreviated?: boolean;
    } = {}
  ): string {
    const { abbreviated = false } = options;

    if (!abbreviated) {
      return this.faker.helpers.arrayElement(
        this.faker.definitions.location.direction.cardinal
      );
    }

    return this.faker.helpers.arrayElement(
      this.faker.definitions.location.direction.cardinal_abbr
    );
  }

  /**
   * Returns a random ordinal direction (northwest, southeast, etc).
   *
   * @param options Whether to use abbreviated or an options object.
   * @param options.abbreviated If true this will return abbreviated directions (NW, SE, etc).
   * Otherwise this will return the long name. Defaults to `false`.
   *
   * @example
   * faker.location.ordinalDirection() // 'Northeast'
   * faker.location.ordinalDirection({ abbreviated: true }) // 'SW'
   *
   * @since 8.0.0
   */
  ordinalDirection(
    options: {
      /**
       * If true this will return abbreviated directions (NW, SE, etc).
       * Otherwise this will return the long name.
       *
       * @default false
       */
      abbreviated?: boolean;
    } = {}
  ): string {
    const { abbreviated = false } = options;

    if (!abbreviated) {
      return this.faker.helpers.arrayElement(
        this.faker.definitions.location.direction.ordinal
      );
    }

    return this.faker.helpers.arrayElement(
      this.faker.definitions.location.direction.ordinal_abbr
    );
  }

  /**
   * Generates a random GPS coordinate within the specified radius from the given coordinate.
   *
   * @param options The options for generating a GPS coordinate.
   * @param options.origin The original coordinate to get a new coordinate close to.
   * If no coordinate is given, a random one will be chosen.
   * @param options.radius The maximum distance from the given coordinate to the new coordinate. Defaults to `10`.
   * @param options.isMetric If `true` assume the radius to be in kilometers. If `false` for miles. Defaults to `false`.
   *
   * @example
   * faker.location.nearbyGPSCoordinate() // [ 33.8475, -170.5953 ]
   * faker.location.nearbyGPSCoordinate({ origin: [33, -170] }) // [ 33.0165, -170.0636 ]
   * faker.location.nearbyGPSCoordinate({ origin: [33, -170], radius: 1000, isMetric: true }) // [ 37.9163, -179.2408 ]
   *
   * @since 8.0.0
   */
  nearbyGPSCoordinate(
    options: {
      /**
       * The original coordinate to get a new coordinate close to.
       */
      origin?: [latitude: number, longitude: number];
      /**
       * The maximum distance from the given coordinate to the new coordinate.
       *
       * @default 10
       */
      radius?: number;
      /**
       * If `true` assume the radius to be in kilometers. If `false` for miles.
       *
       * @default false
       */
      isMetric?: boolean;
    } = {}
  ): [latitude: number, longitude: number] {
    const { origin, radius = 10, isMetric = false } = options;

    // If there is no origin, the best we can do is return a random GPS coordinate.
    if (origin == null) {
      return [this.latitude(), this.longitude()];
    }

    const angleRadians = this.faker.number.float({
      max: 2 * Math.PI,
      fractionDigits: 5,
    }); // in ° radians

    const radiusMetric = isMetric ? radius : radius * 1.60934; // in km
    const errorCorrection = 0.995; // avoid float issues
    const distanceInKm =
      this.faker.number.float({
        max: radiusMetric,
        fractionDigits: 3,
      }) * errorCorrection; // in km

    /**
     * The distance in km per degree for earth.
     */
    const kmPerDegree = 40_000 / 360; // in km/°

    const distanceInDegree = distanceInKm / kmPerDegree; // in °

    const coordinate: [latitude: number, longitude: number] = [
      origin[0] + Math.sin(angleRadians) * distanceInDegree,
      origin[1] + Math.cos(angleRadians) * distanceInDegree,
    ];

    // Box latitude [-90°, 90°]
    coordinate[0] = coordinate[0] % 180;
    if (coordinate[0] < -90 || coordinate[0] > 90) {
      coordinate[0] = Math.sign(coordinate[0]) * 180 - coordinate[0];
      coordinate[1] += 180;
    }

    // Box longitude [-180°, 180°]
    coordinate[1] = (((coordinate[1] % 360) + 540) % 360) - 180;

    return [coordinate[0], coordinate[1]];
  }

  /**
   * Returns a random IANA time zone relevant to this locale.
   *
   * The returned time zone is tied to the current locale.
   *
   * @see [IANA Time Zone Database](https://www.iana.org/time-zones)
   * @see faker.date.timeZone(): For generating a random time zone from all available time zones.
   *
   * @example
   * faker.location.timeZone() // 'Pacific/Guam'
   *
   * @since 8.0.0
   */
  timeZone(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.location.time_zone
    );
  }

  /**
   * Returns a random spoken language.
   *
   * @see [ISO 639-1](https://en.wikipedia.org/wiki/ISO_639-1)
   * @see [ISO 639-2](https://en.wikipedia.org/wiki/ISO_639-2)
   * @see [ISO 639-2 Language Code List](https://www.loc.gov/standards/iso639-2/php/code_list.php)
   *
   * @example
   * faker.location.language() // { alpha2: 'de', alpha3: 'deu', name: 'German' }
   * faker.location.language().name // German
   * faker.location.language().alpha2 // de
   * faker.location.language().alpha3 // deu
   *
   * @since 9.4.0
   */
  language(): Language {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.location.language
    );
  }
}
