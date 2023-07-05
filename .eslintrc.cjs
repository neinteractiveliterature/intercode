module.exports = {
  env: {
    amd: true,
    browser: true,
    es6: true,
    jquery: false,
    node: true,
    'jest/globals': true,
  },

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:jest/recommended',
    'plugin:jsx-a11y/recommended',
    'prettier',
  ],

  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6,
    ecmaFeatures: {
      jsx: true,
    },
    // This makes linting orders of magnitude slower :(
    // project: './tsconfig.json',
    extraFileExtensions: ['.graphql'],
  },

  plugins: [
    // 'babel',
    'jest',
    'jsx-a11y',
    'react-hooks',
    '@graphql-eslint',
    '@typescript-eslint',
  ],

  rules: {
    // 'babel/camelcase': ['error', { properties: 'never', ignoreDestructuring: false }],
    camelcase: 'off',
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/valid-expect': 'error',
    'no-underscore-dangle': ['error', { allow: ['__typename'] }],
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
        ignoreElements: ['th'],
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
    'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
  },

  overrides: [
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
                name: '@apollo/client',
                importNames: ['useQuery', 'useMutation'],
                message: 'Please use generated operation-specific hooks instead',
              },
            ],
          },
        ],
      },
    },
    {
      files: ['app/**/*.graphql', 'test/**/*.graphql'],
      parser: '@graphql-eslint/eslint-plugin',
      plugins: ['@graphql-eslint'],
      parserOptions: {
        operations: ['./app/javascript/**/*.graphql'],
        schema: './schema.graphql',
      },
      extends: ['plugin:@graphql-eslint/operations-recommended'],
      rules: {
        '@graphql-eslint/naming-convention': 'off',
        // TODO turn this back on when https://github.com/dotansimha/graphql-eslint/issues/654 is fixed
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
      extends: ['plugin:@graphql-eslint/schema-recommended'],
      parserOptions: {
        schema: './schema.graphql',
      },
      rules: {
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
                'ScheduledMoneyValue',
                'ScheduledValue',
                'SearchResultEntry',
                'SignupCountByState',
                'TicketCountByTypeAndPaymentAmount',
                'TimespanWithMoneyValue',
                'TimespanWithValue',
              ],
            },
          },
        ],
      },
    },
  ],

  settings: {
    'import/resolver': {
      typescript: {
        // always try to resolve types under `<roo/>@types` directory even it doesn't
        // contain any source code, like `@types/unist`
        alwaysTryTypes: true,
      },
    },
    'import/ignore': ['test/javascript/testUtils.js'],
    react: {
      version: 'detect',
    },
  },
};
