const schemaJson = require('./schema.json');

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
    'graphql/template-strings': [
      'error',
      { env: 'apollo', schemaJson },
      { env: 'literal', schemaJson },
    ],
    'graphql/required-fields': [
      'error',
      { env: 'apollo', schemaJson, requiredFields: ['id'] },
      { env: 'literal', schemaJson, requiredFields: ['id'] },
    ],
    'graphql/named-operations': [
      'warn',
      { env: 'apollo', schemaJson },
      { env: 'literal', schemaJson },
    ],
    'no-underscore-dangle': ['error', { allow: ['__typename'] } ],
    'react/destructuring-assignment': 'off',
  }
};
