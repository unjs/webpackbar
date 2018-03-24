import webpack from 'webpack';
import chalk from 'chalk';
import _ from 'lodash';
import logUpdate from 'log-update';
import figures from 'figures';
import { formatModule, str, renderBar } from './utils';

const sharedState = {};

const B1 = figures('●');

export default class WebpackBarPlugin extends webpack.ProgressPlugin {
  constructor(options = { name: 'webpack', color: 'green' }) {
    super(options);
    this.options = options;

    this.handler = (percent, msg, ...details) => this.updateProgress(percent, msg, details);
    this.handler = _.throttle(this.handler, 25, { leading: true, trailing: true });

    this.logUpdate = options.logUpdate || logUpdate;
  }

  apply(compiler) {
    super.apply(compiler);

    compiler.hooks.done.tap('progress', () => logUpdate.clear());
  }

  updateProgress(percent, msg, details) {
    const progress = Math.floor(percent * 100);

    if (!sharedState[this.options.name]) {
      sharedState[this.options.name] = {
        color: this.options.color,
      };
    }

    const thisState = sharedState[this.options.name];
    thisState.progress = progress;
    thisState.msg = msg;
    thisState.details = details || [];
    thisState.isRunning = (progress && progress !== 100) && (msg && msg.length);

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

      const lColor = chalk.keyword(state.color);
      const lIcon = lColor(B1);
      const lName = lColor(_.startCase(name));
      const lBar = renderBar(state.progress, state.color);
      const lMsg = _.startCase(state.msg);
      const lProgress = `(${state.progress}%)`;
      const lDetail1 = chalk.grey(str(state.details[0]));
      const lDetail2 = chalk.grey(str(state.details[1]));
      const lModule = state.details[2] ? chalk.grey(`  ${formatModule(state.details[2])}`) : '';

      lines.push(`${[lIcon, lName, lBar, lMsg, lProgress, lDetail1, lDetail2].join(' ')}\n${lModule}`);
    });

    if (!isRunning) {
      this.logUpdate.clear();
    } else {
      const title = chalk.bgBlue.black('BUILDING');
      this.logUpdate(`\n${title}\n\n${lines.join('\n\n')}`);
    }
  }
}
