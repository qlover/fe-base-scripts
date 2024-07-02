import { Config, Logger } from '../lib/index.js';
import { rimraf } from 'rimraf';

async function main() {
  const config = new Config();
  const log = new Logger();
  const files = config.options.cleanFiles.join(' ');
  // https://stackoverflow.com/questions/75281066/error-illegal-characters-in-path-in-npm-rimraf
  await rimraf(config.options.cleanFiles, { glob: true });
  log.success('Clean successfully', files);
}

main();
