import fs from 'fs';
import { Logger } from '../lib/logger.js';
import lodash from 'lodash';

const log = new Logger();

export const readJSON = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));

export const format = (template = '', context = {}) => {
  try {
    return lodash.template(template)(context);
  } catch (error) {
    log.error(
      `Unable to render template with context:\n${template}\n${JSON.stringify(context)}`
    );
    log.error(error);
    throw error;
  }
};
