import { ProgressPlugin } from 'webpack';
import env from 'std-env';
import prettyTime from 'pretty-time';

import { startCase } from './utils';

import * as reporters from './reporters'; // eslint-disable-line import/no-namespace
import { parseRequest } from './utils/request';

// Use bars when possible as default
const isMinimal = env.ci || env.test || !env.tty;

// Default plugin options
const DEFAULTS = {
  name: 'webpack',
  color: 'green',
  reporters: isMinimal ? ['basic'] : ['fancy'],
  reporter: null,
};

// Default state object
const DEFAULT_STATE = {
  start: null,
  progress: -1,
  message: '',
  details: [],
  request: null,
  hasErrors: false,
};

// Mapping from name => State
const globalStates = {};

export default class WebpackBarPlugin extends ProgressPlugin {
  constructor(options) {
    super();

    this.options = Object.assign({}, DEFAULTS, options);

    // Assign a better handler to base ProgressPlugin
    this.handler = (percent, message, ...details) => {
      this.updateProgress(percent, message, details);
    };

    // Keep our state in shared ojbect
    if (!this.states[this.options.name]) {
      this.states[this.options.name] = {
        ...DEFAULT_STATE,
        color: this.options.color,
        name: startCase(this.options.name),
      };
    }

    // Reporters
    this.reporters = Array.from(this.options.reporters || []);
    if (this.options.reporter) {
      this.reporters.push(this.options.reporter);
    }

    // Resolve reposters
    this.reporters = this.reporters
      .filter(Boolean)
      .map((_reporter) => {
        if (this.options[_reporter] === false) {
          return false;
        }

        let reporter = _reporter;
        let reporterOptions = this.options[reporter] || {};

        if (Array.isArray(_reporter)) {
        reporter = _reporter[0]; // eslint-disable-line
          if (_reporter[1] === false) {
            return false;
          }
          if (_reporter[1]) {
          reporterOptions = _reporter[1]; // eslint-disable-line
          }
        }

        if (typeof reporter === 'string') {
          if (reporters[reporter]) {
            reporter = reporters[reporter];
          } else {
          reporter = require(reporter); // eslint-disable-line
          }
        }

        if (typeof reporter === 'function') {
          if (typeof reporter.constructor === 'function') {
          reporter = new reporter(reporterOptions); // eslint-disable-line
          } else {
            reporter = reporter(reporterOptions);
          }
        }

        return reporter;
      })
      .filter(Boolean);
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

  get statesArray() {
    return Object.values(this.states).sort((s1, s2) =>
      s1.name.localeCompare(s2.name)
    );
  }

  get states() {
    return globalStates;
  }

  get state() {
    return globalStates[this.options.name];
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

    // Hook into the compiler before a new compilation is created.
    hook('compile', () => {
      Object.assign(this.state, {
        ...DEFAULT_STATE,
        start: process.hrtime(),
      });

      this.callReporters('start');
    });

    // Compilation has completed
    hook('done', (stats) => {
      const time = prettyTime(process.hrtime(this.state.start), 2);
      const hasErrors = stats.hasErrors();
      const status = hasErrors ? 'with some errors' : 'succesfuly';

      Object.assign(this.state, {
        ...DEFAULT_STATE,
        progress: 100,
        message: `Compiled ${status} in ${time}`,
        hasErrors,
      });

      this.callReporters('progress');

      this.callReporters('done', { stats });

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

    this.callReporters('progress');
  }
}
