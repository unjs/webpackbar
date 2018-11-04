/* eslint-disable no-console */
import chalk from 'chalk';
import consola from 'consola';

import { renderBar, colorize, ellipsisLeft } from '../utils/cli';
import { formatRequest } from '../utils/request';
import { BULLET, TICK, CROSS, CIRCLE_OPEN } from '../utils/consts';
import LogUpdate from '../utils/log-update';

const logUpdate = new LogUpdate();

let lastRender = Date.now();

export default class FancyReporter {
  beforeRun() {
    consola.pause();
  }

  allDone() {
    logUpdate.done();
    consola.resume();
  }

  done(context) {
    this._renderStates(context.states);
  }

  progress(context) {
    if (Date.now() - lastRender > 50) {
      this._renderStates(context.states);
    }
  }

  _renderStates(states) {
    lastRender = Date.now();

    const renderedStates = Object.keys(states)
      .sort((n1, n2) => n1.localeCompare(n2))
      .map((name) => ({ name, state: states[name] }))
      .map((c) => this._renderState(c))
      .join('\n\n');

    logUpdate.render('\n' + renderedStates + '\n');
  }

  _renderState({ name, state }) {
    const color = colorize(state.color);

    let line1;
    let line2;

    if (state.progress >= 0 && state.progress < 100) {
      // Running
      line1 = [
        color(BULLET),
        color(name),
        renderBar(state.progress, state.color),
        state.message,
        `(${state.progress || 0}%)`,
        chalk.grey(state.details[0] || ''),
        chalk.grey(state.details[1] || ''),
      ].join(' ');

      line2 = state.request
        ? ' ' +
          chalk.grey(
            ellipsisLeft(formatRequest(state.request), logUpdate.columns)
          )
        : '';
    } else {
      let icon = ' ';

      if (state.hasErrors) {
        icon = CROSS;
      } else if (state.progress === 100) {
        icon = TICK;
      } else if (state.progress === -1) {
        icon = CIRCLE_OPEN;
      }

      line1 = color(`${icon} ${name}`);
      line2 = chalk.grey('  ' + state.message);
    }

    return line1 + '\n' + line2;
  }
}
