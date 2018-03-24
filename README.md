[![npm][npm]][npm-url]
[![deps][deps]][deps-url]
[![test][test]][test-url]
[![coverage][cover]][cover-url]

<div align="center">
  <!-- replace with accurate logo e.g from https://worldvectorlogo.com/ -->
  <img width="200" height="200" src="https://cdn.worldvectorlogo.com/logos/javascript.svg">
  <a href="https://webpack.js.org/">
    <img width="200" height="200" vspace="" hspace="25" src="https://cdn.rawgit.com/webpack/media/e7485eb2/logo/icon-square-big.svg">
  </a>
  <h1>WebpackBar</h1>
  <p>Elegant Progressbar for Webpack</p>
</div>

<h2 align="center">Features</h2>

<img align="center" src="./assets/screen1.png" width="70%">

✔ Display elegant progress bar while building or watch
✔ Support of multiply concurrent builds (useful for SSR)
✔ Pretty print filename and loaders
✔ Windows compatible
✔ Customizable

<h2 align="center">Getting Started</h2>

To begin, you'll need to install `webpackbar`:

Using npm:

```bash
npm install webpackbar
```

Using yarn:

```bash
yarn add webpackbar
```

Then add the reporter as a plugin to your webpack config. For example:

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
    new WebpackBar(/* options */)
  ]
};
```

<h2 align="center">Options</h2>

- `name`: Display name
- `color`: Display color

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

[npm]: https://img.shields.io/npm/v/webpackbar.svg
[npm-url]: https://npmjs.com/package/webpackbar

[deps]: https://david-dm.org/nuxt/webpackbar.svg
[deps-url]: https://david-dm.org/nuxt/webpackbar

[test]: http://img.shields.io/travis/nuxt/webpackbar.svg
[test-url]: https://travis-ci.org/nuxt/webpackbar

[cover]: https://codecov.io/gh/nuxt/webpackbar/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/nuxt/webpackbar
