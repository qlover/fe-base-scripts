import { join, resolve } from 'path';
import { install, add } from 'husky';
import { Shell } from '../lib/index.js';
import { readJSON } from '../utils/files.js';

const pkg = readJSON(resolve('./package.json'));
const { devDependencies, dependencies } = pkg;

async function main() {
  const shell = new Shell();
  const rootPath = resolve('./');
  await shell.exec(`npx rimraf ${join(rootPath, '.husky')}`);

  if (
    !(
      devDependencies['cz-conventional-changelog'] ||
      dependencies['cz-conventional-changelog']
    )
  ) {
    await shell.exec(
      'npx commitizen init cz-conventional-changelog --save-dev --save-exact'
    );
  }

  install();
  // husky.add(
  //   join(rootPath, '.husky/pre-commit'),
  //   '#!/bin/sh\n. "$(dirname "$0")/_/husky.sh"\nnpm run lint\n'
  // )
  add(
    join(rootPath, '.husky/commit-msg'),
    'npx --no -- commitlint --edit "$1"'
  );
}

main();
