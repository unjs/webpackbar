import unjs from "eslint-config-unjs";

// https://github.com/unjs/eslint-config
export default unjs({
  ignores: ["/node_modules", "**/dist", "test/**/dist"],
  rules: {
    "unicorn/prevent-abbreviations": 0,
    "unicorn/no-null": 0,
    "@typescript-eslint/no-require-imports": 0,
  },
});
