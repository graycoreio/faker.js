import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { ProjectReflection } from 'typedoc';
import type { Method } from '../../docs/.vitepress/components/api-docs/method';
import type { APIGroup } from '../../docs/api/api-types';
import { formatMarkdown, formatTypescript } from './format';
import { extractSourceBaseUrl } from './typedoc';
import type { DocsApiDiffIndex, ModuleSummary, Page } from './utils';
import {
  diffHash,
  methodDiffHash,
  pathDocsDiffIndexFile,
  pathDocsDir,
  pathOutputDir,
} from './utils';

const pathDocsApiPages = resolve(pathDocsDir, '.vitepress', 'api-pages.ts');
const pathDocsApiSearchIndex = resolve(
  pathDocsDir,
  'api',
  'api-search-index.json'
);

const scriptCommand = 'pnpm run generate:api-docs';

// Moved here because this must not be formatted by prettier
const vitePressInFileOptions = `---
editLink: false
---

`;

/**
 * Writes the api docs for the given modules.
 *
 * @param moduleName The name of the module to write the docs for.
 * @param lowerModuleName The lowercase name of the module.
 * @param comment The module comments.
 * @param deprecated The deprecation message.
 * @param methods The methods of the module.
 */
export function writeApiDocsModule(
  moduleName: string,
  lowerModuleName: string,
  comment: string,
  deprecated: string | undefined,
  methods: Method[]
): ModuleSummary {
  writeApiDocsModulePage(
    moduleName,
    lowerModuleName,
    comment,
    deprecated,
    methods
  );
  writeApiDocsModuleData(lowerModuleName, methods);

  return {
    text: moduleName,
    link: `/api/${lowerModuleName}.html`,
    methods,
    diff: methods.reduce(
      (data, method) => ({
        ...data,
        [method.name]: methodDiffHash(method),
      }),
      {
        moduleHash: diffHash({
          name: moduleName,
          field: lowerModuleName,
          deprecated,
          comment,
        }),
      }
    ),
  };
}

/**
 * Writes the api page for the given module to the correct location.
 *
 * @param moduleName The name of the module to write the docs for.
 * @param lowerModuleName The lowercase name of the module.
 * @param comment The module comments.
 * @param methods The methods of the module.
 */
function writeApiDocsModulePage(
  moduleName: string,
  lowerModuleName: string,
  comment: string,
  deprecated: string | undefined,
  methods: Method[]
): void {
  // Write api docs page
  let content = `
  <script setup>
  import ApiDocsMethod from '../.vitepress/components/api-docs/method.vue';
  import ${lowerModuleName} from './${lowerModuleName}.json';
  </script>

  <!-- This file is automatically generated. -->
  <!-- Run '${scriptCommand}' to update -->

  # ${moduleName}

  ::: v-pre

  ${
    deprecated == null
      ? ''
      : `<div class="warning custom-block">
           <p class="custom-block-title">Deprecated</p>
           <p>This module is deprecated and will be removed in a future version.</p>
           <span>${deprecated}</span>
         </div>`
  }

  ${comment}

  :::

  ${methods
    .map(
      (method) => `
  ## ${method.name}

  <ApiDocsMethod :method="${lowerModuleName}.${method.name}" v-once />
  `
    )
    .join('')}
  `.replace(/\n +/g, '\n');

  content = vitePressInFileOptions + formatMarkdown(content);

  writeFileSync(resolve(pathOutputDir, `${lowerModuleName}.md`), content);
}

/**
 * Writes the api docs data to correct location.
 *
 * @param lowerModuleName The lowercase name of the module.
 * @param methods The methods data to save.
 */
function writeApiDocsModuleData(
  lowerModuleName: string,
  methods: Method[]
): void {
  const content = JSON.stringify(
    methods.reduce<Record<string, Method>>(
      (map, method) => ({
        ...map,
        [method.name]: method,
      }),
      {}
    )
  );

  writeFileSync(resolve(pathOutputDir, `${lowerModuleName}.json`), content);
}

/**
 * Writes the api docs index to correct location.
 *
 * @param pages The pages to write into the index.
 */
export function writeApiPagesIndex(pages: Page[]): void {
  // Write api-pages.ts
  console.log('Updating api-pages.ts');
  pages.splice(0, 0, { text: 'Overview', link: '/api/' });
  let apiPagesContent = `
    // This file is automatically generated.
    // Run '${scriptCommand}' to update
    export const apiPages = ${JSON.stringify(pages)};
    `.replace(/\n +/, '\n');

  apiPagesContent = formatTypescript(apiPagesContent);

  writeFileSync(pathDocsApiPages, apiPagesContent);
}

/**
 * Writes the api diff index to the correct location.
 *
 * @param diffIndex The diff index project to write.
 */
export function writeApiDiffIndex(diffIndex: DocsApiDiffIndex): void {
  writeFileSync(pathDocsDiffIndexFile, JSON.stringify(diffIndex));
}

/**
 * Writes the api search index to the correct location.
 *
 * @param project The typedoc project.
 */
export function writeApiSearchIndex(pages: ModuleSummary[]): void {
  const apiIndex: APIGroup[] = [
    {
      text: 'Module API',
      items: pages.map((module) => ({
        text: module.text,
        link: module.link,
        headers: module.methods.map((method) => ({
          anchor: method.name,
          text: method.name,
        })),
      })),
    },
  ];

  writeFileSync(pathDocsApiSearchIndex, JSON.stringify(apiIndex));
}

/**
 * Writes the source base url to the correct location.
 *
 * @param project The typedoc project.
 */
export function writeSourceBaseUrl(project: ProjectReflection): void {
  const baseUrl = extractSourceBaseUrl(project);

  let content = `
  // This file is automatically generated.
  // Run '${scriptCommand}' to update
  export const sourceBaseUrl = '${baseUrl}';
  `.replace(/\n +/, '\n');

  content = formatTypescript(content);

  writeFileSync(resolve(pathOutputDir, 'source-base-url.ts'), content);
}
