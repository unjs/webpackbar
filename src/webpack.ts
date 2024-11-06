import webpack from "webpack";
import type { WebpackBarOptions } from "./types";
import { WebpackBar } from "./plugin";

export type { Reporter, State, WebpackBarOptions } from "./types";

// https://webpack.js.org/plugins/progress-plugin/

export default class WebpackBarProgressPlugin extends webpack.ProgressPlugin {
  webpackbar: WebpackBar;

  constructor(options?: WebpackBarOptions) {
    super({
      activeModules: true,
      handler: (percent, message, ...details) => {
        if (this.webpackbar) {
          this.webpackbar.updateProgress(percent, message, details);
        }
      },
    });
    this.webpackbar = new WebpackBar(options);
  }

  apply(compiler) {
    super.apply(compiler);
    this.webpackbar.apply(compiler);
  }
}
