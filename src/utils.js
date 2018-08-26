import path from 'path';

import chalk from 'chalk';
import startCase from 'lodash.startcase';
import range from 'lodash.range';
import first from 'lodash.first';
import last from 'lodash.last';
import figures from 'figures';
import table from 'text-table';
import prettyTime from 'pretty-time';

import getDescription from './description';

const BAR_LENGTH = 25;
const BLOCK_CHAR = '█';
const BLOCK_CHAR2 = '█';
const NEXT = chalk.blue(figures(' › '));

export const BULLET = figures('●');
export const TICK = chalk.green(figures('✔'));

// eslint-disable-next-line no-control-regex
const ansiStringLength = (str) => str.replace(/\u001b[^m]*m/g, '').length;

function createTable(data) {
  return table(data, {
    align: data[0].map(() => 'l'),
    hsep: ' '.repeat(8),
    stringLength: ansiStringLength,
  }).replace(/^(.*)/gm, `  $1`);
}

export const colorize = (color) => {
  if (color[0] === '#') {
    return chalk.hex(color);
  }

  return chalk[color] || chalk.keyword(color);
};

export const renderBar = (progress, color) => {
  const w = progress * (BAR_LENGTH / 100);
  const bg = chalk.white(BLOCK_CHAR);
  const fg = colorize(color)(BLOCK_CHAR2);

  return range(BAR_LENGTH)
    .map((i) => (i < w ? fg : bg))
    .join('');
};

const hasValue = (s) => s && s.length;

const nodeModules = `${path.delimiter}node_modules${path.delimiter}`;
const removeAfter = (delimiter, str) => first(str.split(delimiter));
const removeBefore = (delimiter, str) => last(str.split(delimiter));

const firstMatch = (regex, str) => {
  const m = regex.exec(str);
  return m ? m[0] : null;
};

export const parseRequest = (requestStr) => {
  const parts = (requestStr || '').split('!');

  const file = path.relative(
    process.cwd(),
    removeAfter('?', removeBefore(nodeModules, parts.pop()))
  );

  const loaders = parts
    .map((part) => firstMatch(/[a-z0-9-@]+-loader/, part))
    .filter(hasValue);

  return {
    file: hasValue(file) ? file : null,
    loaders,
  };
};

export const formatRequest = (request) => {
  const loaders = request.loaders.join(NEXT);

  if (!loaders.length) {
    return request.file || '';
  }

  return `${loaders}${NEXT}${request.file}`;
};

export const formatStats = (allStats) => {
  const lines = [];

  Object.keys(allStats).forEach((category) => {
    const stats = allStats[category];

    lines.push(`Stats by ${chalk.bold(startCase(category))}`);

    let totalRequests = 0;
    const totalTime = [0, 0];

    const data = [
      [
        startCase(category),
        'Requests',
        'Time',
        'Time/Request',
        'Description',
      ].map((str) => chalk.grey(str)),
    ];

    Object.keys(stats).forEach((item) => {
      const stat = stats[item];

      totalRequests += stat.count || 0;

      const description = getDescription(category, item);

      totalTime[0] += stat.time[0];
      totalTime[1] += stat.time[1];

      const avgTime = [stat.time[0] / stat.count, stat.time[1] / stat.count];

      data.push([
        item,
        stat.count || '-',
        prettyTime(stat.time),
        prettyTime(avgTime),
        description,
      ]);
    });

    data.push(['Total', totalRequests, prettyTime(totalTime), '', '']);

    lines.push(createTable(data));
  });

  return lines.join('\n\n');
};

export function elipses(str, n) {
  if (str.length <= n - 3) {
    return str;
  }
  return `${str.substr(0, n - 1)}...`;
}

export function elipsesLeft(str, n) {
  if (str.length <= n - 3) {
    return str;
  }
  return `...${str.substr(str.length - n - 1)}`;
}
