#!/usr/bin/env node

import { Release } from '../lib/index.js';
import { ReleaseConfig } from '../lib/releaseConfig.js';

async function main() {
  const releaseConfig = new ReleaseConfig().setup();

  releaseConfig.log.log('Publishing to NPM and GitHub...');

  const release = new Release(releaseConfig);

  await release.releaseIt();

  releaseConfig.log.success('Release successfully');
}

main();
