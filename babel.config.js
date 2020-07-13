module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        corejs: 3,
        useBuiltIns: 'usage',
        modules: false,
      },
    ],
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: [
    'lodash',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-syntax-dynamic-import',
  ],
  env: {
    test: {
      presets: [
        '@babel/preset-env',
        '@babel/preset-react',
        '@babel/preset-typescript',
      ],
      plugins: [
        '@babel/plugin-syntax-import-meta',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-json-strings',
        '@babel/plugin-proposal-function-sent',
        '@babel/plugin-proposal-export-namespace-from',
        '@babel/plugin-proposal-numeric-separator',
        '@babel/plugin-proposal-throw-expressions',
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-logical-assignment-operators',
        '@babel/plugin-proposal-optional-chaining',
        [
          '@babel/plugin-proposal-pipeline-operator',
          {
            proposal: 'minimal',
          },
        ],
        '@babel/plugin-proposal-nullish-coalescing-operator',
        '@babel/plugin-proposal-do-expressions',
        '@babel/plugin-proposal-function-bind',
        'babel-plugin-dynamic-import-node',
      ],
    },
  },
};
