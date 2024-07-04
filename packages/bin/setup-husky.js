#!/usr/bin/env node

import { dirname, join, resolve } from 'path';
import { install, add } from 'husky';
import { Shell } from '../lib/index.js';
import { readJSON } from '../utils/files.js';
import { fileURLToPath } from 'url';

async function main() {
  const shell = new Shell();
  const relativePath = resolve('./');
  const absoultePath = join(dirname(fileURLToPath(import.meta.url)), '../../');

  await shell.exec(`npx rimraf ${join(relativePath, '.husky')}`);

  const pkg = readJSON(join(absoultePath, 'package.json'));
  const { name } = pkg;

  // if (
  //   devDependencies['cz-conventional-changelog'] ||
  //   dependencies['cz-conventional-changelog']
  // ) {
  //   await shell.exec(
  //     'npx commitizen init cz-conventional-changelog --save-dev --save-exact --force'
  //   );
  // }

  install();
  // husky.add(
  //   join(rootPath, '.husky/pre-commit'),
  //   '#!/bin/sh\n. "$(dirname "$0")/_/husky.sh"\nnpm run lint\n'
  // )

  const commitlintConfig = join(absoultePath, 'commitlint.config.js');
  // const commitlintConfig = join(`node_modules/${name}`, 'commitlint.config.js');

  const command = `npx --no -- commitlint --config ${commitlintConfig} --edit "$1"`;
  add(join(relativePath, '.husky/commit-msg'), command);
}

main();
