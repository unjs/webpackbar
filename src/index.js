import webpack from 'webpack';
import chalk from 'chalk';
import _ from 'lodash';
import logUpdate from 'log-update';
import Profile from './profile';
import { BULLET, parseRequst, formatRequest, renderBar, printStats, colorize } from './utils';

const sharedState = {};

const defaults = { name: 'webpack', color: 'green', profile: false };

export default class WebpackBarPlugin extends webpack.ProgressPlugin {
  constructor(options) {
    super();

    this.options = Object.assign({}, defaults, options);

    this.handler = (percent, msg, ...details) => this.updateProgress(percent, msg, details);

    // Don't throttle when profiling
    if (!this.options.profile) {
      this.handler = _.throttle(this.handler, 25, { leading: true, trailing: true });
    }

    this.logUpdate = this.options.logUpdate || logUpdate;

    if (!sharedState[this.options.name]) {
      sharedState[this.options.name] = {
        color: this.options.color,
        profile: this.options.profile ? new Profile(this.options.name) : null,
      };
    }
  }

  apply(compiler) {
    super.apply(compiler);

    if (compiler.hooks) {
      // Webpack >= 4
      compiler.hooks.done.tap('webpackbar', () => this.done());
    } else {
      // Webpack < 4
      compiler.plugin('done', () => this.done());
    }
  }

  done() {
    logUpdate.clear();

    if (this.options.profile) {
      const stats = sharedState[this.options.name].profile.getStats();
      printStats(stats);
    }
  }

  updateProgress(percent, msg, details) {
    const progress = Math.floor(percent * 100);

    Object.assign(sharedState[this.options.name], {
      progress,
      msg,
      details: details || [],
      request: parseRequst(details[2]),
      isRunning: (progress && progress !== 100) && (msg && msg.length),
    });

    if (this.options.profile) {
      sharedState[this.options.name].profile
        .onRequest(sharedState[this.options.name].request);
    }

    // Process all states
    let isRunning = false;

    const lines = [];

    _.sortBy(Object.keys(sharedState), s => s.name).reverse().forEach((name) => {
      const state = sharedState[name];

      if (state.isRunning) {
        isRunning = true;
      } else {
        return;
      }

      const lColor = colorize(state.color);
      const lIcon = lColor(BULLET);
      const lName = lColor(_.startCase(name));
      const lBar = renderBar(state.progress, state.color);
      const lMsg = _.startCase(state.msg);
      const lProgress = `(${state.progress}%)`;
      const lDetail1 = chalk.grey(state.details[0] || '');
      const lDetail2 = chalk.grey(state.details[1] || '');
      const lRequest = formatRequest(state.request);

      lines.push(`${[lIcon, lName, lBar, lMsg, lProgress, lDetail1, lDetail2].join(' ')}\n ${lRequest}`);
    });

    if (!isRunning) {
      this.logUpdate.clear();
    } else {
      const title = ` ${chalk.bgBlue.black(' BUILDING ')}`;
      this.logUpdate(`\n${title}\n\n${lines.join('\n\n')}`);
    }
  }
}
