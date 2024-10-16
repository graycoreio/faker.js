import type { Faker } from '../..';
import type { PersonEntryDefinition } from '../../definitions/person';
import { ModuleBase } from '../../internal/module-base';
import { resolveLocaleData } from '../../utils/resolve-locale-data';

export enum Sex {
  Female = 'female',
  Male = 'male',
}

export type SexType = `${Sex}`;

/**
 * Select a definition based on given sex.
 *
 * @param faker Faker instance.
 * @param sex Sex.
 * @param personEntry Definitions.
 *
 * @returns Definition based on given sex.
 */
function selectDefinition<T>(
  faker: Faker,
  sex: SexType | undefined,
  personEntry: PersonEntryDefinition<T>
): T[] {
  const { generic, female, male } = personEntry;
  switch (sex) {
    case Sex.Female: {
      return female ?? generic;
    }

    case Sex.Male: {
      return male ?? generic;
    }

    default: {
      return (
        generic ??
        faker.helpers.arrayElement([female, male]) ??
        // The last statement should never happen at run time. At this point in time,
        // the entry will satisfy at least (generic || (female && male)).
        // TS is not able to infer the type correctly.
        []
      );
    }
  }
}

/**
 * Module to generate people's personal information such as names and job titles. Prior to Faker 8.0.0, this module was known as `faker.name`.
 *
 * ### Overview
 *
 * To generate a full name, use [`fullName`](https://fakerjs.dev/api/person.html#fullname). Note that this is not the same as simply concatenating [`firstName`](https://fakerjs.dev/api/person.html#firstname) and [`lastName`](https://fakerjs.dev/api/person.html#lastname), as the full name may contain a prefix, suffix, or both. Additionally, different supported locales will have differing name patterns. For example, the last name may appear before the first name, or there may be a double or hyphenated first or last name.
 *
 * You can also generate the parts of a name separately, using [`prefix`](https://fakerjs.dev/api/person.html#prefix), [`firstName`](https://fakerjs.dev/api/person.html#firstname), [`middleName`](https://fakerjs.dev/api/person.html#middlename), [`lastName`](https://fakerjs.dev/api/person.html#lastname), and [`suffix`](https://fakerjs.dev/api/person.html#suffix). Not all locales support all of these parts.
 *
 * Many of the methods in this module can optionally choose either female, male or mixed names.
 *
 * Job-related data is also available. To generate a job title, use [`jobTitle`](https://fakerjs.dev/api/person.html#jobtitle).
 *
 * This module can also generate other personal information which might appear in user profiles, such as [`gender`](https://fakerjs.dev/api/person.html#gender), [`zodiacSign`](https://fakerjs.dev/api/person.html#zodiacsign), and [`bio`](https://fakerjs.dev/api/person.html#bio).
 *
 * ### Related modules
 *
 * For personal contact information like phone numbers and email addresses, see the [`faker.phone`](https://fakerjs.dev/api/phone.html) and [`faker.internet`](https://fakerjs.dev/api/internet.html) modules.
 */
export class PersonModule extends ModuleBase {
  /**
   * Returns a random first name.
   *
   * @param sex The optional sex to use.
   * Can be either `'female'` or `'male'`.
   *
   * @example
   * faker.person.firstName() // 'Antwan'
   * faker.person.firstName('female') // 'Victoria'
   * faker.person.firstName('male') // 'Tom'
   *
   * @since 8.0.0
   */
  firstName(sex?: SexType): string {
    return this.faker.helpers.arrayElement(
      selectDefinition(
        this.faker,
        sex,
        resolveLocaleData(this.faker.fakerCore, 'person', 'first_name')
      )
    );
  }

  /**
   * Returns a random last name.
   *
   * @param sex The optional sex to use.
   * Can be either `'female'` or `'male'`.
   *
   * @example
   * faker.person.lastName() // 'Hauck'
   * faker.person.lastName('female') // 'Grady'
   * faker.person.lastName('male') // 'Barton'
   *
   * @since 8.0.0
   */
  lastName(sex?: SexType): string {
    if (this.faker.rawDefinitions.person?.last_name_pattern != null) {
      const pattern = this.faker.helpers.weightedArrayElement(
        selectDefinition(
          this.faker,
          sex,
          this.faker.rawDefinitions.person.last_name_pattern
        )
      );
      return this.faker.helpers.fake(pattern);
    }

    return this.faker.helpers.arrayElement(
      selectDefinition(
        this.faker,
        sex,
        resolveLocaleData(this.faker.fakerCore, 'person', 'last_name')
      )
    );
  }

  /**
   * Returns a random middle name.
   *
   * @param sex The optional sex to use.
   * Can be either `'female'` or `'male'`.
   *
   * @example
   * faker.person.middleName() // 'James'
   * faker.person.middleName('female') // 'Eloise'
   * faker.person.middleName('male') // 'Asher'
   *
   * @since 8.0.0
   */
  middleName(sex?: SexType): string {
    return this.faker.helpers.arrayElement(
      selectDefinition(
        this.faker,
        sex,
        resolveLocaleData(this.faker.fakerCore, 'person', 'middle_name')
      )
    );
  }

  /**
   * Generates a random full name.
   *
   * @param options An options object.
   * @param options.firstName The optional first name to use. If not specified a random one will be chosen.
   * @param options.lastName The optional last name to use. If not specified a random one will be chosen.
   * @param options.sex The optional sex to use. Can be either `'female'` or `'male'`.
   *
   * @example
   * faker.person.fullName() // 'Allen Brown'
   * faker.person.fullName({ firstName: 'Joann' }) // 'Joann Osinski'
   * faker.person.fullName({ firstName: 'Marcella', sex: 'female' }) // 'Mrs. Marcella Huels'
   * faker.person.fullName({ lastName: 'Beer' }) // 'Mr. Alfonso Beer'
   * faker.person.fullName({ sex: 'male' }) // 'Fernando Schaefer'
   *
   * @since 8.0.0
   */
  fullName(
    options: {
      /**
       * The optional first name to use. If not specified a random one will be chosen.
       *
       * @default faker.person.firstName(sex)
       */
      firstName?: string;
      /**
       * The optional last name to use. If not specified a random one will be chosen.
       *
       * @default faker.person.lastName(sex)
       */
      lastName?: string;
      /**
       * The optional sex to use. Can be either `'female'` or `'male'`.
       *
       * @default faker.helpers.arrayElement(['female', 'male'])
       */
      sex?: SexType;
    } = {}
  ): string {
    const {
      sex = this.faker.helpers.arrayElement([Sex.Female, Sex.Male]),
      firstName = this.firstName(sex),
      lastName = this.lastName(sex),
    } = options;

    const fullNamePattern: string = this.faker.helpers.weightedArrayElement(
      resolveLocaleData(this.faker.fakerCore, 'person', 'name')
    );

    const fullName = this.faker.helpers.mustache(fullNamePattern, {
      'person.prefix': () => this.prefix(sex),
      'person.firstName': () => firstName,
      'person.middleName': () => this.middleName(sex),
      'person.lastName': () => lastName,
      'person.suffix': () => this.suffix(),
    });
    return fullName;
  }

  /**
   * Returns a random gender.
   *
   * @see faker.person.sex(): For generating a binary-gender value.
   *
   * @example
   * faker.person.gender() // 'Trans*Man'
   *
   * @since 8.0.0
   */
  gender(): string {
    return this.faker.helpers.arrayElement(
      resolveLocaleData(this.faker.fakerCore, 'person', 'gender')
    );
  }

  /**
   * Returns a random sex.
   *
   * Output of this method is localised, so it should not be used to fill the parameter `sex`
   * available in some other modules for example `faker.person.firstName()`.
   *
   * @see faker.person.gender(): For generating a gender related value.
   * @see faker.person.sexType(): For generating a sex value to be used as a parameter.
   *
   * @example
   * faker.person.sex() // 'female'
   *
   * @since 8.0.0
   */
  sex(): string {
    return this.faker.helpers.arrayElement(
      resolveLocaleData(this.faker.fakerCore, 'person', 'sex')
    );
  }

  /**
   * Returns a random sex type. The `SexType` is intended to be used in parameters and conditions.
   *
   * @see faker.person.gender(): For generating a gender related value in forms.
   * @see faker.person.sex(): For generating a binary-gender value in forms.
   *
   * @example
   * faker.person.sexType() // Sex.Female
   *
   * @since 8.0.0
   */
  sexType(): SexType {
    return this.faker.helpers.enumValue(Sex);
  }

  /**
   * Returns a random short biography
   *
   * @example
   * faker.person.bio() // 'oatmeal advocate, veteran 🐠'
   *
   * @since 8.0.0
   */
  bio(): string {
    const { bio_pattern } = this.faker.definitions.person;

    return this.faker.helpers.fake(bio_pattern);
  }

  /**
   * Returns a random person prefix.
   *
   * @param sex The optional sex to use. Can be either `'female'` or `'male'`.
   *
   * @example
   * faker.person.prefix() // 'Miss'
   * faker.person.prefix('female') // 'Ms.'
   * faker.person.prefix('male') // 'Mr.'
   *
   * @since 8.0.0
   */
  prefix(sex?: SexType): string {
    return this.faker.helpers.arrayElement(
      selectDefinition(
        this.faker,
        sex,
        resolveLocaleData(this.faker.fakerCore, 'person', 'prefix')
      )
    );
  }

  /**
   * Returns a random person suffix.
   *
   * @example
   * faker.person.suffix() // 'DDS'
   *
   * @since 8.0.0
   */
  suffix(): string {
    // TODO @Shinigami92 2022-03-21: Add female_suffix and male_suffix
    return this.faker.helpers.arrayElement(
      resolveLocaleData(this.faker.fakerCore, 'person', 'suffix')
    );
  }

  /**
   * Generates a random job title.
   *
   * @example
   * faker.person.jobTitle() // 'Global Accounts Engineer'
   *
   * @since 8.0.0
   */
  jobTitle(): string {
    return this.faker.helpers.fake(
      resolveLocaleData(this.faker.fakerCore, 'person', 'job_title_pattern')
    );
  }

  /**
   * Generates a random job descriptor.
   *
   * @example
   * faker.person.jobDescriptor() // 'Customer'
   *
   * @since 8.0.0
   */
  jobDescriptor(): string {
    return this.faker.helpers.arrayElement(
      resolveLocaleData(this.faker.fakerCore, 'person', 'job_descriptor')
    );
  }

  /**
   * Generates a random job area.
   *
   * @example
   * faker.person.jobArea() // 'Brand'
   *
   * @since 8.0.0
   */
  jobArea(): string {
    return this.faker.helpers.arrayElement(
      resolveLocaleData(this.faker.fakerCore, 'person', 'job_area')
    );
  }

  /**
   * Generates a random job type.
   *
   * @example
   * faker.person.jobType() // 'Assistant'
   *
   * @since 8.0.0
   */
  jobType(): string {
    return this.faker.helpers.arrayElement(
      resolveLocaleData(this.faker.fakerCore, 'person', 'job_type')
    );
  }

  /**
   * Returns a random zodiac sign.
   *
   * @example
   * faker.person.zodiacSign() // 'Pisces'
   *
   * @since 8.0.0
   */
  zodiacSign(): string {
    return this.faker.helpers.arrayElement(
      resolveLocaleData(this.faker.fakerCore, 'person', 'western_zodiac_sign')
    );
  }
}
