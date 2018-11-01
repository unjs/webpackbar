import path from 'path';

import figures from 'figures';
import chalk from 'chalk';

export const nodeModules = `${path.delimiter}node_modules${path.delimiter}`;
export const BAR_LENGTH = 25;
export const BLOCK_CHAR = '█';
export const BLOCK_CHAR2 = '█';
export const NEXT = chalk.blue(figures(' › '));
export const BULLET = figures('●');
export const TICK = chalk.green(figures('✔'));
