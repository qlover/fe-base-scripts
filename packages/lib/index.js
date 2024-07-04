import searchConfig from '../config/search.config.js';
import { SerachConfig } from './serachConfig.js';

export const feScriptsSearch = new SerachConfig({
  name: 'fe-scripts',
  config: searchConfig.feScripts
});

export * from './logger.js';
export * from './shell.js';
export * from './relesae.js';
