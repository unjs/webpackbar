import webpack from 'webpack';
import chalk from 'chalk';
import _ from 'lodash';
import logUpdate from 'log-update';
import env from 'std-env';
import prettyTime from 'pretty-time';
import Profile from './profile';
import {
  BULLET,
  TICK,
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
  profile: false,
  compiledIn: true,
  done: null,
  minimal: env.minimalCLI,
  stream: process.stderr,
};

const hasRunning = () => Object.values(sharedState).find((s) => s.isRunning);

export default class WebpackBarPlugin extends webpack.ProgressPlugin {
  constructor(options) {
    super();

    this.options = Object.assign({}, defaults, options);

    // this.handler will be called by webpack.ProgressPlugin
    this.handler = (percent, msg, ...details) =>
      this.updateProgress(percent, msg, details);

    this._render = _.throttle(this.render, 25);

    this.logUpdate = this.options.logUpdate || logUpdate;

    if (!this.state) {
      sharedState[this.options.name] = {
        isRunning: false,
        color: this.options.color,
        profile: this.options.profile ? new Profile(this.options.name) : null,
      };
    }
  }

  get state() {
    return sharedState[this.options.name];
  }

  done() {
    if (this.options.profile) {
      const stats = this.state.profile.getStats();
      printStats(stats);
    }

    if (typeof this.options.done === 'function') {
      this.options.done(sharedState, this);
    }
  }

  updateProgress(percent, msg, details) {
    const progress = Math.floor(percent * 100);
    const isRunning = progress < 100;

    const wasRunning = this.state.isRunning;

    Object.assign(this.state, {
      progress,
      msg: isRunning && msg ? msg : '',
      details: details || [],
      request: parseRequst(details[2]),
      isRunning,
    });

    if (!wasRunning && isRunning) {
      // Started
      this.state.start = process.hrtime();
      if (this.options.minimal) {
        this.stream.write(`Compiling ${this.options.name}\n`);
      }
      delete this.state.time;
    } else if (wasRunning && !isRunning) {
      // Finished
      const time = process.hrtime(this.state.start);
      if (this.options.minimal) {
        this.stream.write(
          `Compiled ${this.options.name} in ${prettyTime(this.state.time)}\n`
        );
      } else {
        this.logUpdate.clear();
        if (this.options.compiledIn) {
          process.stdout.write(
            `${[
              TICK,
              this.options.name,
              'compiled in',
              prettyTime(time, 'ms'),
            ].join(' ')}\n`
          );
        }
      }
      delete this.state.start;
    }

    if (this.options.profile) {
      this.state.profile.onRequest(this.state.request);
    }

    if (hasRunning()) {
      this._render();
    } else {
      this.logUpdate.clear();
      this.done();
    }
  }

  render() {
    if (this.options.minimal) {
      return;
    }

    const stateLines = _.sortBy(Object.keys(sharedState), (n) => n)
      .filter((s) => sharedState[s].isRunning || sharedState[s].start)
      .map((name) => {
        const state = sharedState[name];
        const color = colorize(state.color);

        if (!state.isRunning) {
          return `${[chalk.grey(BULLET), name].join(' ')}`;
        }

        return `${[
          color(BULLET),
          color(name),
          renderBar(state.progress, state.color),
          state.msg,
          `(${state.progress || 0}%)`,
          chalk.grey((state.details && state.details[0]) || ''),
          chalk.grey((state.details && state.details[1]) || ''),
        ].join(' ')}\n ${state.request ? formatRequest(state.request) : ''}\n`;
      })
      .filter(Boolean);

    if (stateLines.length) {
      const title = chalk.underline.blue('Compiling');
      const log = `\n${title}\n\n${stateLines.join('\n')}`;
      this.logUpdate(log);
    }
  }
}
