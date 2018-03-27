import path from 'path';
import chalk from 'chalk';
import _ from 'lodash';
import figures from 'figures';
import { table } from 'table';
import prettyTime from 'pretty-time';
import getDescription from './description';

const BAR_LENGTH = 25;
const IS_WINDOWS = /^win/.test(process.platform);
const BLOCK_CHAR = IS_WINDOWS ? ' ' : '█';
const BLOCK_CHAR2 = IS_WINDOWS ? '=' : '█';
const BAR_BEFORE = IS_WINDOWS ? '[' : '';
const BAR_AFTER = IS_WINDOWS ? ']' : '';
const NEXT = chalk.blue(figures(' › '));

export const BULLET = figures('●');

export const colorize = (color) => {
  if (color[0] === '#') {
    return chalk.hex(color);
  }

  return chalk.color(color);
};

export const renderBar = (progress, color) => {
  const w = progress * (BAR_LENGTH / 100);
  const bg = chalk.white(BLOCK_CHAR);
  const fg = colorize(color)(BLOCK_CHAR2);

  return BAR_BEFORE +
    _.range(BAR_LENGTH).map(i => (i < w ? fg : bg)).join('') +
    BAR_AFTER;
};

const hasValue = s => s && s.length;

const nodeModules = `${path.delimiter}node_modules${path.delimiter}`;
const removeAfter = (delimiter, str) => _.first(str.split(delimiter));
const removeBefore = (delimiter, str) => _.last(str.split(delimiter));

const firstMatch = (regex, str) => {
  const m = regex.exec(str);
  return m ? m[0] : null;
};

export const parseRequst = (requestStr) => {
  const parts = (requestStr || '').split('!');

  const file = path.relative(process.cwd(), removeAfter('?', removeBefore(nodeModules, (parts.pop()))));

  const loaders = _.uniq(parts.map(part => firstMatch(/[a-z]+-loader/, part)).filter(hasValue));

  return {
    file: hasValue(file) ? file : null,
    loaders,
  };
};

export const formatRequest = (request) => {
  const loaders = request.loaders.join(NEXT);
  const format = chalk.grey;

  if (!loaders.length) {
    return format(request.file || '');
  }

  return format(`${loaders}${NEXT}${request.file}`);
};

export const printStats = (allStats) => {
  Object.keys(allStats).forEach((category) => {
    const stats = allStats[category];

    process.stderr.write(`\nStats by ${chalk.bold(_.startCase(category))}\n`);

    let totalRequests = 0;
    const totalTime = [0, 0];

    const data = [
      [_.startCase(category), 'Requests', 'Time', 'Time/Request', 'Description'],
    ];

    Object.keys(stats).forEach((item) => {
      const stat = stats[item];

      totalRequests += stat.count || 0;

      const description = getDescription(category, item);

      totalTime[0] += stat.time[0];
      totalTime[1] += stat.time[1];

      const avgTime = [stat.time[0] / stat.count, stat.time[1] / stat.count];

      data.push([item, stat.count || '-', prettyTime(stat.time), prettyTime(avgTime), description]);
    });

    data.push(['Total', totalRequests, prettyTime(totalTime), '', '']);

    process.stderr.write(`\n${table(data)}\n`);
  });
};
