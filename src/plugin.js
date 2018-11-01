import webpack from 'webpack';
import env from 'std-env';

import { LogReporter, BarsReporter, ProfileReporter } from './reporters';
import Profile from './profile';
import { parseRequest } from './utils/request';

// Default plugin options
const DEFAULTS = {
  name: 'webpack',
  color: 'green',
  profile: false,
  stream: process.stdout,
  reporters: [],
  log: !!env.minimalCLI,
  bars: !env.minimalCLI,
};

// Mapping from name => { isRunning, details, progress, msg, request }
const globalStates = {};

export default class WebpackBarPlugin extends webpack.ProgressPlugin {
  constructor(options) {
    super();

    this.options = Object.assign({}, DEFAULTS, options);

    // this.handler will be called by webpack.ProgressPlugin
    this.handler = (percent, msg, ...details) =>
      this.updateProgress(percent, msg, details);

    // Keep our state in shared ojbect
    this.states = globalStates;
    if (!this.states[this.options.name]) {
      this.states[this.options.name] = {
        isRunning: false,
        color: this.options.color,
        profile: this.options.profile ? new Profile(this.options.name) : null,
        status: 'idle',
      };
    }
    this.state = this.states[this.options.name];

    // Reporters
    this.reporters = Array.from(this.options.reporters || []);

    if (this.options.log) {
      this.reporters.push(new LogReporter());
    }

    if (this.options.bars) {
      this.reporters.push(new BarsReporter());
    }

    if (this.options.profile) {
      this.reporters.push(new ProfileReporter());
    }
  }

  callReporters(fn, payload = {}) {
    for (const reporter of this.reporters) {
      if (typeof reporter[fn] === 'function') {
        reporter[fn](this, payload);
      }
    }
  }

  get hasRunning() {
    return Object.keys(this.states)
      .map((e) => this.states[e])
      .find((s) => s.isRunning);
  }

  apply(compiler) {
    super.apply(compiler);

    const hook = (stats) => {
      this.state.stats = stats;
      if (!this.hasRunning) {
        this.callReporters('done');
      }
    };

    if (compiler.hooks) {
      compiler.hooks.done.tap('WebpackBar', hook);
    } else {
      compiler.plugin('done', hook);
    }
  }

  updateProgress(percent, msg, details = []) {
    const progress = Math.floor(percent * 100);
    const isRunning = progress < 100;

    const wasRunning = this.state.isRunning;

    Object.assign(this.state, {
      details,
      progress,
      msg: isRunning && msg ? msg : '',
      request: parseRequest(details[2]),
      elapsed: process.hrtime(this.state.start),
      isRunning,
    });

    if (!wasRunning && isRunning) {
      // Started
      delete this.state.stats;
      this.state.start = process.hrtime();
      this.callReporters('compiling');
    } else if (wasRunning && !isRunning) {
      // Finished
      delete this.state.start;
      this.callReporters('compiled');
    }

    if (this.options.profile) {
      this.state.profile.onRequest(this.state.request);
    }

    this.callReporters('update');
  }
}
