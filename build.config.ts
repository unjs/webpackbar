import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  declaration: true,
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
  },
  entries: ["src/index"],
  externals: ["webpack"],
});
