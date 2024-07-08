import { feScriptsSearch } from './index.js';
import { readJSON } from '../utils/files.js';
import loadsh from 'lodash';
import { join, resolve } from 'path';
import { Logger } from './logger.js';
import { getEnvDestroy, loadEnv } from '../utils/env.js';
import { cosmiconfigSync } from 'cosmiconfig';
import { format } from '../utils/index.js';

const { isString, isPlainObject, get } = loadsh;
const pkg = readJSON(resolve('./package.json'));

function isValidString(value) {
  return value && isString(value);
}

// https://github.com/release-it/release-it/blob/main/lib/config.js#L11
const searchPlaces = [
  'package.json',
  '.release-it.json',
  '.release-it.js',
  '.release-it.ts',
  '.release-it.cjs',
  '.release-it.yaml',
  '.release-it.yml'
  // FIXME:
  // '.release-it.toml'
];

export class ReleaseConfig {
  constructor({ isCreateRelease } = {}) {
    this.isCreateRelease = !!isCreateRelease;
    this.ghToken = '';
    this.npmToken = '';
    this.branch = '';
    this.feScriptsConfig = feScriptsSearch.config;
    this.userInfo = this.getUserInfo();
    this.pkgVersion = pkg.version;
    this.log = new Logger();
  }

  setup() {
    loadEnv();

    if (process.env.RELEASE === 'false') {
      this.log.warn('Skip Release');
      process.exit(0);
    }

    if (!process.env.NPM_TOKEN) {
      this.log.error('NPM_TOKEN environment variable is not set.');
      process.exit(1);
    }
    if (!process.env.GITHUB_TOKEN) {
      this.log.error('GITHUB_TOKEN environment variable is not set.');
      process.exit(1);
    }

    this.ghToken = getEnvDestroy('GITHUB_TOKEN') || '';
    this.npmToken = process.env.NPM_TOKEN;
    this.branch = process.env.PR_BRANCH;
    this.env = process.env.NODE_ENV;
    return this;
  }

  getUserInfo() {
    const { repository, author } = pkg;
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
      throw new Error('please set .fe-scripts repository');
    }

    return { repoName, authorName };
  }

  async getOctokit() {
    if (this.octokit) {
      return this.octokit;
    }

    const { Octokit } = await import('@octokit/rest');

    const octokit = new Octokit({ auth: this.ghToken });

    this.octokit = octokit;

    return octokit;
  }

  /**
   * @see https://github.com/release-it/release-it/blob/main/lib/config.js#L29
   * @returns
   * TODO:
   *  If the release it of the project is configured, merge it with the local default one
   *  Directly return a config configuration file path
   */
  getReleaseItConfig() {
    const explorer = cosmiconfigSync('release-it', { searchPlaces });
    const result = explorer.search(resolve());

    // find!
    if (result) {
      return;
    }

    // this json copy with release-it default json
    return join(__dirname, '../../.release-it.json');
  }

  getReleaseBranch(tagName) {
    return format(
      loadsh.get(this.feScriptsConfig, ['release', 'branchName']) || '',
      {
        env: this.env,
        branch: this.branch,
        tagName
      }
    );
  }

  getReleasePRTitle(tagName) {
    return format(
      loadsh.get(this.feScriptsConfig, ['release', 'PRTitle']) || '',
      {
        env: this.env,
        branch: this.branch,
        tagName
      }
    );
  }

  getReleasePRBody(tagName) {
    return format(
      loadsh.get(this.feScriptsConfig, ['release', 'PRBody']) || '',
      {
        env: this.env,
        branch: this.branch,
        tagName
      }
    );
  }
}
