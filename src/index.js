import webpack from 'webpack';
import chalk from 'chalk';
import _ from 'lodash';
import logUpdate from 'log-update';
import isCI from 'is-ci';
import Profile from './profile';
import {
  BULLET,
  parseRequst,
  formatRequest,
  renderBar,
  printStats,
  colorize,
} from './utils';

const sharedState = {};

const defaults = {
  name: 'webpack',
  color: 'green',
  stream: process.stdout,
  profile: false,
  clear: true,
  showCursor: false,
  enabled: process.stdout.isTTY && !isCI,
  done: null,
  buildTitle: 'BUILDING',
};

export default class WebpackBarPlugin extends webpack.ProgressPlugin {
  constructor(options) {
    super();

    this.options = Object.assign({}, defaults, options);

    if (!this.options.enabled) {
      return;
    }

    // this.handler will be called by webpack.ProgressPlugin
    this.handler = (percent, msg, ...details) =>
      this.updateProgress(percent, msg, details);

    this._render = _.throttle(this.render, 25);

    this.logUpdate =
      this.options.logUpdate ||
      logUpdate.create(this.options.stream, {
        showCursor: this.options.showCursor,
      });

    if (!sharedState[this.options.name]) {
      sharedState[this.options.name] = {
        color: this.options.color,
        profile: this.options.profile ? new Profile(this.options.name) : null,
      };
    }
  }

  apply(compiler) {
    if (!this.options.enabled) {
      return;
    }

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
    if (!this.options.enabled) {
      return;
    }

    if (Object.values(sharedState).find((s) => s.isRunning)) {
      return;
    }

    if (typeof this.options.done === 'function') {
      const result = this.options.done(sharedState, this);
      if (result === false) {
        // Special signal to do nothing
        return;
      }
    }

    this.render();

    if (this.options.profile) {
      const stats = sharedState[this.options.name].profile.getStats();
      printStats(stats);
    }
  }

  updateProgress(percent, msg, details) {
    if (!this.options.enabled) {
      return;
    }

    const progress = Math.floor(percent * 100);
    const isRunning = progress && progress !== 100;

    Object.assign(sharedState[this.options.name], {
      progress,
      msg: isRunning ? msg || '' : 'done',
      details: details || [],
      request: parseRequst(details[2]),
      isRunning,
    });

    if (this.options.profile) {
      sharedState[this.options.name].profile.onRequest(
        sharedState[this.options.name].request
      );
    }

    this._render();
  }

  render() {
    const shouldClear = this.options.clear;
    let someRunning = false;

    const lines = [];

    _.sortBy(Object.keys(sharedState), (s) => s.name)
      .reverse()
      .forEach((name) => {
        const state = sharedState[name];

        if (state.isRunning) {
          someRunning = true;
        } else if (shouldClear) {
          // Skip done jobs
          return;
        }

        const lColor = colorize(state.color);
        const lIcon = lColor(BULLET);
        const lName = lColor(_.startCase(name));
        const lBar = renderBar(state.progress, state.color);
        const lMsg = _.startCase(state.msg);
        const lProgress = `(${state.progress || 0}%)`;
        const lDetail1 = chalk.grey((state.details && state.details[0]) || '');
        const lDetail2 = chalk.grey((state.details && state.details[1]) || '');
        const lRequest = state.request ? formatRequest(state.request) : '';

        lines.push(
          `${[lIcon, lName, lBar, lMsg, lProgress, lDetail1, lDetail2].join(
            ' '
          )}\n ${lRequest}`
        );
      });

    if (shouldClear && !someRunning) {
      this.logUpdate.clear();
      return;
    }

    const lLines = lines.join('\n\n');

    if (this.options.buildTitle) {
      const title = someRunning
        ? ` ${chalk.bgBlue.black(` ${this.options.buildTitle} `)}`
        : '';

      this.logUpdate(`\n${title}\n\n${lLines}`);
    } else {
      this.logUpdate(`\n${lLines}`);
    }
  }
}
