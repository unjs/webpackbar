import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import WebpackBar from "webpackbar";

// let lastProgress;

const __dirname = dirname(fileURLToPath(import.meta.url));

const config = (name, color) => ({
  mode: "production",
  context: __dirname,
  devtool: false,
  target: "node",
  entry: `./${name}.mjs`,
  stats: true,
  output: {
    filename: "./output.cjs",
    path: join(__dirname, "/dist"),
  },
  module: {
    rules: [{ test: /\.js$/, use: join(__dirname, "test-loader.cjs") }],
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

export default [config("chalk", "cyan"), config("babel", "yellow")];
