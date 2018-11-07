[![npm][npm]][npm-url]
[![deps][deps]][deps-url]
[![test][test]][test-url]
[![test-windows][test-win]][test-win-url]
[![coverage][cover]][cover-url]

<div align="center">
  <!-- replace with accurate logo e.g from https://worldvectorlogo.com/ -->
  <img width="200" height="200" hspace="25"  src="./assets/logo.svg">
  <a href="https://webpack.js.org/">
    <img width="200" height="200" hspace="25" src="https://cdn.rawgit.com/webpack/media/e7485eb2/logo/icon-square-big.svg">
  </a>
  <p>Elegant ProgressBar and Profiler for Webpack</p>
</div>

✔ Display elegant progress bar while building or watch

✔ Support of multiple concurrent builds (useful for SSR)

✔ Pretty print filename and loaders

✔ Windows compatible

✔ Customizable

✔ Advanced build profiler

**!!! These docs are for upcoming Webpackbar 3. Please use [v2 branch](https://github.com/nuxt/webpackbar/tree/v2) for now. !!!**

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

Using npm:

```bash
npm install webpackbar -D
```

Using yarn:

```bash
yarn add webpackbar -D
```

Then add the reporter as a plugin to your webpack config.

**webpack.config.js**

```js
const webpack = require('webpack');
const WebpackBar = require('webpackbar');

module.exports = {
  context: path.resolve(__dirname),
  devtool: 'source-map',
  entry: './entry.js',
  output: {
    filename: './output.js',
    path: path.resolve(__dirname)
  },
  plugins: [
    new WebpackBar()
  ]
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

  -  Default: `true` when not in CI or testing mode.

Enable bars reporter.

### `basic`

  -  Default: `true` when running in minimal environments.

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
{
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
 beforeAllDone(context) {
 },
 afterAllDone(context) {
 },
}
```

`context` is the reference to the plugin. You can use `context.state` to access status.


**Schema of `context.state`:**

```js
{
  start,
  progress,
  message,
  details,
  request,
  hasErrors
}
```

<h2 align="center">Maintainers</h2>

<table>
  <tbody>
    <tr>
      <td align="center">
        <a href="https://github.com/pi0">
          <img width="150" height="150" src="https://github.com/pi0.png">
          </br>
          Pooya Parsa
        </a>
      </td>
    </tr>
  <tbody>
</table>

[npm]: https://img.shields.io/npm/v/webpackbar.svg?style=flat-square
[npm-url]: https://npmjs.com/package/webpackbar

[deps]: https://david-dm.org/nuxt/webpackbar.svg?style=flat-square
[deps-url]: https://david-dm.org/nuxt/webpackbar

[test]: https://img.shields.io/circleci/project/github/nuxt/webpackbar/master.svg?style=flat-square
[test-url]: https://circleci.com/gh/nuxt/webpackbar

[test-win]: https://img.shields.io/appveyor/ci/nuxt/webpackbar.svg?logo=appveyor&style=flat-square
[test-win-url]: https://ci.appveyor.com/project/nuxt/webpackbar

[cover]: https://codecov.io/gh/nuxt/webpackbar/branch/master/graph/badge.svg?style=flat-square
[cover-url]: https://codecov.io/gh/nuxt/webpackbar
