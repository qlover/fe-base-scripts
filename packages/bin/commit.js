import { resolve } from 'path';
import { bootstrap } from 'commitizen/dist/cli/git-cz.js';
import { Shell } from '../lib/index.js';

function main() {
  const shell = new Shell();

  // git add
  shell.exec('git add .');

  // cz
  // https://www.npmjs.com/package/commitizen#Commitizen for multi-repo projects
  bootstrap({
    cliPath: resolve('node_modules/commitizen'),
    config: {
      path: resolve('node_modules/cz-conventional-changelog')
    }
  });
}

main();
