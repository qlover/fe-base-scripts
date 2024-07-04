#!/usr/bin/env node

import { Logger, feScriptsSearch } from '../lib/index.js';
import { rimraf } from 'rimraf';

async function main() {
  const log = new Logger();
  const config = feScriptsSearch.config;
  const files = config.cleanFiles.join(' ');
  // https://stackoverflow.com/questions/75281066/error-illegal-characters-in-path-in-npm-rimraf
  await rimraf(config.cleanFiles, { glob: true });
  log.success('Clean successfully', files);
}

main();
