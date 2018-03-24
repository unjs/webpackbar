import path from 'path';
import chalk from 'chalk';
import _ from 'lodash';
import figures from 'figures';

const BAR_LENGTH = 25;
const IS_WINDOWS = /^win/.test(process.platform);
const BLOCK_CHAR = IS_WINDOWS ? ' ' : '█';
const BLOCK_CHAR2 = IS_WINDOWS ? '=' : '█';
const BAR_BEFORE = IS_WINDOWS ? '[' : '';
const BAR_AFTER = IS_WINDOWS ? ']' : '';
const NEXT = figures('›');

export const renderBar = (progress, color) => {
  const w = progress * (BAR_LENGTH / 100);
  const bg = chalk.white(BLOCK_CHAR);
  const fg = chalk.keyword(color)(BLOCK_CHAR2);

  return BAR_BEFORE +
    _.range(BAR_LENGTH).map(i => (i < w ? fg : bg)).join('') +
    BAR_AFTER;
};

export const friendlyName = (s) => {
  const match = /[a-z]+-loader/.exec(s);
  if (match) {
    return match[0];
  }

  let f = path.relative(process.cwd(), s);
  f = _.last(f.split(`node_modules${path.delimiter}`));
  return f.split('?')[0];
};

export const formatModule = s => s.split('!').map(friendlyName).join(NEXT);

export const str = s => (s ? String(s) : '');
