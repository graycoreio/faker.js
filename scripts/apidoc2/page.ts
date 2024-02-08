import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { ApiDocsMethod } from '../../docs/.vitepress/components/api-docs/method';
import type { RawApiDocsPage } from './class';
import { formatMarkdown } from './format';
import { codeToHtml, mdToHtml } from './markdown';
import type { RawApiDocsMethod } from './method';
import { pathApiDocsDir } from './paths';
import { scriptCommand } from './utils';

// Moved here because this must not be formatted by prettier
const vitePressInFileOptions = `---
editLink: false
---

`;

/**
 * Writes the api docs page and data for the given modules to the correct location.
 *
 * @param pages The pages to write.
 */
export async function writePages(pages: RawApiDocsPage[]): Promise<void> {
  await Promise.all(pages.map(writePage));
}

/**
 * Writes the api docs page and data for the given module to the correct location.
 *
 * @param page The page to write.
 */
async function writePage(page: RawApiDocsPage): Promise<void> {
  await writePageMarkdown(page);
  writePageJsonData(page);
}

/**
 * Writes the api docs page for the given module to the correct location.
 *
 * @param page The page to write.
 */
async function writePageMarkdown(page: RawApiDocsPage): Promise<void> {
  const { title, camelTitle, deprecated, description, examples, methods } =
    page;
  // Write api docs page
  let content = `
  <script setup>
  import ApiDocsMethod from '../.vitepress/components/api-docs/method.vue';
  import ${camelTitle} from './${camelTitle}2.json';
  </script>

  <!-- This file is automatically generated. -->
  <!-- Run '${scriptCommand}' to update -->

  # ${title}

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

  ${description}

  ${examples.length === 0 ? '' : `<div class="examples">${examples.join('\n')}</div>`}

  :::

  ${methods
    .map(
      (method) => `
  ## ${method.name}

  <ApiDocsMethod :method="${camelTitle}.${method.name}" v-once />
  `
    )
    .join('')}
  `.replace(/\n +/g, '\n');

  content = vitePressInFileOptions + (await formatMarkdown(content));

  writeFileSync(resolve(pathApiDocsDir, `${camelTitle}2.md`), content);
}

/**
 * Writes the api docs data for the given module to correct location.
 *
 * @param page The page to write.
 */
function writePageJsonData(page: RawApiDocsPage): void {
  const { camelTitle, methods } = page;
  const pageData: Record<string, ApiDocsMethod> = Object.fromEntries(
    methods.map((method) => [method.name, toMethodData(method)])
  );
  const content = JSON.stringify(pageData, null, 2);

  writeFileSync(resolve(pathApiDocsDir, `${camelTitle}2.json`), content);

  // TODO @ST-DDT 2024-02-08: Remove this prior to merge
  const old = JSON.parse(
    readFileSync(resolve(pathApiDocsDir, `${camelTitle}.json`), 'utf8')
  ) as Record<string, ApiDocsMethod>;

  for (const [key, value] of Object.entries(pageData)) {
    const oldMethod = old[key];
    if (oldMethod != null) {
      old[key] = {
        ...oldMethod,
        examples: value.examples, // Has different signature
        sourcePath: value.sourcePath, // Points to a different line
      };
    }
  }

  const contentOld = JSON.stringify(old, null, 2);
  writeFileSync(resolve(pathApiDocsDir, `${camelTitle}.json`), contentOld);

  if (content !== contentOld) {
    console.log(`  - Diff detected ${camelTitle}`);
  }
}

const defaultCommentRegex = /\s+Defaults to `([^`]+)`\..*/;

function toMethodData(method: RawApiDocsMethod): ApiDocsMethod {
  const { name, signatures, sourcePath } = method;
  const signatureData = signatures[signatures.length - 1];
  const {
    deprecated,
    description,
    since,
    parameters,
    returns,
    throws,
    signature,
    examples,
    seeAlsos,
  } = signatureData;

  /* Target order, omitted to improve diff to old files
  return {
    name,
    deprecated: mdToHtml(deprecated),
    description: mdToHtml(description),
    since,
    parameters: parameters.map((param) => ({
      ...param,
      description: mdToHtml(param.description),
    })),
    returns,
    throws: throws.length === 0 ? undefined : mdToHtml(throws.join('\n'), true),
    signature: codeToHtml(signature),
    examples: codeToHtml(examples.join('\n')),
    seeAlsos: seeAlsos.map((seeAlso) => mdToHtml(seeAlso, true)),
    sourcePath: sourcePath.replace(/:(\d+):\d+/g, '#L$1'),
  };
  */

  return {
    name,
    description: mdToHtml(description),
    parameters: parameters.map((param) => ({
      ...param,
      // TODO @ST-DDT 2024-02-08: Check if this is still needed
      default:
        param.default ?? defaultCommentRegex.exec(param.description)?.[1],
      description: mdToHtml(param.description.replace(defaultCommentRegex, '')),
    })),
    since,
    sourcePath: sourcePath.replace(/:(\d+):\d+/g, '#L$1'),
    throws: throws.length === 0 ? undefined : mdToHtml(throws.join('\n'), true),
    returns,
    examples: codeToHtml([signature, ...examples].join('\n')),
    deprecated: mdToHtml(deprecated),
    seeAlsos: seeAlsos.map((seeAlso) => mdToHtml(seeAlso, true)),
  };
}
