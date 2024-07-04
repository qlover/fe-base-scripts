import searchConfig from '../config/search.config.js';
import { SerachConfig } from './SerachConfig.js';

export const feScriptsSearch = new SerachConfig({
  name: 'fe-scripts',
  config: searchConfig.feScripts
});

export * from './logger.js';
export * from './shell.js';
export * from './relesae.js';
export * from './config.js';
