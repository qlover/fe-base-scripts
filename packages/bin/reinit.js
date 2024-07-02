#!/usr/bin/env node

import {
  checkWithInstall,
  checkYarn,
  execPromise
} from '../utils/dependency.js';
import { resolve } from 'path';
import { existsSync } from 'fs';

async function main() {
  console.log(`Current Node.js version is: ${process.version}`);

  // check yarn
  await checkYarn();

  // has lock or modules
  if (existsSync(resolve('node_modules'))) {
    await checkWithInstall('rimraf');

    // run clean bin
    await import('./clean.js');
  }

  await execPromise('yarn --ignore-workspace-root-check', true);

  console.log('✅ Initialized successfully');
}

main();
