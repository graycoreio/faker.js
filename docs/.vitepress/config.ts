import type { UserConfig } from 'vitepress';
import type { DefaultTheme } from 'vitepress/theme';
import { apiPages } from './api-pages';
import {
  algoliaIndex,
  commitHash,
  isReleaseBranch,
  version,
  versionBannerInfix,
  versionLabel,
  versionLinks,
} from './versions';

type SidebarItem = DefaultTheme.SidebarItem;

const description =
  'Generate massive amounts of fake (but reasonable) data for testing and development.';
const socialImage = 'https://fakerjs.dev/social-image.png';
const consoleDownload = isReleaseBranch
  ? `https://cdn.jsdelivr.net/npm/@faker-js/faker@${version}/+esm`
  : '/faker.js';
const consoleVersion = isReleaseBranch
  ? version
  : `${version.replace(/-.*$/, '')}-preview+${commitHash}`;

function getSideBarWithExpandedEntry(entryToExpand: string): SidebarItem[] {
  const links: SidebarItem[] = [
    {
      text: 'Guide',
      items: [
        {
          text: 'Getting Started',
          link: '/guide/',
        },
        {
          text: 'Usage',
          link: '/guide/usage',
        },
        {
          text: 'Localization',
          link: '/guide/localization',
        },
        {
          text: 'Frameworks',
          link: '/guide/frameworks',
        },
        {
          text: 'Randomizer',
          link: '/guide/randomizer',
        },
        {
          text: 'Unique Values',
          link: '/guide/unique',
        },
        {
          text: 'Upgrading to v9',
          link: '/guide/upgrading',
        },
      ],
    },
    {
      text: 'API',
      items: apiPages,
    },
    {
      text: 'About',
      items: [
        {
          text: 'Announcements',
          link: '/about/announcements',
          items: [
            { text: '2024-10-26', link: '/about/announcements/2024-10-26' },
            { text: '2022-09-08', link: '/about/announcements/2022-09-08' },
            { text: '2022-01-14', link: '/about/announcements/2022-01-14' },
          ],
        },
        {
          text: 'Roadmap',
          link: '/about/roadmap/',
          items: [
            {
              text: 'v9 - Tree-Shakeable Module-Functions',
              link: '/about/roadmap/v9',
            },
            { text: 'v8 - Make Faker Handier', link: '/about/roadmap/v8' },
            {
              text: 'v7 - Cleanup & Improvements',
              link: '/about/roadmap/v7',
            },
            { text: 'v6 - Continue Faker', link: '/about/roadmap/v6' },
          ],
        },
        {
          text: 'Team',
          link: '/about/team',
        },
        {
          text: 'Contributing',
          link: '/about/contributing',
        },
      ],
    },
  ];

  for (const entry of links) {
    entry.collapsed = entry.text !== entryToExpand;
  }

  return links;
}

// TODO @Shinigami92 2023-12-28: reuse `defineConfig` from vitepress, when we can go esm-only
const config: UserConfig<DefaultTheme.Config> = {
  title: 'Faker',
  description,

  head: [
    ['link', { rel: 'icon', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#40af7c' }],
    ['meta', { name: 'og:title', content: 'FakerJS' }],
    ['meta', { name: 'og:description', content: description }],
    ['meta', { name: 'og:image', content: socialImage }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'FakerJS' }],
    ['meta', { name: 'twitter:description', content: description }],
    ['meta', { name: 'twitter:site', content: '@faker_js' }],
    ['meta', { name: 'twitter:image', content: socialImage }],
    ['meta', { name: 'twitter:image:alt', content: 'The FakerJS logo' }],
    ['link', { rel: 'me', href: 'https://fosstodon.org/@faker_js' }],
    [
      'script',
      { id: 'browser-console-faker' },
      `
const logStyle = 'background: rgba(16, 183, 127, 0.14); color: rgba(255, 255, 245, 0.86); padding: 0.5rem; display: inline-block;';
console.log(\`%cIf you would like to test Faker in the browser console, you can do so using 'await enableFaker()'.
If you would like to test Faker in a playground, visit https://new.fakerjs.dev.\`, logStyle);
async function enableFaker() {
  const imported = await import('${consoleDownload}');
  Object.assign(globalThis, imported);
  console.log(\`%cYou can now start using Faker v${consoleVersion}:
e.g. 'faker.food.description()' or 'fakerZH_CN.person.firstName()'
For other languages please refer to https://fakerjs.dev/guide/localization.html#available-locales
For a full list of all methods please refer to https://fakerjs.dev/api/\`, logStyle);
  enableFaker = () => imported; // Init only once
  return imported;
}
`,
    ],
  ],

  themeConfig: {
    logo: '/logo.svg',

    editLink: {
      pattern: 'https://github.com/faker-js/faker/edit/next/docs/:path',
      text: 'Suggest changes to this page',
    },

    socialLinks: [
      { icon: 'discord', link: 'https://chat.fakerjs.dev' },
      { icon: 'mastodon', link: 'https://fosstodon.org/@faker_js' },
      { icon: 'x', link: 'https://twitter.com/faker_js' },
      { icon: 'github', link: 'https://github.com/faker-js/faker' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/@faker-js/faker' },
      {
        icon: {
          svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Open Collective</title><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12c2.54 0 4.894-.79 6.834-2.135l-3.107-3.109a7.715 7.715 0 1 1 0-13.512l3.107-3.109A11.943 11.943 0 0 0 12 0zm9.865 5.166l-3.109 3.107A7.67 7.67 0 0 1 19.715 12a7.682 7.682 0 0 1-.959 3.727l3.109 3.107A11.943 11.943 0 0 0 24 12c0-2.54-.79-4.894-2.135-6.834z"/></svg>',
        },
        link: 'https://opencollective.com/fakerjs',
        ariaLabel: 'Open Collective',
      },
    ],

    algolia:
      process.env.API_KEY == null || process.env.APP_ID == null
        ? undefined
        : {
            apiKey: process.env.API_KEY,
            appId: process.env.APP_ID,
            indexName: algoliaIndex,
          },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-present Faker.',
    },

    nav: [
      { text: 'Guide', activeMatch: `^/guide/`, link: '/guide/' },
      {
        text: 'API',
        activeMatch: `^/api/`,
        link: '/api/',
      },
      {
        text: 'Try it',
        items: [
          { text: 'StackBlitz ', link: 'https://fakerjs.dev/new' },
          { text: 'Browser Console ', link: '/guide/usage.html#browser' },
        ],
      },
      {
        text: 'About',
        activeMatch: `^/about/`,
        items: [
          {
            text: 'Announcements',
            link: '/about/announcements',
          },
          {
            text: 'Roadmap',
            link: '/about/roadmap/',
          },
          {
            text: 'Team',
            link: '/about/team',
          },
          {
            text: 'Contributing',
            link: '/about/contributing',
          },
        ],
      },
      {
        text: versionLabel,
        items: [
          {
            text: 'Release Notes',
            link: 'https://github.com/faker-js/faker/releases',
          },
          ...versionLinks.map(({ version, link }) => ({
            text: version,
            link,
          })),
        ],
      },
    ],

    sidebar: {
      '/guide/': getSideBarWithExpandedEntry('Guide'),
      '/api/': getSideBarWithExpandedEntry('API'),
      '/about/': getSideBarWithExpandedEntry('About'),
    },
  },

  vite: {
    define: {
      __BANNER__: versionBannerInfix ?? false,
    },
  },
};

if (versionBannerInfix) {
  config.head?.push([
    'script',
    { id: 'restore-banner-preference' },
    `
(() => {
  const restore = (key, cls, def = false) => {
    const saved = localStorage.getItem(key);
    if (saved ? saved !== 'false' && new Date() < saved : def) {
      document.documentElement.classList.add(cls);
    }
  };
  restore('faker-version-banner', 'banner-dismissed');
})();`,
  ]);
}

export default config;
