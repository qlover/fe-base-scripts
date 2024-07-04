#!/usr/bin/env node

import { loadEnv, getEnvDestroy } from '../utils/env.js';
import { Release, Logger, feScriptsSearch } from '../lib/index.js';
import { readJSON } from '../utils/files.js';
import { resolve } from 'path';
import lodash from 'lodash';
const pkg = readJSON(resolve('./package.json'));

const { get, isPlainObject, isString } = lodash;

const log = new Logger();

function isValidString(value) {
  return value && isString(value);
}

function getUserInfo() {
  const { author, repository } = pkg;
  const feScriptsConfig = feScriptsSearch.config;
  const localAuthor = feScriptsConfig.author || author;

  // check author
  const authorName = isPlainObject(localAuthor)
    ? get(localAuthor, 'name')
    : localAuthor;

  if (!isValidString(authorName)) {
    throw new Error('please set .fe-scripts valid author');
  }

  const repoName =
    feScriptsConfig.repository || repository.url.split('/').pop();
  // check repo
  if (!isValidString(repoName)) {
    throw new Error('please set .fe-scripts repository author');
  }

  return { repoName, authorName };
}

async function main() {
  loadEnv();

  if (process.env.RELEASE === 'false') {
    log.warn('Skip Release');
    return;
  }

  if (!process.env.NPM_TOKEN) {
    log.error('NPM_TOKEN environment variable is not set.');
    process.exit(1);
  }
  if (!process.env.GITHUB_TOKEN) {
    log.error('GITHUB_TOKEN environment variable is not set.');
    process.exit(1);
  }

  const userInfo = getUserInfo();

  const { Octokit } = await import('@octokit/rest');

  const ghToken = getEnvDestroy('GITHUB_TOKEN') || '';

  const release = new Release({
    repo: userInfo.repoName,
    owner: userInfo.authorName,
    ghToken,
    npmToken: process.env.NPM_TOKEN,
    pkgVersion: pkg.version,
    prBranch: process.env.PR_BRANCH,
    octokit: new Octokit({ auth: ghToken })
  });

  await release.publish();

  const { tagName, releaseBranch } = await release.createReleaseBranch();

  const prNumber = await release.createReleasePR(tagName, releaseBranch);

  await release.autoMergePR(prNumber);

  await release.checkedPR(prNumber, releaseBranch);

  log.success('Release successfully');
}

main();
