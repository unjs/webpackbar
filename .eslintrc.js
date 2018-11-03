module.exports = {
  root: true,
  plugins: ['prettier'],
  extends: ['@webpack-contrib/eslint-config-webpack'],
  rules: {
    'prettier/prettier': [
      'error',
      { singleQuote: true, trailingComma: 'es5', arrowParens: 'always' },
    ],
    'class-methods-use-this': 0,
    'prefer-template': 0,
    'no-underscore-dangle': 0,
    'arrow-body-style': 0
  },
};
