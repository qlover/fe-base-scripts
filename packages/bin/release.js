#!/usr/bin/env node

import { Release } from '../lib/index.js';
import { ReleaseConfig } from '../lib/releaseConfig.js';

async function main() {
  const releaseConfig = new ReleaseConfig({ increment: false }).setup();
  console.log(releaseConfig);
  const release = new Release(releaseConfig);

  await release.releaseIt();

  const { tagName, releaseBranch } = await release.createReleaseBranch();

  console.log(tagName, releaseBranch);
  // const prNumber = await release.createReleasePR(tagName, releaseBranch);

  // await release.autoMergePR(prNumber);

  // await release.checkedPR(prNumber, releaseBranch);

  // log.success('Release successfully');
}

main();
