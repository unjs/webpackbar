const path = require('path');
const requireESM = require('esm')(module);

const Self = requireESM('../src/index').default;

module.exports = {
  mode: 'production',
  context: __dirname,
  devtool: false,
  target: 'node',
  entry: './index.js',
  stats: false,
  output: {
    filename: './output.js',
    path: path.join(__dirname, '/dist'),
  },
  module: {
    rules: [{ test: /\.js$/, use: path.resolve(__dirname, 'test-loader.js') }],
  },
  plugins: [
    new Self({
      color: 'yellow',
      showCursor: true,
      profile: true,
      clear: true,
      name: 'webpack-bar',
    }),
  ],
};
