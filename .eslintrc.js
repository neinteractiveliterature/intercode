const schemaJson = require('./schema.json');
const path = require('path');

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
    'airbnb-typescript',
  ],

  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6,
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.json',
  },

  plugins: [
    // 'babel',
    'jest',
    'graphql',
    'react-hooks',
    '@typescript-eslint',
  ],

  rules: {
    // 'babel/camelcase': ['error', { properties: 'never', ignoreDestructuring: false }],
    'camelcase': 'off',
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
    'react/jsx-props-no-spreading': 'off',
    'jsx-a11y/label-has-for': 'off',
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        labelAttributes: ['inputId'],
        controlComponents: ['Select'],
      },
    ],
    "jsx-a11y/control-has-associated-label": [
      2,
      {
        ignoreElements: [
          'th',
        ],
      },
    ],
    // "no-restricted-imports": ['error', 'graphql-tag'],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    'import/named': 'off',
    'import/namespace': 'off',
    'import/default': 'off',
    'import/no-named-as-default-member': 'off',
  },

  settings: {
    'import/resolver': {
      "typescript": {
        "alwaysTryTypes": true // always try to resolve types under `<roo/>@types` directory even it doesn't contain any source code, like `@types/unist`
      },
    },
    'import/ignore': [
      'test/javascript/testUtils.js',
    ],
  },
};
