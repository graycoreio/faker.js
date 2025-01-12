import { execSync } from 'node:child_process';
import * as semver from 'semver';
import { version as version_ } from '../../package.json';

function readBranchName(): string {
  return (
    execSync('git branch --show-current').toString('utf8').trim() || 'unknown'
  );
}

function readCommitHash(): string {
  return execSync('git rev-parse HEAD').toString('utf8').trim() || 'unknown';
}

function readOtherLatestReleaseTagNames(): string[] {
  const tags = execSync('git tag -l').toString('utf8').split('\n');
  const latestTagByMajor: Record<string, string> = {};
  for (const tag of tags) {
    if (!semver.valid(tag)) {
      continue;
    }

    const majorVersion = semver.major(tag);
    if (majorVersion < 6) {
      continue;
    }

    const latestTag = latestTagByMajor[majorVersion];
    if (latestTag == null || semver.lt(latestTag, tag)) {
      latestTagByMajor[majorVersion] = tag;
    }
  }

  return Object.values(latestTagByMajor).sort(semver.rcompare);
}

// Set by netlify
const {
  CONTEXT: deployContext = 'local',
  BRANCH: branchName = readBranchName(),
  COMMIT_REF: commitRef = readCommitHash(),
} = process.env;

const otherVersions = readOtherLatestReleaseTagNames();
export const isReleaseBranch = /^v\d+$/.test(branchName);

/**
 * The text of the version banner describing the current version.
 *
 * This is `null` in production and thus should not be displayed.
 */
export const versionBannerInfix: string | null = (() => {
  if (deployContext === 'production') {
    return null;
  }

  if (isReleaseBranch) {
    return '"an old version"';
  }

  if (branchName === 'next') {
    return '"the next (unreleased) version"';
  }

  return '"a development version"';
})();

/**
 * The current version of Faker from package.json.
 */
export const version = version_;

/**
 * The commit hash of the current version.
 */
export const commitHash = commitRef.substring(0, 7);

/**
 * The version label to display in the top-right corner of the site.
 */
export const versionLabel = isReleaseBranch ? `v${version}` : branchName;

/**
 * The links to other versions of the documentation.
 */
export const versionLinks = [
  {
    version: 'next',
    link: 'https://next.fakerjs.dev/',
  },
  ...otherVersions.map((version) => ({
    version,
    link: `https://v${semver.major(version)}.fakerjs.dev/`,
  })),
]
  // Don't link to the current branch's version.
  .filter(({ link }) => link !== `https://${branchName}.fakerjs.dev/`);

/**
 * The name of the Algolia index to use for search.
 */
export const algoliaIndex = isReleaseBranch
  ? `fakerjs-v${semver.major(version)}`
  : 'fakerjs-next';
