#!/usr/bin/env node

import { program } from 'commander';
import { resolve } from 'path';
import { exec } from 'child_process';

program.option('-p, --path', 'run script path');

program.parse();

async function main() {
  const path = program.args[0];

  if (!path) {
    console.log('path is undefined');
    return;
  }

  const scriptPath = resolve(path);
  // FIXME: (node:93152) ExperimentalWarning: --experimental-loader may be removed in the future; instead use register():
  const scriptCMD = `node --loader ts-node/esm ${scriptPath}`;

  exec(scriptCMD, (error, stdout, stderr) => {
    if (error) {
      console.log('[Error]', error);
    } else {
      console.log(stdout);
    }
  });
}

main();
