module.exports = {
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
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6,
    ecmaFeatures: {
      jsx: true,
    },
  },

  plugins: [
    'jest',
    'graphql',
  ],

  rules: {
    'jest/no-disabled-tests': "warn",
    'jest/no-focused-tests': "error",
    'jest/no-identical-title': "error",
    'jest/valid-expect': "error",
    'graphql/template-strings': ['error', {
      env: 'apollo',
      schemaJsonFilepath: './schema.json',
    }],
  }
};
