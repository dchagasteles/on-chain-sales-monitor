module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  'comma-dangle': ['error', 'never'],
  extends: 'airbnb-base',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {},
};
