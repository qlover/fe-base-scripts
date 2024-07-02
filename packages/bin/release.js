import { loadEnv, getEnvDestroy } from '../utils/env.js';
import { Release, Logger } from '../lib/index.js';
import { readJSON } from '../utils/files.js';
import { resolve } from 'path';
import lodash from 'lodash';

const pkg = readJSON(resolve('./package.json'));
const { get, isPlainObject, isString } = lodash;
const { author, repository, version } = pkg;

const log = new Logger();

function isValidString(value) {
  return value && isString(value);
}

async function main() {
  loadEnv();

  if (process.env.RELEASE === 'false') {
    log.warn('Skip Release');
    return;
  }

  // check author
  const authorName = isPlainObject(author) ? get(author, 'name') : author;
  if (!isValidString(authorName)) {
    log.error('package.json author or author.name is empty');
    return;
  }
  // check repo
  const repoName = repository.url.split('/').pop();
  if (!isValidString(repoName)) {
    log.error('package.json repository.url is empty');
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

  const { Octokit } = await import('@octokit/rest');

  const ghToken = getEnvDestroy('GITHUB_TOKEN') || '';

  const release = new Release({
    repo: repoName,
    owner: authorName,
    ghToken,
    pkgVersion: version,
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
