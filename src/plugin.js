import webpack from 'webpack';
import env from 'std-env';
import prettyTime from 'pretty-time';

import { SimpleReporter, FancyReporter, ProfileReporter } from './reporters';
import Profile from './profile';
import { startCase } from './utils';
import { parseRequest } from './utils/request';

// Use bars when possible as default
const isMinimal = env.ci || env.test || !env.tty;

// Default plugin options
const DEFAULTS = {
  name: 'webpack',
  color: 'green',
  profile: false,
  stream: process.stdout,
  reporters: [],
  reporter: null,
  simple: isMinimal,
  fancy: !isMinimal,
};

// Default state object
const DEFAULT_STATE = {
  start: null,
  progress: -1,
  message: '',
  details: [],
  request: null,
  stats: null,
  hasErrors: false,
};

// Mapping from name => State
const globalStates = {};

export default class WebpackBarPlugin extends webpack.ProgressPlugin {
  constructor(options) {
    super();

    this.options = Object.assign({}, DEFAULTS, options);
    this.name = startCase(options.name);

    // this.handler will be called by webpack.ProgressPlugin
    this.handler = (percent, message, ...details) =>
      this.updateProgress(percent, message, details);

    // Keep our state in shared ojbect
    this.states = globalStates;
    if (!this.states[this.name]) {
      this.states[this.name] = {
        ...DEFAULT_STATE,
        color: this.options.color,
        profile: this.options.profile ? new Profile(this.name) : null,
      };
    }
    this.state = this.states[this.name];

    // Reporters
    this.reporters = Array.from(this.options.reporters || []);

    if (this.options.reporter) {
      this.reporters.unshift(this.options.reporter);
    }

    if (this.options.fancy) {
      this.reporters.unshift(new FancyReporter());
    }

    if (this.options.simple) {
      this.reporters.unshift(new SimpleReporter());
    }

    if (this.options.profile) {
      this.reporters.unshift(new ProfileReporter());
    }
  }

  callReporters(fn, payload = {}) {
    for (const reporter of this.reporters) {
      if (typeof reporter[fn] === 'function') {
        try {
          reporter[fn](this, payload);
        } catch (e) {
          process.stdout.write(e.stack + '\n');
        }
      }
    }
  }

  get hasRunning() {
    return Object.values(this.states).some((state) => state.progress !== 100);
  }

  get hasErrors() {
    return Object.values(this.states).some((state) => state.hasErrors);
  }

  apply(compiler) {
    super.apply(compiler);

    // Hook helper for webpack 3 + 4 support
    function hook(hookName, fn) {
      if (compiler.hooks) {
        compiler.hooks[hookName].tap('WebpackBar:' + hookName, fn);
      } else {
        compiler.plugin(hookName, fn);
      }
    }

    // Adds a hook right before compiler.run() is executed
    hook('beforeCompile', () => {
      Object.assign(this.state, {
        ...DEFAULT_STATE,
        start: process.hrtime(),
        _allDoneCalled: false,
      });

      this.callReporters('beforeRun');
    });

    // Compilation has completed
    hook('done', (stats) => {
      const time = prettyTime(process.hrtime(this.state.start), 2);
      const hasErrors = stats.hasErrors();
      const status = hasErrors ? 'with some errors' : 'succesfuly';

      Object.assign(this.state, {
        ...DEFAULT_STATE,
        stats,
        progress: 100,
        message: `Compiled ${status} in ${time}`,
        hasErrors,
      });

      this.callReporters('progress');
      this.callReporters('done');

      if (!this.hasRunning) {
        this.callReporters('beforeAllDone');
        this.callReporters('allDone');
        this.callReporters('afterAllDone');
      }
    });
  }

  updateProgress(percent = 0, message = '', details = []) {
    const progress = Math.floor(percent * 100);

    Object.assign(this.state, {
      progress,
      message: message || '',
      details,
      request: parseRequest(details[2]),
    });

    if (this.options.profile) {
      this.state.profile.onRequest(this.state.request);
    }

    this.callReporters('progress');
  }
}
