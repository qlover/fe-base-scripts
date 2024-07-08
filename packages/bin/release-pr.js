#!/usr/bin/env node

import { Release } from '../lib/index.js';
import { ReleaseConfig } from '../lib/releaseConfig.js';

async function main() {
  const releaseConfig = new ReleaseConfig({ isCreateRelease: true }).setup();

  const release = new Release(releaseConfig);

  await release.releaseIt();

  const { tagName, releaseBranch } = await release.createReleaseBranch();

  await release.createReleasePR(tagName, releaseBranch);

  releaseConfig.log.success('Create Release successfully');
}

main();
