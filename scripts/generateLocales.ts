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
import {
  existsSync,
  lstatSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { basename, resolve } from 'node:path';
import type { Options } from 'prettier';
import { format } from 'prettier';
import options from '../.prettierrc.js';
import type { LocaleDefinition, MetadataDefinition } from '../src/definitions';

// Constants

const pathRoot = resolve(__dirname, '..');
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

const prettierTsOptions: Options = { ...options, parser: 'typescript' };
const prettierMdOptions: Options = { ...options, parser: 'markdown' };

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
    if (existsSync(resolve(pathLocales, fallback))) {
      locales.push(fallback);
    }
  }

  // TODO @Shinigami92 2023-03-07: Remove 'en' fallback in a separate PR
  if (locales[locales.length - 1] !== 'en' && locale !== 'base') {
    locales.push('en');
  }

  if (locales[locales.length - 1] !== 'base') {
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

  content = await format(content, prettierTsOptions);
  writeFileSync(resolve(pathLocale, `${locale}.ts`), content);
}

async function generateLocalesIndexFile(
  path: string,
  name: string,
  type: string,
  depth: number
): Promise<void> {
  let modules = readdirSync(path);
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
    )
  );

  content.push(`\nconst ${name}${fieldType} = {
        ${modules.map((module) => `${escapeField(name, module)},`).join('\n')}
      };\n`);

  content.push(`export default ${name};`);

  writeFileSync(
    resolve(path, 'index.ts'),
    await format(content.join('\n'), prettierTsOptions)
  );
}

async function generateRecursiveModuleIndexes(
  path: string,
  name: string,
  definition: string,
  depth: number
): Promise<void> {
  await generateLocalesIndexFile(path, name, definition, depth);

  let submodules = readdirSync(path);
  submodules = removeIndexTs(submodules);
  for (const submodule of submodules) {
    const pathModule = resolve(path, submodule);
    await updateLocaleFile(pathModule);
    // Only process sub folders recursively
    if (lstatSync(pathModule).isDirectory()) {
      let moduleDefinition =
        definition === 'any' ? 'any' : `${definition}['${submodule}']`;

      // Overwrite types of src/locales/<locale>/<module>/index.ts for known definition types
      if (depth === 1) {
        moduleDefinition = definitionsTypes[submodule] ?? 'any';
      }

      // Recursive
      await generateRecursiveModuleIndexes(
        pathModule,
        submodule,
        moduleDefinition,
        depth + 1
      );
    }
  }
}

/**
 * Intermediate helper function to allow selectively updating locale data files.
 * Use the `updateLocaleFileHook()` method to temporarily add your custom per file processing/update logic.
 *
 * @param filePath The full file path to the file.
 */
async function updateLocaleFile(filePath: string): Promise<void> {
  if (lstatSync(filePath).isFile()) {
    const pathParts = filePath
      .substring(pathLocales.length + 1, filePath.length - 3)
      .split(/[\\\/]/);
    const locale = pathParts[0];
    pathParts.splice(0, 1);
    await updateLocaleFileHook(filePath, locale, pathParts);
  }
}

/**
 * Use this hook method to selectively update locale data files (not for index.ts files).
 * This method is intended to be temporarily overwritten for one-time updates.
 *
 * @param filePath The full file path to the file.
 * @param locale The locale for that file.
 * @param localePath The locale path parts (after the locale).
 */
async function updateLocaleFileHook(
  filePath: string,
  locale: string,
  localePath: string[]
): Promise<void> {
  // this needs to stay so all arguments are "used"
  if (filePath === 'never') {
    console.log(`${filePath} <-> ${locale} @ ${localePath.join(' -> ')}`);
  }

  await normalizeLocaleFile(filePath);
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
 */
async function normalizeLocaleFile(filePath: string) {
  function normalizeDataRecursive<T>(localeData: T): T {
    if (typeof localeData !== 'object' || localeData === null) {
      // we can only traverse object-like structs
      return localeData;
    }

    if (Array.isArray(localeData)) {
      return (
        [...new Set(localeData)]
          // limit entries to 1k
          .slice(0, 1000)
          // sort entries alphabetically
          .sort() as T
      );
    }

    for (const key of Object.keys(localeData).sort()) {
      localeData[key] = normalizeDataRecursive(localeData[key]);
    }

    return localeData;
  }

  const filesToSkip = ['metadata.ts'];
  const fileName = basename(filePath);
  if (filesToSkip.includes(fileName)) {
    return;
  }

  const fileContent = readFileSync(filePath).toString();
  const searchString = 'export default ';
  const compareIndex = fileContent.indexOf(searchString) + searchString.length;
  const compareString = fileContent.substring(compareIndex);

  const isDynamicFile = compareString.startsWith('mergeArrays');
  const isNonApplicable = compareString.startsWith('null');
  const isFrozenData = compareString.startsWith('Object.freeze');
  if (isDynamicFile || isNonApplicable || isFrozenData) {
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
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const localeData = normalizeDataRecursive(require(filePath).default);

  // We reattach the content before the actual data implementation to keep stuff like comments.
  // In the long term we should probably define a whether we want those in the files at all.
  const newContent = fileContentPreData + JSON.stringify(localeData);

  writeFileSync(filePath, await format(newContent, prettierTsOptions));
}

// Start of actual logic

async function main(): Promise<void> {
  const locales = readdirSync(pathLocales);
  removeIndexTs(locales);

  let localeIndexImports = '';
  let localeIndexExportsIndividual = '';
  let localeIndexExportsGrouped = '';
  let localesIndexExports = '';

  let localizationLocales =
    '| Locale | Name | Faker |\n| :--- | :--- | :--- |\n';

  for (const locale of locales) {
    const pathModules = resolve(pathLocales, locale);
    const pathMetadata = resolve(pathModules, 'metadata.ts');
    let localeTitle = 'No title found';
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const metadata: MetadataDefinition = require(pathMetadata).default;
      const { title } = metadata;
      if (!title) {
        throw new Error(
          `No title property found on ${JSON.stringify(metadata)}`
        );
      }

      localeTitle = title;
    } catch (e) {
      console.error(
        `Failed to load ${pathMetadata}. Please make sure the file exists and exports a MetadataDefinition.`
      );
      console.error(e);
    }

    const localizedFaker = `faker${locale.replace(/^([a-z]+)/, (part) =>
      part.toUpperCase()
    )}`;

    localeIndexImports += `import { faker as ${localizedFaker} } from './${locale}';\n`;
    localeIndexExportsIndividual += `  ${localizedFaker},\n`;
    localeIndexExportsGrouped += `  ${locale}: ${localizedFaker},\n`;
    localesIndexExports += `export { default as ${locale} } from './${locale}';\n`;
    localizationLocales += `| \`${locale}\` | ${localeTitle} | \`${localizedFaker}\` |\n`;

    // src/locale/<locale>.ts
    await generateLocaleFile(locale);

    // src/locales/**/index.ts
    await generateRecursiveModuleIndexes(
      pathModules,
      locale,
      'LocaleDefinition',
      1
    );
  }

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

  localeIndexContent = await format(localeIndexContent, prettierTsOptions);
  writeFileSync(pathLocaleIndex, localeIndexContent);

  // src/locales/index.ts

  let localesIndexContent = `
  ${autoGeneratedCommentHeader}

  ${localesIndexExports}
  `;

  localesIndexContent = await format(localesIndexContent, prettierTsOptions);
  writeFileSync(pathLocalesIndex, localesIndexContent);

  // docs/guide/localization.md

  localizationLocales = await format(localizationLocales, prettierMdOptions);

  let localizationContent = readFileSync(pathDocsGuideLocalization, 'utf-8');
  localizationContent = localizationContent.replace(
    /(^<!-- LOCALES-AUTO-GENERATED-START -->$).*(^<!-- LOCALES-AUTO-GENERATED-END -->$)/gms,
    `$1\n\n<!-- Run '${scriptCommand}' to update. -->\n\n${localizationLocales}\n$2`
  );
  writeFileSync(pathDocsGuideLocalization, localizationContent);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
