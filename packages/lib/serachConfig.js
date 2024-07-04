import { cosmiconfigSync } from 'cosmiconfig';
import lodash from 'lodash';

export class SerachConfig {
  /**
   * @param {import('@qlover/fe-scripts').SerachConfig} config
   */
  constructor(config) {
    this.name = config.name;
    this._config = config.config;
  }

  get localConfig() {
    return this._config._default;
  }

  get config() {
    return lodash.defaultsDeep({}, this.search(), this._config._default);
  }

  get({ file, dir = process.cwd() }) {
    const localConfig = {};
    if (!file) return localConfig;
    const explorer = cosmiconfigSync(this.name, {
      searchPlaces: this._config.searchPlaces,
      loaders: this._config.loaders
    });
    const result = file ? explorer.load(file) : explorer.search(dir);
    if (result && typeof result.config === 'string') {
      throw new Error(`Invalid configuration file at ${result.filepath}`);
    }
    // debug({ cosmiconfig: result });
    return result && lodash.isPlainObject(result.config)
      ? result.config
      : localConfig;
  }

  /**
   * TODO: need cache
   * @returns
   */
  search() {
    return this.get({});
  }
}
