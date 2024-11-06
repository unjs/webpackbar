import assert from "node:assert";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import Rspack from "@rspack/core";
import { it, describe } from "vitest";
import WebpackBar from "../src/rspack";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("webpackbar", () => {
  it("compile", async () => {
    let _doneCtr = 0;
    const done = () => {
      _doneCtr++;
    };

    const webpackbar = new WebpackBar({
      reporter: { done },
    });

    const compiler = Rspack({
      mode: "production",
      context: __dirname,
      devtool: "source-map",
      entry: "./fixture/index.cjs",
      output: {
        filename: "output.js",
        path: resolve(__dirname, "dist"),
      },
      plugins: [webpackbar],
    });

    const run = promisify(compiler.run);
    const stats = await run.call(compiler);

    assert.equal(stats.hasErrors(), false);
    assert.equal(stats.hasWarnings(), false);
    assert.equal(_doneCtr, 1);
  });
});
