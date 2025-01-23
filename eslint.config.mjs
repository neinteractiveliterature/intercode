// @ts-check

import { includeIgnoreFile } from '@eslint/compat';
import vitest from '@vitest/eslint-plugin';
import jsxA11Y from 'eslint-plugin-jsx-a11y';
import i18Next from 'eslint-plugin-i18next';
import reactPlugin from 'eslint-plugin-react';
import graphqlEslint from '@graphql-eslint/eslint-plugin';
import typescriptEslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});
const gitignorePath = path.resolve(__dirname, '.gitignore');

export default typescriptEslint.config(
  includeIgnoreFile(gitignorePath),
  {
    ignores: [
      '**/*{.,-}min.js',
      'coverage/*',
      'config/*',
      'node_modules/*',
      'public/*',
      'jest.config.js',
      'doc-site',
      'cms_content_sets',
      '.yarn',
      '**/*.generated.ts',
    ],
  },
  js.configs.recommended,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  ...compat.extends('plugin:react-hooks/recommended'),
  typescriptEslint.configs.recommended,
  {
    files: ['app/javascript/**/*.tsx'],
    .../** @type {import('typescript-eslint').InfiniteDepthConfigWithExtends} */ (i18Next.configs['flat/recommended']),
    rules: {
      'i18next/no-literal-string': [
        'warn',
        {
          mode: 'all',
          callees: { include: ['usePageTitle'] },
          'object-properties': {
            exclude: ['id', 'accessor', 'defaultVisibleColumns', '__typename', 'payment_options', 'path'],
          },
          'jsx-attributes': {
            include: ['title', 'aria-label', 'caption', 'placeholder', 'label', 'helpText', 'stringError', 'alt'],
          },
          'should-validate-template': true,
        },
      ],
    },
  },
  {
    plugins: {
      vitest,
      'jsx-a11y': jsxA11Y,
    },

    languageOptions: {
      globals: {
        ...globals.amd,
        ...globals.browser,
        ...Object.fromEntries(Object.entries(globals.jquery).map(([key]) => [key, 'off'])),
        ...globals.node,
        ...vitest.environments.env.globals,
      },

      ecmaVersion: 6,
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },

        extraFileExtensions: ['.graphql'],
      },
    },

    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },

      'import/ignore': ['test/javascript/testUtils.js'],

      react: {
        version: 'detect',
      },
    },

    rules: {
      ...vitest.configs.recommended.rules,

      camelcase: 'off',
      'vitest/no-disabled-tests': 'warn',
      'vitest/no-focused-tests': 'error',
      'vitest/no-identical-title': 'error',
      'vitest/valid-expect': 'error',

      'no-underscore-dangle': [
        'error',
        {
          allow: ['__typename'],
        },
      ],

      'react/destructuring-assignment': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'jsx-a11y/no-onchange': 'off',
      'jsx-a11y/label-has-for': 'off',

      'jsx-a11y/label-has-associated-control': [
        'error',
        {
          labelAttributes: ['inputId'],
          controlComponents: ['Select'],
        },
      ],

      'jsx-a11y/control-has-associated-label': [
        2,
        {
          ignoreElements: ['tr', 'th', 'td'],

          required: {
            some: ['nesting', 'id'],
          },

          allowChildren: false,
        },
      ],

      'no-restricted-imports': ['error', 'graphql-tag'],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'import/named': 'off',
      'import/namespace': 'off',
      'import/default': 'off',
      'import/no-named-as-default-member': 'off',

      'prefer-arrow-callback': [
        'error',
        {
          allowNamedFunctions: true,
        },
      ],

      '@typescript-eslint/no-empty-function': 'off',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],

    rules: {
      'react/prop-types': 'off',
      'react/require-default-props': 'off',
      '@typescript-eslint/no-extra-non-null-assertion': ['error'],

      'no-restricted-imports': [
        'error',
        {
          paths: [
            'graphql-tag',
            'prop-types',
            {
              name: '@apollo/client',
              importNames: ['gql'],
              message:
                'Please define GraphQL operations in .graphql files and use graphql-code-generator to generate hooks',
            },
            {
              name: 'i18next',
              importNames: ['t'],
              message: 'Please import useTranslation from react-i18next instead',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['app/**/*.graphql', 'test/**/*.graphql'],
    plugins: { '@graphql-eslint': graphqlEslint },

    languageOptions: {
      parser: graphqlEslint.parser,
      ecmaVersion: 5,
      sourceType: 'script',
    },

    rules: {
      ...graphqlEslint.configs['flat/operations-recommended'].rules,
      '@graphql-eslint/naming-convention': 'off',
      '@graphql-eslint/known-fragment-names': 'off',

      '@graphql-eslint/selection-set-depth': [
        'error',
        {
          maxDepth: 8,
          ignore: ['pricing_structure', 'registration_policy', 'user_con_profile_form'],
        },
      ],
    },
  },
  {
    files: ['schema.graphql'],
    plugins: { '@graphql-eslint': graphqlEslint },

    languageOptions: {
      parser: graphqlEslint.parser,
      ecmaVersion: 5,
      sourceType: 'script',
    },

    rules: {
      ...graphqlEslint.configs['flat/schema-recommended'].rules,
      '@graphql-eslint/no-typename-prefix': 'off',
      '@graphql-eslint/naming-convention': 'off',
      '@graphql-eslint/require-description': 'off',

      '@graphql-eslint/strict-id-in-types': [
        'error',
        {
          acceptedIdNames: ['id', 'uid'],

          exceptions: {
            suffixes: ['Payload', 'Pagination', 'Result'],

            types: [
              'Ability',
              'ChoiceCount',
              'ContactEmail',
              'ConventionReports',
              'EventProvidedTicketList',
              'EventWithChoiceCounts',
              'FormResponseChange',
              'GroupedSignupCount',
              'LiquidAssign',
              'MailingLists',
              'Money',
              'Mutation',
              'OrderQuantityByStatus',
              'PayWhatYouWantValue',
              'PricingStructure',
              'Query',
              'RegistrationPolicy',
              'RegistrationPolicyBucket',
              'SalesCountByProductAndPaymentAmount',
              'ScheduledMoneyValue',
              'ScheduledValue',
              'SearchResultEntry',
              'SignupCountByState',
              'SimulatedSkipReason',
              'TicketCountByTypeAndPaymentAmount',
              'TimespanWithMoneyValue',
              'TimespanWithValue',
            ],
          },
        },
      ],
    },
  },
  eslintConfigPrettier,
);
