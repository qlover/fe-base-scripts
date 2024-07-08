#!/usr/bin/env node

import { Release } from '../lib/index.js';
import { ReleaseConfig } from '../lib/releaseConfig.js';

async function main() {
  this.log.log('Publishing to NPM and GitHub...');

  const releaseConfig = new ReleaseConfig().setup();

  const release = new Release(releaseConfig);

  await release.releaseIt();

  // const { tagName, releaseBranch } = await release.createReleaseBranch();

  // const prNumber = await release.createReleasePR(tagName, releaseBranch);

  // await release.autoMergePR(prNumber);

  // await release.checkedPR(prNumber, releaseBranch);

  releaseConfig.log.success('Release successfully');
}

main();
