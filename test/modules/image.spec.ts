import isDataURI from 'validator/lib/isDataURI';
import { describe, expect, it } from 'vitest';
import { faker } from '../../src';
import { seededTests } from '../support/seeded-runs';

/**
 * Checks that the given address is a valid https address.
 *
 * An address is considered valid, if it:
 *
 * - is a string
 * - starts with https
 * - is a proper url
 *
 * There is a separate integretation test file for checking if the address is reachable.
 *
 * @param address The address to check.
 */
function assertValidUrl(address: string): void {
  expect(address).toBeTypeOf('string');
  expect(address).toMatch(/^https:\/\//);
  expect(() => new URL(address)).not.toThrow();
}

describe('image', () => {
  seededTests(faker, 'image', (t) => {
    t.itEach('avatar', 'avatarGitHub', 'avatarLegacy');

    t.describe('url', (t) => {
      t.it('noArgs')
        .it('with width', { width: 128 })
        .it('with height', { height: 128 })
        .it('with width and height', { width: 128, height: 128 });
    });

    t.describe('urlLoremFlickr', (t) => {
      t.it('noArgs')
        .it('with width', { width: 128 })
        .it('with height', { height: 128 })
        .it('with width and height', { width: 128, height: 128 })
        .it('with category', { category: 'cats' })
        .it('with all options', {
          width: 128,
          height: 128,
          category: 'cats',
        });
    });

    t.describe('urlPicsumPhotos', (t) => {
      t.it('noArgs')
        .it('with width', { width: 128 })
        .it('with height', { height: 128 })
        .it('with width and height', { width: 128, height: 128 })
        .it('with blur', { blur: 6 })
        .it('with blur and grayscale', { blur: 3, grayscale: true })
        .it('with all options', {
          width: 128,
          height: 128,
          blur: 4,
          grayscale: true,
        });
    });

    t.describe('urlPlaceholder', (t) => {
      t.it('noArgs')
        .it('with width', { width: 128 })
        .it('with height', { height: 128 })
        .it('with width and height', { width: 128, height: 128 })
        .it('with backgroundColor', { backgroundColor: 'FF0000' })
        .it('with textColor', { textColor: '0000FF' })
        .it('with format', { format: 'webp' })
        .it('with text', { text: 'Hello' })
        .it('with all options', {
          width: 128,
          height: 128,
          backgroundColor: 'FF0000',
          textColor: '0000FF',
          format: 'png',
          text: 'hello',
        })
        .it('with empty colors and text', {
          width: 128,
          height: 128,
          backgroundColor: '',
          textColor: '',
          format: 'png',
          text: '',
        });
    });

    t.describe('dataUri', (t) => {
      t.it('noArgs')
        .it('with width', { width: 128 })
        .it('with height', { height: 128 })
        .it('with width and height', { width: 128, height: 128 })
        .it('with color', { color: 'blue' })
        .it('with type', { type: 'svg-base64' })
        .it('with all options+base64', {
          width: 2,
          height: 1337,
          color: '#643218',
          type: 'svg-base64',
        })
        .it('with all options+uri', {
          width: 42,
          height: 314,
          color: 'red',
          type: 'svg-uri',
        });
    });

    t.describe('avatarAI', (t) => {
      t.it('noArgs').it('with sex', { sex: 'female' });
    });
  });

  describe('avatar', () => {
    it('should return a random avatar url', () => {
      const actual = faker.image.avatar();

      assertValidUrl(actual);
    });
  });

  describe('avatarGitHub', () => {
    it('should return a random avatar url from GitHub', () => {
      const actual = faker.image.avatarGitHub();

      expect(actual).toBeTypeOf('string');
      expect(actual).toMatch(
        /^https:\/\/avatars\.githubusercontent\.com\/u\/\d+$/
      );
      assertValidUrl(actual);
    });
  });

  describe('avatarLegacy', () => {
    it('should return a random avatar url from cloudflare-ipfs', () => {
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      const actual = faker.image.avatarLegacy();

      expect(actual).toBeTypeOf('string');
      expect(actual).toMatch(
        /^https:\/\/cloudflare-ipfs\.com\/ipfs\/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye\/avatar\/\d{1,4}\.jpg$/
      );
      // The links aren't working anymore - there is nothing we can do about it
      //  assertWebAddress(avatarUrl);
    });
  });

  describe('avatarAI', () => {
    it('should return a random avatar url from AI', () => {
      const avatarUrl = faker.image.avatarAI();

      expect(avatarUrl).toBeTypeOf('string');
      expect(avatarUrl).toMatch(/^https:\/\/cdn\.jsdelivr\.net\/.*\.jpg$/);
      expect(() => new URL(avatarUrl)).not.toThrow();
    });
  });

  describe('url', () => {
    it('should return a random image url', () => {
      const actual = faker.image.url();

      assertValidUrl(actual);
    });

    it('should return a random image url with a width', () => {
      const width = 100;
      const actual = faker.image.url({ width });

      assertValidUrl(actual);
      expect(actual).include(`${width}`);
    });

    it('should return a random image url with a height', () => {
      const height = 100;
      const actual = faker.image.url({ height });

      assertValidUrl(actual);
      expect(actual).include(`${height}`);
    });

    it('should return a random image url with a width and height', () => {
      const width = 128;
      const height = 64;
      const actual = faker.image.url({ width, height });

      assertValidUrl(actual);
      expect(actual).include(`${width}`);
      expect(actual).include(`${height}`);
    });
  });

  describe('urlLoremFlickr', () => {
    it('should return a random image url from LoremFlickr', () => {
      const actual = faker.image.urlLoremFlickr();

      assertValidUrl(actual);
      expect(actual).toMatch(
        /^https:\/\/loremflickr\.com\/\d+\/\d+\?lock=\d+$/
      );
    });
  });

  describe('urlPicsumPhotos', () => {
    it('should return a random image url from PicsumPhotos', () => {
      const actual = faker.image.urlPicsumPhotos();

      assertValidUrl(actual);
      expect(actual).toMatch(
        /^https:\/\/picsum\.photos\/seed\/[0-9a-zA-Z]+\/\d+\/\d+(\?(grayscale&?)?(blur=\d+)?)?$/
      );
    });
  });

  describe('urlPlaceholder', () => {
    it('should return a random image url from Placeholder', () => {
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      const actual = faker.image.urlPlaceholder();

      assertValidUrl(actual);
      expect(actual).toMatch(
        /^https:\/\/via\.placeholder\.com\/\d+x\d+\/[0-9a-fA-F]{6}\/[0-9a-fA-F]{6}\.[a-z]{3,4}\?text=.+$/
      );
    });
  });

  describe('dataUri', () => {
    it('should return an image data uri', () => {
      const actual = faker.image.dataUri();

      expect(actual).toMatch(/^data:image\/svg\+xml;/);
      expect(actual).toSatisfy(isDataURI);
    });

    it('should return an uri-encoded image data uri', () => {
      const actual = faker.image.dataUri({ type: 'svg-uri' });

      expect(actual).toMatch(/^data:image\/svg\+xml;charset=UTF-8,/);
      expect(actual).toSatisfy(isDataURI);
    });

    it('should return a base64 image data uri', () => {
      const actual = faker.image.dataUri({ type: 'svg-base64' });

      expect(actual).toMatch(/^data:image\/svg\+xml;base64,/);
      expect(actual).toSatisfy(isDataURI);
    });

    it('should return an image data uri with fixed size', () => {
      const actual = faker.image.dataUri({
        width: 200,
        height: 300,
        type: 'svg-uri', // required for the regex check
      });

      expect(actual).toMatch(/^data:image\/svg\+xml;charset=UTF-8,/);
      expect(actual).toMatch(/width%3D%22200%22%20height%3D%22300/);
      expect(actual).toSatisfy(isDataURI);
    });

    it('should return an image data uri with a fixed background color', () => {
      const actual = faker.image.dataUri({
        color: 'red',
        type: 'svg-uri', // required for the regex check
      });

      expect(actual).toMatch(/^data:image\/svg\+xml;charset=UTF-8,/);
      expect(actual).toMatch(/fill%3D%22red/);
      expect(actual).toSatisfy(isDataURI);
    });
  });
});
