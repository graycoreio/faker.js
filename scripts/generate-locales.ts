#!/usr/bin/env node

/**
 * This file contains a script that can be used to update the following files:
 *
 * - `src/locale/<locale>.ts`
 * - `src/locales/<locale>/index.ts`
 * - `src/locales/<locale>/<module...>/index.ts`
 * - `src/docs/guide/localization.md`
 *
 * If you wish to edit all/specific locale data files you can do so using the
 * `updateLocaleFileHook()` method.
 * Please remember to not commit your temporary update code.
 *
 * Run this script using `pnpm run generate:locales`
 */
import { constants } from 'node:fs';
import { access, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { LocaleDefinition, MetadataDefinition } from '../src/definitions';
import { keys } from '../src/internal/keys';
import { formatMarkdown, formatTypescript } from './apidocs/utils/format';

// Constants

const pathRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pathLocale = resolve(pathRoot, 'src', 'locale');
const pathLocales = resolve(pathRoot, 'src', 'locales');
const pathLocaleIndex = resolve(pathLocale, 'index.ts');
const pathLocalesIndex = resolve(pathLocales, 'index.ts');
const pathDocsGuideLocalization = resolve(
  pathRoot,
  'docs',
  'guide',
  'localization.md'
);

// Workaround for nameOf<T>
type PascalCase<TName extends string> =
  TName extends `${infer Prefix}_${infer Remainder}`
    ? `${Capitalize<Prefix>}${PascalCase<Remainder>}`
    : Capitalize<TName>;

type DefinitionType = {
  [key in keyof LocaleDefinition]-?: PascalCase<`${key}Definition`>;
};

/**
 * The types of the definitions.
 */
const definitionsTypes: DefinitionType = {
  airline: 'AirlineDefinition',
  animal: 'AnimalDefinition',
  color: 'ColorDefinition',
  commerce: 'CommerceDefinition',
  company: 'CompanyDefinition',
  database: 'DatabaseDefinition',
  date: 'DateDefinition',
  finance: 'FinanceDefinition',
  food: 'FoodDefinition',
  hacker: 'HackerDefinition',
  internet: 'InternetDefinition',
  location: 'LocationDefinition',
  lorem: 'LoremDefinition',
  metadata: 'MetadataDefinition',
  music: 'MusicDefinition',
  person: 'PersonDefinition',
  phone_number: 'PhoneNumberDefinition',
  science: 'ScienceDefinition',
  system: 'SystemDefinition',
  vehicle: 'VehicleDefinition',
  word: 'WordDefinition',
};

const scriptCommand = 'pnpm run generate:locales';

const autoGeneratedCommentHeader = `/*
 * This file is automatically generated.
 * Run '${scriptCommand}' to update.
 */`;

// Helper functions

function removeIndexTs(files: string[]): string[] {
  const index = files.indexOf('index.ts');
  if (index !== -1) {
    files.splice(index, 1);
  }

  return files;
}

function removeTsSuffix(files: string[]): string[] {
  return files.map((file) => file.replace('.ts', ''));
}

function escapeImport(parent: string, module: string): string {
  if (['name', 'type', 'switch', parent].includes(module)) {
    return `${module}_`;
  }

  return module;
}

function escapeField(parent: string, module: string): string {
  if (['name', 'type', 'switch', parent].includes(module)) {
    return `${module}: ${module}_`;
  }

  return module;
}

async function generateLocaleFile(locale: string): Promise<void> {
  const parts = locale.split('_');
  const locales = [locale];

  for (let i = parts.length - 1; i > 0; i--) {
    const fallback = parts.slice(0, i).join('_');
    try {
      await access(resolve(pathLocales, fallback), constants.R_OK);
      locales.push(fallback);
    } catch {
      // file is missing
    }
  }

  // TODO @Shinigami92 2023-03-07: Remove 'en' fallback in a separate PR
  if (locales.at(-1) !== 'en' && locale !== 'base') {
    locales.push('en');
  }

  if (locales.at(-1) !== 'base') {
    locales.push('base');
  }

  let content = `
      ${autoGeneratedCommentHeader}

      import { Faker } from '../faker';
      ${locales
        .map((imp) => `import ${imp} from '../locales/${imp}';`)
        .join('\n')}

      export const faker = new Faker({
        locale: ${
          locales.length === 1 ? locales[0] : `[${locales.join(', ')}]`
        },
      });
      `;

  content = await formatTypescript(content);
  return writeFile(resolve(pathLocale, `${locale}.ts`), content);
}

async function generateLocalesIndexFile(
  path: string,
  name: string,
  type: string,
  depth: number
): Promise<void> {
  let modules = await readdir(path);
  modules = modules.filter((file) => !file.startsWith('.'));
  modules = removeIndexTs(modules);
  modules = removeTsSuffix(modules);
  modules.sort();

  const content = [autoGeneratedCommentHeader];
  let fieldType = '';
  if (type !== 'any') {
    fieldType = `: ${type}`;
    content.push(
      `import type { ${type.replace(/\[.*/, '')} } from '..${'/..'.repeat(
        depth
      )}';`
    );
  }

  content.push(
    ...modules.map(
      (module) => `import ${escapeImport(name, module)} from './${module}';`
    ),
    '',
    `const ${name}${fieldType} = {
        ${modules.map((module) => `${escapeField(name, module)},`).join('\n')}
      };`,
    '',
    `export default ${name};`
  );

  return writeFile(
    resolve(path, 'index.ts'),
    await formatTypescript(content.join('\n'))
  );
}

async function generateRecursiveModuleIndexes(
  path: string,
  name: string,
  definition: string,
  depth: number
): Promise<unknown> {
  await generateLocalesIndexFile(path, name, definition, depth);
  const promises: Array<Promise<unknown>> = [];

  let submodules = await readdir(path);
  submodules = removeIndexTs(submodules);
  for (const submodule of submodules) {
    const pathModule = resolve(path, submodule);
    await updateLocaleFile(pathModule);
    // Only process sub folders recursively
    const moduleStat = await stat(pathModule);
    if (moduleStat.isDirectory()) {
      let moduleDefinition =
        definition === 'any' ? 'any' : `${definition}['${submodule}']`;

      // Overwrite types of src/locales/<locale>/<module>/index.ts for known definition types
      if (depth === 1) {
        moduleDefinition = definitionsTypes[submodule] ?? 'any';
      }

      // Recursive
      promises.push(
        generateRecursiveModuleIndexes(
          pathModule,
          submodule,
          moduleDefinition,
          depth + 1
        )
      );
    }
  }

  return Promise.all(promises);
}

/**
 * Intermediate helper function to allow selectively updating locale data files.
 * Use the `updateLocaleFileHook()` method to temporarily add your custom per file processing/update logic.
 *
 * @param filePath The full file path to the file.
 */
async function updateLocaleFile(filePath: string): Promise<void> {
  const fileStat = await stat(filePath);
  if (fileStat.isFile()) {
    const [locale, moduleKey, entryKey] = filePath
      .substring(pathLocales.length + 1, filePath.length - 3)
      .split(/[\\/]/);
    return updateLocaleFileHook(filePath, locale, moduleKey, entryKey);
  }
}

/**
 * Use this hook method to selectively update locale data files (not for index.ts files).
 * This method is intended to be temporarily overwritten for one-time updates.
 *
 * @param filePath The full file path to the file.
 * @param locale The locale for that file.
 * @param definitionKey The definition key of the current file (ex. 'location').
 * @param entryName The entry key of the current file (ex. 'state'). Is `undefined` if `definitionKey` is `'metadata'`.
 */
async function updateLocaleFileHook(
  filePath: string,
  locale: string,
  definitionKey: string,
  entryName: string | undefined
): Promise<void> {
  // this needs to stay so all arguments are "used"
  if (filePath === 'never') {
    console.log(`${filePath} <-> ${locale} @ ${definitionKey} -> ${entryName}`);
  }

  return normalizeLocaleFile(filePath, locale, definitionKey);
}

/**
 * Normalizes the data of a locale file based on a set of rules.
 * Those include:
 * - filter the entry list for duplicates
 * - limiting the maximum entries of a file to 1000
 * - sorting the entries alphabetically
 *
 * This function mutates the file by reading and writing to it!
 *
 * @param filePath The full file path to the file.
 * @param locale The locale for that file.
 * @param definitionKey The definition key of the current file (ex. 'location').
 */
async function normalizeLocaleFile(
  filePath: string,
  locale: string,
  definitionKey: string
) {
  function normalizeDataRecursive<T>(localeData: T): T {
    if (typeof localeData !== 'object' || localeData === null) {
      // we can only traverse object-like structs
      return localeData;
    }

    let collator = null;
    try {
      // eslint-disable-next-line no-restricted-globals
      collator = new Intl.Collator(locale.replaceAll('_', '-'));
    } catch {
      if (locale === 'base') {
        // eslint-disable-next-line no-restricted-globals
        collator = new Intl.Collator('en');
      } else {
        throw new Error(
          `Failed to create collator for locale ${locale}. Using default collator.`
        );
      }
    }

    if (Array.isArray(localeData)) {
      return (
        [...new Set(localeData)]
          // limit entries to 1k
          .slice(0, 1000)
          // sort entries alphabetically
          .sort(collator.compare) as T
      );
    }

    const result = {} as T;
    for (const key of keys(localeData)) {
      result[key] = normalizeDataRecursive(localeData[key]);
    }

    return result;
  }

  const legacyDefinitions = ['app', 'cell_phone', 'team'];
  const definitionsToSkip = [
    'internet',
    'location',
    'lorem',
    'metadata',
    'person',
    'phone_number',
    'system',
    'word',
    ...legacyDefinitions,
  ];
  if (definitionsToSkip.includes(definitionKey)) {
    return;
  }

  console.log(`Running data normalization for:`, filePath);

  const fileContent = await readFile(filePath, { encoding: 'utf8' });
  const searchString = 'export default ';
  const compareIndex = fileContent.indexOf(searchString) + searchString.length;
  const compareString = fileContent.substring(compareIndex);

  const isDynamicFile = compareString.startsWith('mergeArrays');
  const isNonApplicable = compareString.startsWith('null');
  if (isDynamicFile || isNonApplicable) {
    return;
  }

  const validEntryListStartCharacters = ['[', '{'];
  const staticFileOpenSyntax = validEntryListStartCharacters.find(
    (validStart) => compareString.startsWith(validStart)
  );
  if (staticFileOpenSyntax === undefined) {
    console.log('Found an unhandled dynamic file:', filePath);
    return;
  }

  const fileContentPreData = fileContent.substring(0, compareIndex);
  const fileImport = await import(`file:${filePath}`);
  const oldData = fileImport.default;
  const localeData = normalizeDataRecursive(oldData);

  // We reattach the content before the actual data implementation to keep stuff like comments.
  // In the long term we should probably define a whether we want those in the files at all.
  const newDataJson = JSON.stringify(localeData);
  const newContent = fileContentPreData + newDataJson;

  // Exit early if unchanged for performance reasons
  if (JSON.stringify(oldData) === newDataJson) {
    return;
  }

  return writeFile(filePath, await formatTypescript(newContent));
}

// Start of actual logic

const locales = await readdir(pathLocales);
removeIndexTs(locales);

let localeIndexImports = '';
let localeIndexExportsIndividual = '';
let localeIndexExportsGrouped = '';
let localesIndexImports = '';

let localizationLocales = '| Locale | Name | Faker |\n| :--- | :--- | :--- |\n';
const promises: Array<Promise<unknown>> = [];

for (const locale of locales) {
  const pathModules = resolve(pathLocales, locale);
  const pathMetadata = resolve(pathModules, 'metadata.ts');
  let localeTitle = 'No title found';
  try {
    const metadataImport = await import(`file:${pathMetadata}`);
    const metadata: MetadataDefinition = metadataImport.default;
    const { title } = metadata;
    if (!title) {
      throw new Error(`No title property found on ${JSON.stringify(metadata)}`);
    }

    localeTitle = title;
  } catch (error) {
    console.error(
      `Failed to load ${pathMetadata}. Please make sure the file exists and exports a MetadataDefinition.`
    );
    console.error(error);
  }

  const localizedFaker = `faker${locale.replace(/^([a-z]+)/, (part) =>
    part.toUpperCase()
  )}`;

  localeIndexImports += `import { faker as ${localizedFaker} } from './${locale}';\n`;
  localeIndexExportsIndividual += `  ${localizedFaker},\n`;
  localeIndexExportsGrouped += `  ${locale}: ${localizedFaker},\n`;
  localesIndexImports += `import { default as ${locale} } from './${locale}';\n`;
  localizationLocales += `| \`${locale}\` | ${localeTitle} | \`${localizedFaker}\` |\n`;

  promises.push(
    // src/locale/<locale>.ts
    // eslint-disable-next-line unicorn/prefer-top-level-await -- Disabled for performance
    generateLocaleFile(locale),

    // src/locales/**/index.ts
    // eslint-disable-next-line unicorn/prefer-top-level-await -- Disabled for performance
    generateRecursiveModuleIndexes(pathModules, locale, 'LocaleDefinition', 1)
  );
}

await Promise.all(promises);

// src/locale/index.ts

let localeIndexContent = `
  ${autoGeneratedCommentHeader}

  ${localeIndexImports}

  export {
  ${localeIndexExportsIndividual}
  };

  export const allFakers = {
  ${localeIndexExportsGrouped}
  } as const;
  `;

localeIndexContent = await formatTypescript(localeIndexContent);
await writeFile(pathLocaleIndex, localeIndexContent);

// src/locales/index.ts

let localesIndexContent = `
  ${autoGeneratedCommentHeader}

  ${localesIndexImports}

  export { ${locales.join(',')} };

  export const allLocales = { ${locales.join(',')} };
  `;

localesIndexContent = await formatTypescript(localesIndexContent);
await writeFile(pathLocalesIndex, localesIndexContent);

// docs/guide/localization.md

localizationLocales = await formatMarkdown(localizationLocales);

let localizationContent = await readFile(pathDocsGuideLocalization, 'utf8');
localizationContent = localizationContent.replaceAll(
  /(^<!-- LOCALES-AUTO-GENERATED-START -->$).*(^<!-- LOCALES-AUTO-GENERATED-END -->$)/gms,
  `$1\n\n<!-- Run '${scriptCommand}' to update. -->\n\n${localizationLocales}\n$2`
);
await writeFile(pathDocsGuideLocalization, localizationContent);
