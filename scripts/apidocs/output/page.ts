import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { ApiDocsMethod } from '../../../docs/.vitepress/components/api-docs/method';
import type { RawApiDocsPage } from '../processing/class';
import type { RawApiDocsMethod } from '../processing/method';
import { formatMarkdown, formatTypescript } from '../utils/format';
import { adjustUrls, codeToHtml, mdToHtml } from '../utils/markdown';
import { FILE_PATH_API_DOCS } from '../utils/paths';
import { required } from '../utils/value-checks';
import { SCRIPT_COMMAND } from './constants';

// Extracted to a constant because the contents must not be formatted by prettier
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
  try {
    await writePageMarkdown(page);
    await writePageData(page);
  } catch (error) {
    throw new Error(`Error writing page ${page.title}`, { cause: error });
  }
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
  import ${camelTitle} from './${camelTitle}.ts';
  </script>

  <!-- This file is automatically generated. -->
  <!-- Run '${SCRIPT_COMMAND}' to update -->

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

  ${adjustUrls(description)}

  ${examples.length === 0 ? '' : `<div class="examples">${codeToHtml(examples.join('\n'))}</div>`}

  :::

  ${methods
    .map(
      (method) => `
  ## ${method.name}

  <ApiDocsMethod :method="${camelTitle}.${method.name}" v-once />
  `
    )
    .join('')}
  `.replaceAll(/\n +/g, '\n');

  content = vitePressInFileOptions + (await formatMarkdown(content));

  writeFileSync(resolve(FILE_PATH_API_DOCS, `${camelTitle}.md`), content);
}

/**
 * Writes the api docs data for the given module to correct location.
 *
 * @param page The page to write.
 */
async function writePageData(page: RawApiDocsPage): Promise<void> {
  const { camelTitle, methods } = page;
  const pageData: Record<string, ApiDocsMethod> = Object.fromEntries(
    await Promise.all(
      methods.map(async (method) => [method.name, await toMethodData(method)])
    )
  );

  const refreshFunctions: Record<string, string> = Object.fromEntries(
    await Promise.all(
      methods.map(async (method) => [
        method.name,
        await toRefreshFunction(method),
      ])
    )
  );

  const content =
    `export default ${JSON.stringify(pageData, undefined, 2)}`.replaceAll(
      /"refresh-([^"-]+)-placeholder"/g,
      (_, name) => refreshFunctions[name]
    );

  writeFileSync(
    resolve(FILE_PATH_API_DOCS, `${camelTitle}.ts`),
    await formatTypescript(content)
  );
}

const defaultCommentRegex = /\s+Defaults to `([^`]+)`\..*/;

async function toMethodData(method: RawApiDocsMethod): Promise<ApiDocsMethod> {
  const { name, signatures, source } = method;
  const signatureData = required(signatures.at(-1), 'method signature');
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
  const { filePath, line } = source;
  let formattedSignature = await formatTypescript(signature);
  formattedSignature = formattedSignature.trim();

  // eslint-disable-next-line @typescript-eslint/require-await
  const refresh = async () => ['refresh', name, 'placeholder'];
  // This is a placeholder to be replaced by the actual refresh function code
  // If we put the actual code here, it would be a string and not executable
  refresh.toJSON = () => `refresh-${name}-placeholder`;

  /* Target order, omitted to improve diff to old files
  return {
    name,
    deprecated: mdToHtml(deprecated),
    description: mdToHtml(description),
    since,
    parameters: parameters.map((param) => ({
      ...param,
      type: param.type.text,
      default:
        param.default ?? defaultCommentRegex.exec(param.description)?.[1],
      description: mdToHtml(param.description.replace(defaultCommentRegex, '')),
    })),
    returns: returns.text,
    throws: throws.length === 0 ? undefined : mdToHtml(throws.join('\n'), true),
    // signature: codeToHtml(signature),
    examples: codeToHtml([signature, ...examples].join('\n')),
    seeAlsos: seeAlsos.map((seeAlso) => mdToHtml(seeAlso, true)),
    sourcePath: sourcePath.replace(/:(\d+):\d+/g, '#L$1'),
  };
  */

  return {
    name,
    description: mdToHtml(description),
    parameters: parameters.map((param) => ({
      ...param,
      type: param.type.text,
      default: param.default ?? extractSummaryDefault(param.description),
      description: mdToHtml(param.description.replace(defaultCommentRegex, '')),
    })),
    since,
    sourcePath: `${filePath}#L${line}`,
    throws: throws.length === 0 ? undefined : mdToHtml(throws.join('\n'), true),
    returns: returns.text,
    signature: codeToHtml(formattedSignature),
    examples: codeToHtml(examples.join('\n')),
    refresh,
    deprecated: mdToHtml(deprecated),
    seeAlsos: seeAlsos.map((seeAlso) => mdToHtml(seeAlso, true)),
  };
}

export function extractSummaryDefault(description: string): string | undefined {
  return defaultCommentRegex.exec(description)?.[1];
}

export async function toRefreshFunction(
  method: RawApiDocsMethod
): Promise<string> {
  const { name, signatures } = method;
  const signatureData = required(signatures.at(-1), 'method signature');
  const { examples } = signatureData;

  const exampleCode = examples.join('\n');
  if (!hasFakerCalls(exampleCode)) {
    // No recordable faker calls in examples
    return 'undefined';
  }

  const fullMethod = prepareExampleCapturing({
    main: exampleCode,
    async: true,
    init: [
      'await enableFaker();',
      'faker.seed();',
      'faker.setDefaultRefDate();',
    ],
  });
  try {
    const formattedMethod = await formatTypescript(fullMethod);
    return formattedMethod.replace(/;\s+$/, ''); // Remove trailing semicolon
  } catch (error: unknown) {
    console.error(
      'Failed to format refresh function for',
      name,
      fullMethod,
      error
    );
    return 'undefined';
  }
}

function hasFakerCalls(exampleCode: string) {
  return /^\w*faker\w*\./im.test(exampleCode);
}

export function prepareExampleCapturing(options: {
  main: string;
  async: boolean;
  init?: string[];
}): string {
  const { main, async, init = [] } = options;
  const captureCode = main
    .replaceAll(/ ?\/\/.*$/gm, '') // Remove comments
    .replaceAll(/^import .*$/gm, '') // Remove imports
    .replaceAll(
      // record results of faker calls
      /^(\w*faker\w*\..+(?:(?:.|\n..)*\n[^ ])?\)(?:\.\w+)?);?$/gim,
      `try { result.push($1); } catch (error: unknown) { result.push(error instanceof Error ? error.name : 'Error'); }\n`
    );

  return `${async ? 'async (): Promise<unknown[]>' : '(): unknown[]'} => {
      ${init.join('\n')}
      const result: unknown[] = [];

      ${captureCode}

      return result;
      }`;
}
