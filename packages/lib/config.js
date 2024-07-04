import lodash from 'lodash';
import isCI from 'is-ci';
import { feScriptsSearch } from './index.js';

export class Config {
  /**
   * @param {object} config
   * @param {string} config.config
   * @param {string} config.configDir
   */
  constructor(config = {}) {
    this.localConfig = feScriptsSearch.get({
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
      feScriptsSearch.config._default
    );
  }
}
