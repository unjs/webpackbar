const path = require("node:path");
const WebpackBar = require("webpackbar");

// let lastProgress;

const config = (name, color) => ({
  mode: "production",
  context: __dirname,
  devtool: false,
  target: "node",
  entry: "./index.mjs",
  stats: false,
  output: {
    filename: "./output.cjs",
    path: path.join(__dirname, "/dist"),
  },
  module: {
    rules: [{ test: /\.js$/, use: path.resolve(__dirname, "test-loader.cjs") }],
  },
  plugins: [
    new WebpackBar({
      color,
      name,
      reporters: ["fancy"],
      profile: process.argv.includes("--profile"),
      // reporter: {
      //   progress ({ state }) {
      //     if (lastProgress !== state.progress && state.progress % 5 === 0) {
      //       process.stderr.write(state.progress + '%\n')
      //       lastProgress = state.progress
      //     }
      //   }
      // }
    }),
  ],
});

module.exports = [config("OrangeBar", "orange"), config("GreenBar", "green")];
