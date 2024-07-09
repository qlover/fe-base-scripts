import { Shell } from './shell.js';
import { Logger } from './logger.js';

export class Release {
  constructor(config) {
    /**
     * @type {import('./releaseConfig.js').ReleaseConfig} config
     */
    this.config = config;
    this.log = new Logger();
    this.shell = new Shell();
  }

  get releaseItEnv() {
    return {
      ...process.env,
      NPM_TOKEN: this.config.npmToken,
      GITHUB_TOKEN: this.config.ghToken
    };
  }

  getPRNumber(output) {
    const prUrlPattern = /https:\/\/github\.com\/[^/]+\/[^/]+\/pull\/(\d+)/;
    const match = output.match(prUrlPattern);
    return (match && match[1]) || '';
  }

  componseReleaseItCommand() {
    const releaseItConfig = this.config.getReleaseItConfig();
    // search
    const command = ['npx release-it'];

    command.push('--ci');

    // 1. no publish npm
    // 2. no publish github/release/tag
    if (this.config.isCreateRelease) {
      command.push(
        '--no-git.tag --no-git.push --no-npm.publish --no-github.release'
        // '--no-npm.publish --no-git.tag --no-git.push --no-github.publish --no-github.release'
      );
    }
    // use current pkg, no publish npm and publish github
    else {
      command.push('--no-increment');
    }

    if (releaseItConfig) {
      command.push(`--config ${releaseItConfig}`);
    }

    return command.join(' ');
  }

  async releaseIt() {
    await this.shell.exec(
      `echo "//registry.npmjs.org/:_authToken=${this.config.npmToken}" > .npmrc`
    );

    await this.shell.exec(this.componseReleaseItCommand(), {
      env: this.releaseItEnv
    });
  }

  async checkTag() {
    const lastTag = await this.shell.exec(
      `git tag --sort=-creatordate | head -n 1`,
      {
        silent: true
      }
    );
    const tagName = lastTag || this.config.pkgVersion;
    this.log.log('Created Tag is:', tagName);

    return { tagName };
  }

  async createReleaseBranch() {
    const { tagName } = await this.checkTag();

    // create a release branch, use new tagName as release branch name
    const releaseBranch = this.config.getReleaseBranch(tagName);

    this.log.log('Create Release PR branch', releaseBranch);

    await this.shell.exec(`git merge origin/${this.config.branch}`);
    await this.shell.exec(`git checkout -b ${releaseBranch}`);

    try {
      await this.shell.exec(`git push origin ${releaseBranch}`);
      this.log.success(`PR Branch ${releaseBranch} push Successfully!`);
    } catch (error) {
      this.log.error(error);
    }

    return { tagName, releaseBranch };
  }

  async createPRLabel() {
    try {
      const label = this.config.feScriptsConfig.release.label;
      await this.shell.exec(
        'gh label create "${name}" --description "${description}" --color "${color}"',
        {},
        label
      );
    } catch (error) {
      this.log.error('create pr label', error);
    }
  }

  async createReleasePR(tagName, releaseBranch) {
    this.log.log('Create Release PR', tagName, releaseBranch);

    await this.shell.exec(
      `echo "${this.config.ghToken}" | gh auth login --with-token`
    );

    await this.createPRLabel();

    const title = this.config.getReleasePRTitle(tagName);
    const body = this.config.getReleasePRBody(tagName);
    const label = this.config.feScriptsConfig.release.label;
    const command = `gh pr create --title "${title}" --body "${body}" --base ${this.config.branch} --head ${releaseBranch} --label "${label.name}"`;

    let output = '';
    try {
      output = await this.shell.run(command);
    } catch (error) {
      if (error.toString().includes('already exists:')) {
        this.log.warn('already PR');
        output = error.toString();
      } else {
        throw error;
      }
    }

    const prNumber = this.getPRNumber(output);

    if (!prNumber) {
      this.log.error('Created PR Failed');
      // process.exit(1);
      return;
    }
    this.log.log(output);
    this.log.success('Created PR Successfully');

    return prNumber;
  }

  async autoMergePR(prNumber) {
    if (!prNumber) {
      this.log.error('Failed to create Pull Request.', prNumber);
      return;
    }

    const userInfo = this.config.userInfo;
    if (!userInfo.repoName || !userInfo.authorName) {
      this.log.error('Not round repo or owner!!!');
      process.exit(1);
    }

    this.log.log(`Merging PR #${prNumber} ...`);

    const octokit = await this.config.getOctokit();
    await octokit.pulls.merge({
      owner: userInfo.authorName,
      repo: userInfo.repoName,
      pull_number: prNumber,
      merge_method: 'merge' // 合并方式，可以是 merge, squash 或 rebase
    });

    this.log.success('Merged successfully');
  }

  async checkedPR(prNumber, releaseBranch) {
    await this.shell.exec(`gh pr view ${prNumber}`);
    // this.shell.exec(`git checkout ${this.mainBranch}`);
    // this.shell.exec(`git branch -d ${releaseBranch}`);
    await this.shell.exec(`git push origin --delete ${releaseBranch}`);

    this.log.success(`Branch ${releaseBranch} has been deleted`);
  }
}
