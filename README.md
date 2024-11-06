<!-- automd:badges packagephobia -->

[![npm version](https://img.shields.io/npm/v/webpackbar)](https://npmjs.com/package/webpackbar)
[![npm downloads](https://img.shields.io/npm/dm/webpackbar)](https://npm.chart.dev/webpackbar)

<!-- /automd -->

<div align="center">
  <!-- replace with accurate logo e.g from https://worldvectorlogo.com/ -->
  <img width="200" height="200" hspace="25"  src="./assets/logo.svg">
  <a href="https://webpack.js.org/">
    <img width="200" height="200" hspace="25" src="https://cdn.rawgit.com/webpack/media/e7485eb2/logo/icon-square-big.svg">
  </a>
  <p>Elegant ProgressBar and Profiler for [Webpack](https://webpack.js.org/) and [Rspack](https://rspack.dev/). </p>
</div>

✔ Display elegant progress bar while building or watch

✔ Support of multiple concurrent builds (useful for SSR)

✔ Pretty print filename and loaders

✔ Windows compatible

✔ Fully customizable using reporters

✔ Advanced build profiler

<div align="center">
<br>
<img src="./assets/screen1.png" width="600px">
<p>Multi progress bars</p>
<br>
</div>

<div align="center">
<br>
<img src="./assets/screen2.png" width="600px">
<p>Build Profiler</p>
<br>
</div>

<h2 align="center">Getting Started</h2>

To begin, you'll need to install `webpackbar`:

<!-- automd:pm-i -->

```sh
# ✨ Auto-detect
npx nypm install webpackbar

# npm
npm install webpackbar

# yarn
yarn add webpackbar

# pnpm
pnpm install webpackbar

# bun
bun install webpackbar

# deno
deno install webpackbar
```

<!-- /automd -->

Then add the reporter as a plugin to your webpack config (make sure `webpack` peer dependency is installed).

**`webpack.config.mjs`**

```js
import WebpackBar from "webpackbar";

export default {
  entry: "./src/entry.js",
  plugins: [
    new WebpackBar({
      /* options */
    }),
  ],
};
```

For using with [Rspack](https://rspack.dev/), you can use `webpackbar/rspack` (make sure `@rspack/core` peer dependency is installed).

**`rspack.config.mjs`**:

```js
import WebpackBar from "webpackbar/rspack";

export default {
  entry: "./src/entry.js",
  plugins: [
    new WebpackBar({
      /* options */
    }),
  ],
};
```

<h2 align="center">Options</h2>

### `name`

- Default: `webpack`

Name.

### `color`

- Default: `green`

Primary color (can be HEX like `#xxyyzz` or a web color like `green`).

### `profile`

- Default: `false`

Enable profiler.

### `fancy`

- Default: `true` when not in CI or testing mode.

Enable bars reporter.

### `basic`

- Default: `true` when running in minimal environments.

Enable a simple log reporter (only start and end).

### `reporter`

Register a custom reporter.

### `reporters`

- Default: `[]`

Register an Array of your custom reporters. (Same as `reporter` but array)

<h2 align="center">Custom Reporters</h2>

Webpackbar comes with a fancy progress-bar out of the box.
But you may want to show progress somewhere else or provide your own.

For this purpose, you can provide one or more extra reporters using `reporter` and `reporters` options.

**NOTE:** If you plan to provide your own reporter, don't forget to setting `fancy` and `basic` options to false to prevent conflicts.

A reporter should be instance of a class or plain object and functions for special hooks. It is not necessary to implement all functions, webpackbar only calls those that exists.

**Simple logger:**

```js
const logger = {
  start(context) {
    // Called when (re)compile is started
  },
  change(context) {
    // Called when a file changed on watch mode
  },
  update(context) {
    // Called after each progress update
  },
  done(context) {
    // Called when compile finished
  },
  progress(context) {
    // Called when build progress updated
  },
  allDone(context) {
    // Called when _all_ compiles finished
  },
  beforeAllDone(context) {},
  afterAllDone(context) {},
};
```

`context` is the reference to the plugin. You can use `context.state` to access status.

**Schema of `context.state`:**

```js
{
  start, progress, message, details, request, hasErrors;
}
```

<h2 align="center">License</h2>

[MIT](./LICENSE)

<!-- Refs -->

[standard-js-src]: https://flat.badgen.net/badge/code%20style/standard/green
[standard-js-href]: https://standardjs.com
[npm-version-src]: https://flat.badgen.net/npm/v/webpackbar/latest
[npm-version-href]: https://npmjs.com/package/webpackbar
[npm-downloads-src]: https://flat.badgen.net/npm/dm/webpackbar
[npm-downloads-href]: https://npmjs.com/package/webpackbar
[package-phobia-src]: https://flat.badgen.net/packagephobia/install/webpackbar
[package-phobia-href]: https://packagephobia.now.sh/result?p=webpackbar
[checks-src]: https://flat.badgen.net/github/checks/nuxt-contrib/webpackbar/master
[checks-href]: https://github.com/nuxt-contrib/webpackbar/actions
