const path = require('path');

const consola = require('consola');

const requireESM = require('esm')(module);

const Self = requireESM('../src/index').default;

consola.wrapConsole();

let lastProgress;

const config = (name, color) => ({
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
      color,
      name,
      reporter: {
        update({ state }) {
          if (lastProgress !== state.progress && state.progress % 25 === 0) {
            consola.log(state.progress + '%');
            lastProgress = state.progress;
          }
        },
      },
    }),
  ],
});

module.exports = [config('cyanBar', 'cyan'), config('blueBar', 'blue')];
