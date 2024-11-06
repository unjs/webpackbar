import rspack from "@rspack/core";
import type { WebpackBarOptions } from "./types";
import { WebpackBar } from "./plugin";

export type { Reporter, State, WebpackBarOptions } from "./types";

// https://rspack.dev/plugins/webpack/progress-plugin

export default class WebpackBarProgressPlugin extends rspack.ProgressPlugin {
  webpackbar: WebpackBar;

  constructor(options?: WebpackBarOptions) {
    super((percent, message, ...details) => {
      if (this.webpackbar) {
        this.webpackbar.updateProgress(percent, message, details);
      }
    });
    this.webpackbar = new WebpackBar(options);
  }

  apply(compiler) {
    super.apply(compiler);
    this.webpackbar.apply(compiler);
  }
}
