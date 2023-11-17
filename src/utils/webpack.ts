import path from "node:path";

import { nodeModules, NEXT } from "./consts";

import { removeAfter, removeBefore, hasValue, firstMatch } from ".";

export const parseRequest = (requestStr) => {
  const parts = (requestStr || "").split("!");

  const file = path.relative(
    process.cwd(),
    removeAfter("?", removeBefore(nodeModules, parts.pop())),
  );

  const loaders = parts
    .map((part) => firstMatch(/[\d@a-z-]+-loader/, part))
    .filter((v) => hasValue(v));

  return {
    file: hasValue(file) ? file : null,
    loaders,
  };
};

export const formatRequest = (request) => {
  const loaders = request.loaders.join(NEXT);

  if (loaders.length === 0) {
    return request.file || "";
  }

  return `${loaders}${NEXT}${request.file}`;
};

// Hook helper for webpack 3 + 4 support
export function hook(compiler, hookName, fn) {
  if (compiler.hooks) {
    compiler.hooks[hookName].tap("WebpackBar:" + hookName, fn);
  } else {
    compiler.plugin(hookName, fn);
  }
}
