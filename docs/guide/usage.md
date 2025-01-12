# Usage

## Node.js

Using Faker is as easy as importing it from `@faker-js/faker`.

::: code-group

```js [esm]
import { faker } from '@faker-js/faker';
// or, if desiring a different locale
// import { fakerDE as faker } from '@faker-js/faker';

const randomName = faker.person.fullName(); // Rowan Nikolaus
const randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz
```

```js [cjs]
const { faker } = require('@faker-js/faker');
// or, if desiring a different locale
// const { fakerDE: faker } = require('@faker-js/faker');

const randomName = faker.person.fullName(); // Rowan Nikolaus
const randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz
```

:::

For more information on selecting and customizing a locale, please refer to our [Localization Guide](localization).

## Browser

If you want to try it yourself, you can open your browser console via `Ctrl + Shift + J` / `F12`.

On our website, you can load faker into the browser console

- by using `await enableFaker()`
- or using the following code:

```js
const { faker } = await import('https://esm.sh/@faker-js/faker');

const randomName = faker.person.fullName(); // Amber Keebler
const randomEmail = faker.internet.email(); // Norma13@hotmail.com
```

Some websites may have protections against downloading external code, dev servers usually work fine.
As an alternative, you can create a simple html file and open it with your browser:

```html
<script type="module">
  import { faker } from 'https://esm.sh/@faker-js/faker';

  // Caitlyn Kerluke
  const randomName = faker.person.fullName();

  // Rusty@arne.info
  const randomEmail = faker.internet.email();

  document.getElementById('name').value = randomName;
  document.getElementById('email').value = randomEmail;
</script>

<input id="name" />
<input id="email" />
```

::: info Note
Using the browser is great for experimenting 👍. However, due to all of the strings Faker uses to generate fake data, **Faker is a large package**. It's `> 5 MiB` minified. **Please avoid deploying the full Faker package in your web app.**
:::

## CDN/Deno

```js
import { faker } from 'https://esm.sh/@faker-js/faker';

const randomName = faker.person.fullName(); // Willie Bahringer
const randomEmail = faker.internet.email(); // Tomasa_Ferry14@hotmail.com
```

::: info Note
It is highly recommended to use version tags when importing libraries in Deno, e.g: `import { faker } from "https://esm.sh/@faker-js/faker@v9.4.0"`.
:::

### Alternative CDN links

**esm:**

- https://cdn.jsdelivr.net/npm/@faker-js/faker/+esm

**cjs:**

- https://cdn.jsdelivr.net/npm/@faker-js/faker

## TypeScript Support

We assume that you use TypeScript (strict mode).
You can use Faker without it, but we don't have dedicated error messages for wrong parameter types.

In order to have Faker working properly, you need to check if these `compilerOptions` are set correctly in your `tsconfig` file:

```json
{
  "compilerOptions": {
    "moduleResolution": "Bundler", // "Node10", "Node16" or "NodeNext"
    "strict": true // Optional, but recommended
  }
}
```

## Reproducible results

Normally Faker will give you different random values each time it is used.

```ts
faker.music.genre(); // "Soul"
faker.music.genre(); // "Reggae"
```

If you want consistent results, you can set your own seed:

```ts
faker.seed(123);

const firstRandom = faker.number.int();

// Setting the seed again resets the sequence.
faker.seed(123);

const secondRandom = faker.number.int();

console.log(firstRandom === secondRandom);
```

::: info Note
When upgrading to a new version of Faker, you may get different values for the same seed, as the underlying data (lists of names, words etc) may have changed.
:::

There are a few methods which use relative dates for which setting a random seed is not sufficient to have reproducible results, for example: `faker.date.past`, `faker.date.future`, `faker.date.birthdate`, `faker.date.recent`, `faker.date.soon` and `faker.git.commitEntry`. This is because these methods default to creating a date before or after "today", and "today" depends on when the code is run. To fix this, you can specify a fixed reference date as a Date or string, for example:

```ts
// creates a date soon after 2023-01-01
faker.date.soon({ refDate: '2023-01-01T00:00:00.000Z' });
```

or alternatively you can set a default reference date for all these methods:

```ts
// affects all future faker.date.* calls
faker.setDefaultRefDate('2023-01-01T00:00:00.000Z');
```

## Simple data generation

Faker provides a `simpleFaker` that can be used to generate data that are not based on any locales like numbers and strings.  
Also **helpers** like `arrayElement` or `multiple` are available.

This is useful if you just want to generate e.g. `uuid`s for your test environment, but don't want/need to initiate/load a full Faker instance, which would include at least 500KB of locale data.

```ts
import { simpleFaker } from '@faker-js/faker';

const uuid = simpleFaker.string.uuid();
```

See more about `SimpleFaker` in the [API docs](/api/simpleFaker).

## Create complex objects

Faker mostly generates values for primitives.
This is because in the real world, most object schemas simply look very different.
So, if you want to create an object, you most likely need to write a factory function for it.

For our example, we use TypeScript to strongly type our model.
The models we will use are described below:

```ts
import type { SexType } from '@faker-js/faker';

type SubscriptionTier = 'free' | 'basic' | 'business';

interface User {
  _id: string;
  avatar: string;
  birthday: Date;
  email: string;
  firstName: string;
  lastName: string;
  sex: SexType;
  subscriptionTier: SubscriptionTier;
}
```

As you can see, our `User` model probably looks completely different from the one you have in your codebase.
One thing to keep an eye on is the `subscriptionTier` property, as it is not simply a string, but only one of the strings defined in the `SubscriptionTier` type (`'free'` or `'basic'` or `'business'`).
Also, in a real scenario, your model should not depend on a type of a third party library (`SexType` in this case).

Let's create our first user factory function:

```ts
import { faker } from '@faker-js/faker';

interface User { ... }

function createRandomUser(): User {
  return {
    _id: faker.string.uuid(),
    avatar: faker.image.avatar(),
    birthday: faker.date.birthdate(),
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    sex: faker.person.sexType(),
    subscriptionTier: faker.helpers.arrayElement(['free', 'basic', 'business']),
  };
}

const user = createRandomUser();
```

At this point, we have a perfectly working function that will work for most purposes.
But we can take this a step further.
Currently, all properties are just randomly generated.
This can lead to some undesirable values being produced.
For example: The `sex` property having value `'female'` while `firstName` is `'Bob'`.

Let's refactor our current code:

```ts {4-7,13-16}
import { faker } from '@faker-js/faker';

function createRandomUser(): User {
  const sex = faker.person.sexType();
  const firstName = faker.person.firstName(sex);
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName });

  return {
    _id: faker.string.uuid(),
    avatar: faker.image.avatar(),
    birthday: faker.date.birthdate(),
    email,
    firstName,
    lastName,
    sex,
    subscriptionTier: faker.helpers.arrayElement(['free', 'basic', 'business']),
  };
}

const user = createRandomUser();
```

As you can see, we changed the order in which we generate our values.
First, we generate a `sex` value to use it as input for the generation of `firstName`.
Then we generate the `lastName`.
Here, we could also pass in the `sex` value as argument, but in our use-case there are no special cases in where a female last name would differ from a male one.
By doing this first, we are able to pass both names into the `email` generation function.
This allows the value to be more reasonable based on the provided arguments.

Unlike the `_id` property that uses an `uuid` implementation, which has a low chance of duplicates, the `email` function is more likely to produce duplicates, especially if the call arguments are similar. We have a dedicated guide page on generating [unique values](unique).

The example above demonstrates how to generate complex objects.
To gain more control over the values of specific properties, you can introduce `overwrites`, `options` or similar parameters:

```ts {3,17}
import { faker } from '@faker-js/faker';

function createRandomUser(overwrites: Partial<User> = {}): User {
  const {
    _id = faker.string.uuid(),
    avatar = faker.image.avatar(),
    birthday = faker.date.birthdate(),
    sex = faker.person.sexType(),
    firstName = faker.person.firstName(sex),
    lastName = faker.person.lastName(),
    email = faker.internet.email({ firstName, lastName }),
    subscriptionTier = faker.helpers.arrayElement([
      'free',
      'basic',
      'business',
    ]),
  } = overwrites;

  return {
    _id,
    avatar,
    birthday,
    email,
    firstName,
    lastName,
    sex,
    subscriptionTier,
  };
}

const user = createRandomUser();
const userToReject = createRandomUser({ birthday: new Date('2124-10-20') });
```

A potential `options` parameter could be used to:

- control which optional properties are included,
- control how nested elements and arrays are merged or replaced,
- or specify the number of items to generate for nested lists.

Congratulations, you should now be able to create any complex object you desire.
Happy faking 🥳.
