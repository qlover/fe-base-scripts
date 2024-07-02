import test from 'ava';
import { Release } from '../../packages/lib/relesae.js';
import { readJSON } from '../../packages/utils/files.js';
import { resolve } from 'node:path';
import lodash from 'lodash';
import { Octokit } from '@octokit/rest';

const { isPlainObject, get } = lodash;
const pkg = readJSON(resolve('./package.json'));

test('ready Release args(author,repoName)', (t) => {
  const authorName = isPlainObject(pkg.author)
    ? get(pkg.author, 'name')
    : pkg.author;
  const repoName = pkg.repository.url.split('/').pop();

  t.assert(typeof authorName === 'string' && authorName.length !== 0);
  t.assert(typeof repoName === 'string' && repoName !== 0);
});

test('release getNumber vaild', async (t) => {
  const authorName = isPlainObject(pkg.author)
    ? get(pkg.author, 'name')
    : pkg.author;
  const repoName = pkg.repository.url.split('/').pop();
  const ghToken = 'xxx';
  const release = new Release({
    repo: repoName,
    owner: authorName,
    ghToken,
    pkgVersion: pkg.version,
    npmToken: 'testnpmtoken',
    prBranch: process.env.PR_BRANCH,
    octokit: new Octokit({ auth: ghToken })
  });

  t.is(
    release.getPRNumber('https://github.com/qlover/fe-base-scripts/pull/2'),
    '2'
  );
  t.is(
    release.getPRNumber(
      'Prefix:https://github.com/qlover/fe-base-scripts/pull/2'
    ),
    '2'
  );

  t.is(
    release.getPRNumber(
      'Prefix:https://github.com/qlover/fe-base-scripts/pull/2suffix'
    ),
    '2'
  );
});
