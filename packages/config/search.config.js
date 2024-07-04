import { readJSON } from '../utils/files.js';

export default {
  /**
   * @type {import('@qlover/fe-scripts').SearchConfigType}
   */
  feScripts: {
    searchPlaces: [
      'package.json',
      '.fe-scripts.json',
      // FIXME: load esm error
      '.fe-scripts.js',
      '.fe-scripts.ts',
      '.fe-scripts.cjs',
      '.fe-scripts.yaml',
      '.fe-scripts.yml'
    ],
    lodaer: {},
    _default: readJSON(new URL('./fe-scripts.json', import.meta.url))
  }
};
