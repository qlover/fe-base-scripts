#!/usr/bin/env node

import { dirname, join, resolve } from 'path';
import { bootstrap } from 'commitizen/dist/cli/git-cz.js';
import { Shell } from '../lib/index.js';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

function main() {
  const shell = new Shell();

  // git add
  shell.exec('git add .');

  // Priority dev project
  const changelogRootModules = resolve(
    'node_modules/cz-conventional-changelog'
  );
  const changelogModules = join(
    __dirname,
    '../../node_modules/cz-conventional-changelog'
  );
  const path = existsSync(changelogRootModules)
    ? changelogRootModules
    : changelogModules;

  shell.log.log('czpath:', path);
  // cz
  // https://www.npmjs.com/package/commitizen#Commitizen for multi-repo projects
  bootstrap({
    cliPath: join(__dirname, '../../node_modules/commitizen'),
    config: { path }
  });
}

main();
