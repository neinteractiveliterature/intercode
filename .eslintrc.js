module.exports = {
  ecmaFeatures: {
    modules: true,
    jsx: true,
  },

  env: {
    amd: true,
    browser: true,
    es6: true,
    jquery: false,
    node: true,
    "jest/globals": true
  },

  extends: [
    "airbnb",
  ],

  parser: "babel-eslint",

  plugins: [
    'jest',
  ],

  rules: {
    'jest/no-disabled-tests': "warn",
    'jest/no-focused-tests': "error",
    'jest/no-identical-title': "error",
    'jest/valid-expect': "error"
  }
};
