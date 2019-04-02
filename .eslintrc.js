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
    'react-hooks',
  ],

  rules: {
    'jest/no-disabled-tests': "warn",
    'jest/no-focused-tests': "error",
    'jest/no-identical-title': "error",
    'jest/valid-expect': "error",
    'graphql/template-strings': [
      'error',
      { env: 'apollo', schemaJson },
    ],
    'graphql/required-fields': [
      'error',
      { env: 'apollo', schemaJson, requiredFields: ['id'] },
    ],
    'graphql/named-operations': [
      'warn',
      { env: 'apollo', schemaJson },
    ],
    'graphql/no-deprecated-fields': [
      'warn',
      { env: 'apollo', schemaJson },
    ],
    'no-underscore-dangle': ['error', { allow: ['__typename'] } ],
    'react/destructuring-assignment': 'off',
    'jsx-a11y/label-has-for': 'off',
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        labelAttributes: ['inputId'],
        controlComponents: ['Select'],
      },
    ],
    "no-restricted-imports": ['error', 'graphql-tag'],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },

  settings: {
    'import/resolver': {
      'webpack': {
        config: './config/webpack/environment.js',
      },
    },
  },
};
