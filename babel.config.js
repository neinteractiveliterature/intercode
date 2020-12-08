const baseConfig = {
  presets: [
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    // 'lodash',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-syntax-dynamic-import',
    'babel-plugin-graphql-tag',
  ],
};

const browserConfig = {
  ...baseConfig,
  presets: [
    [
      '@babel/preset-env',
      {
        corejs: 3,
        useBuiltIns: 'entry',
        modules: false,
      },
    ],
    ...baseConfig.presets,
  ],
};

const testConfig = {
  ...baseConfig,
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '12',
        },
      },
    ],
    ...baseConfig.presets,
  ],
};

module.exports = {
  ...browserConfig,
  env: {
    test: {
      ...testConfig,
    },
  },
};
