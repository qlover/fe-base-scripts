import { readJSON } from '../utils/index.js';
import { cosmiconfigSync } from 'cosmiconfig';
import lodash from 'lodash';
import isCI from 'is-ci';

const defaultConfig = readJSON(
  new URL('../config/fe-scripts.json', import.meta.url)
);

const searchPlaces = [
  'package.json',
  '.fe-scripts.json',
  '.fe-scripts.js',
  '.fe-scripts.ts',
  '.fe-scripts.cjs',
  '.fe-scripts.yaml',
  '.fe-scripts.yml'
];

const loaders = {};
const getLocalConfig = ({ file, dir = process.cwd() }) => {
  const localConfig = {};
  if (file === false) return localConfig;
  const explorer = cosmiconfigSync('fe-scripts', {
    searchPlaces,
    loaders
  });
  const result = file ? explorer.load(file) : explorer.search(dir);
  if (result && typeof result.config === 'string') {
    throw new Error(`Invalid configuration file at ${result.filepath}`);
  }
  // debug({ cosmiconfig: result });
  return result && lodash.isPlainObject(result.config)
    ? result.config
    : localConfig;
};

export class Config {
  /**
   * @param {object} config
   * @param {string} config.config
   * @param {string} config.configDir
   */
  constructor(config = {}) {
    this.localConfig = getLocalConfig({
      file: config.config,
      dir: config.configDir
    });
    this.options = this.mergeOptions();
  }

  mergeOptions() {
    return lodash.defaultsDeep(
      {
        ci: isCI
      },
      this.localConfig,
      defaultConfig
    );
  }
}
