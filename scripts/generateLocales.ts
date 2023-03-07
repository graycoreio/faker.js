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
import { resolve } from 'node:path';
import type { Options } from 'prettier';
import { format } from 'prettier';
import options from '../.prettierrc.cjs';
import type { Definitions, LocaleDefinition } from '../src/definitions';

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
type PascalCase<S extends string> = S extends `${infer P1}_${infer P2}`
  ? `${Capitalize<P1>}${PascalCase<P2>}`
  : Capitalize<S>;

type DefinitionsType = {
  [key in keyof Definitions]: PascalCase<`${key}Definitions`>;
};

/**
 * The types of the definitions.
 */
const definitionsTypes: DefinitionsType = {
  airline: 'AirlineDefinitions',
  animal: 'AnimalDefinitions',
  color: 'ColorDefinitions',
  commerce: 'CommerceDefinitions',
  company: 'CompanyDefinitions',
  database: 'DatabaseDefinitions',
  date: 'DateDefinitions',
  finance: 'FinanceDefinitions',
  hacker: 'HackerDefinitions',
  internet: 'InternetDefinitions',
  location: 'LocationDefinitions',
  lorem: 'LoremDefinitions',
  music: 'MusicDefinitions',
  person: 'PersonDefinitions',
  phone_number: 'PhoneNumberDefinitions',
  science: 'ScienceDefinitions',
  system: 'SystemDefinitions',
  vehicle: 'VehicleDefinitions',
  word: 'WordDefinitions',
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
  } else {
    return module;
  }
}

function escapeField(parent: string, module: string): string {
  if (['name', 'type', 'switch', parent].includes(module)) {
    return `${module}: ${module}_`;
  } else {
    return module;
  }
}

function generateLocaleFile(locale: string): void {
  const parts = locale.split('_');
  const locales = [locale];

  for (let i = parts.length - 1; i > 0; i--) {
    const fallback = parts.slice(0, i).join('_');
    if (existsSync(resolve(pathLocales, fallback))) {
      locales.push(fallback);
    }
  }

  if (locales[locales.length - 1] !== 'global') {
    locales.push('global');
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

  content = format(content, prettierTsOptions);
  writeFileSync(resolve(pathLocale, `${locale}.ts`), content);
}

function tryLoadLocalesMainIndexFile(
  pathModules: string
): LocaleDefinition | undefined {
  let localeDef: LocaleDefinition | undefined;
  // This call might fail, if the module setup is broken.
  // Unfortunately, we try to fix it with this script
  // Thats why have a fallback logic here, we only need the title anyway
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    localeDef = require(pathModules).default;
  } catch (e) {
    try {
      console.log(
        `Failed to load ${pathModules}. Attempting manual parse instead...`
      );
      const localeIndex = readFileSync(
        resolve(pathModules, 'index.ts'),
        'utf-8'
      );
      const title = localeIndex.match(/title: '(.*)',/)?.[1];
      if (title) {
        localeDef = { title };
      }
    } catch {
      console.error(`Failed to load ${pathModules} or manually parse it.`, e);
    }
  }

  return localeDef;
}

function generateLocalesIndexFile(
  path: string,
  name: string,
  type: string,
  depth: number,
  extra: string = ''
): void {
  let modules = readdirSync(path);
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
        ${extra}
        ${modules.map((module) => `${escapeField(name, module)},`).join('\n')}
      };\n`);

  content.push(`export default ${name};`);

  writeFileSync(
    resolve(path, 'index.ts'),
    format(content.join('\n'), prettierTsOptions)
  );
}

function generateRecursiveModuleIndexes(
  path: string,
  name: string,
  definition: string,
  depth: number,
  extra?: string
): void {
  generateLocalesIndexFile(path, name, definition, depth, extra);

  let submodules = readdirSync(path);
  submodules = removeIndexTs(submodules);
  for (const submodule of submodules) {
    const pathModule = resolve(path, submodule);
    updateLocaleFile(pathModule);
    // Only process sub folders recursively
    if (lstatSync(pathModule).isDirectory()) {
      let moduleDefinition =
        definition === 'any' ? 'any' : `${definition}['${submodule}']`;

      // Overwrite types of src/locales/<locale>/<module>/index.ts for known definition types
      if (depth === 1) {
        moduleDefinition = definitionsTypes[submodule] ?? 'any';
      }

      // Recursive
      generateRecursiveModuleIndexes(
        pathModule,
        submodule,
        moduleDefinition,
        depth + 1,
        undefined
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
function updateLocaleFile(filePath: string): void {
  if (lstatSync(filePath).isFile()) {
    const pathParts = filePath
      .substring(pathLocales.length + 1, filePath.length - 3)
      .split(/[\\\/]/);
    const locale = pathParts[0];
    pathParts.splice(0, 1);
    updateLocaleFileHook(filePath, locale, pathParts);
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
function updateLocaleFileHook(
  filePath: string,
  locale: string,
  localePath: string[]
): void {
  if (filePath === 'never') {
    console.log(`${filePath} <-> ${locale} @ ${localePath.join(' -> ')}`);
  }
}

// Start of actual logic

const locales = readdirSync(pathLocales);
removeIndexTs(locales);

let localeIndexImports = '';
let localeIndexExportsIndividual = '';
let localeIndexExportsGrouped = '';
let localesIndexExports = '';

let localizationLocales = '| Locale | Name | Faker |\n| :--- | :--- | :--- |\n';

for (const locale of locales) {
  const pathModules = resolve(pathLocales, locale);

  const localeDef = tryLoadLocalesMainIndexFile(pathModules);
  // We use a fallback here to at least generate a working file.
  const localeTitle = localeDef?.title ?? `TODO: Insert Title for ${locale}`;

  const localizedFaker = `faker${locale.replace(/^([a-z]+)/, (part) =>
    part.toUpperCase()
  )}`;

  localeIndexImports += `import { faker as ${localizedFaker} } from './${locale}';\n`;
  localeIndexExportsIndividual += `  ${localizedFaker},\n`;
  localeIndexExportsGrouped += `  ${locale}: ${localizedFaker},\n`;
  localesIndexExports += `export { default as ${locale} } from './${locale}';\n`;
  localizationLocales += `| \`${locale}\` | ${localeTitle} | \`${localizedFaker}\` |\n`;

  // src/locale/<locale>.ts
  generateLocaleFile(locale);

  // src/locales/**/index.ts
  generateRecursiveModuleIndexes(
    pathModules,
    locale,
    'LocaleDefinition',
    1,
    `title: '${localeTitle}',`
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

localeIndexContent = format(localeIndexContent, prettierTsOptions);
writeFileSync(pathLocaleIndex, localeIndexContent);

// src/locales/index.ts

let localesIndexContent = `
  ${autoGeneratedCommentHeader}

  ${localesIndexExports}
  `;

localesIndexContent = format(localesIndexContent, prettierTsOptions);
writeFileSync(pathLocalesIndex, localesIndexContent);

// docs/guide/localization.md

localizationLocales = format(localizationLocales, prettierMdOptions);

let localizationContent = readFileSync(pathDocsGuideLocalization, 'utf-8');
localizationContent = localizationContent.replace(
  /(^<!-- LOCALES-AUTO-GENERATED-START -->$).*(^<!-- LOCALES-AUTO-GENERATED-END -->$)/gms,
  `$1\n\n<!-- Run '${scriptCommand}' to update. -->\n\n${localizationLocales}\n$2`
);
writeFileSync(pathDocsGuideLocalization, localizationContent);
