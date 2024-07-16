/* eslint-disable no-console */

import { getColor } from "consola/utils";
import { renderBar, colorize, ellipsisLeft } from "../utils/cli";
import { formatRequest } from "../utils/webpack";
import { BULLET, TICK, CROSS, CIRCLE_OPEN } from "../utils/consts";
import LogUpdate from "../utils/log-update";
import { Reporter } from "../types";

const logUpdate = new LogUpdate();

let lastRender = Date.now();

const grey = getColor("gray")

export default class FancyReporter implements Reporter {
  allDone() {
    logUpdate.done();
  }

  done(context) {
    this._renderStates(context.statesArray);

    if (context.hasErrors) {
      logUpdate.done();
    }
  }

  progress(context) {
    if (Date.now() - lastRender > 50) {
      this._renderStates(context.statesArray);
    }
  }

  _renderStates(statesArray) {
    lastRender = Date.now();

    const renderedStates = statesArray
      .map((c) => this._renderState(c))
      .join("\n\n");

    logUpdate.render("\n" + renderedStates + "\n");
  }

  _renderState(state) {
    const color = colorize(state.color);

    let line1;
    let line2;

    if (state.progress >= 0 && state.progress < 100) {
      // Running
      line1 = [
        color(BULLET),
        color(state.name),
        renderBar(state.progress, state.color),
        state.message,
        `(${state.progress || 0}%)`,
        grey(state.details[0] || ""),
        grey(state.details[1] || ""),
      ].join(" ");

      line2 = state.request
        ? " " +
        grey(
            ellipsisLeft(formatRequest(state.request), logUpdate.columns),
          )
        : "";
    } else {
      let icon = " ";

      if (state.hasErrors) {
        icon = CROSS;
      } else if (state.progress === 100) {
        icon = TICK;
      } else if (state.progress === -1) {
        icon = CIRCLE_OPEN;
      }

      line1 = color(`${icon} ${state.name}`);
      line2 = grey("  " + state.message);
    }

    return line1 + "\n" + line2;
  }
}
