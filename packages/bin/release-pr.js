#!/usr/bin/env node

import { Release } from '../lib/index.js';
import { ReleaseConfig } from '../lib/releaseConfig.js';

async function main() {
  const releaseConfig = new ReleaseConfig({ isCreateRelease: true }).setup();

  releaseConfig.log.log('Create Publish to NPM and Github PR ...');
  const release = new Release(releaseConfig);

  await release.releaseIt();

  const { tagName, releaseBranch } = await release.createReleaseBranch();

  const prNumber = await release.createReleasePR(tagName, releaseBranch);

  if (releaseConfig.feScriptsConfig.release.autoMergeReleasePR) {
    releaseConfig.log.log('auto mergae release PR...');

    await release.autoMergePR(prNumber);

    await release.checkedPR(prNumber, releaseBranch);
  }

  releaseConfig.log.success(`Create Release PR(#${prNumber}) successfully`);
}

main();
