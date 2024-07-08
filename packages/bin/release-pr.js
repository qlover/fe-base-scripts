#!/usr/bin/env node

import { Release } from '../lib/index.js';
import { ReleaseConfig } from '../lib/releaseConfig.js';

async function main() {
  this.log.log('Create Publish to NPM and Github PR ...');

  const releaseConfig = new ReleaseConfig({ isCreateRelease: true }).setup();

  const release = new Release(releaseConfig);

  await release.releaseIt();

  const { tagName, releaseBranch } = await release.createReleaseBranch();

  const prNumber = await release.createReleasePR(tagName, releaseBranch);

  await release.autoMergePR(prNumber);

  release.checkedPR(prNumber, releaseBranch);

  releaseConfig.log.success('Create Release successfully');
}

main();
