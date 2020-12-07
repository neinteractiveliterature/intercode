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
    'lodash',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-syntax-dynamic-import',
  ],
};

const browserConfig = {
  ...baseConfig,
  presets: [
    [
      '@babel/preset-env',
      {
        corejs: 3,
        useBuiltIns: 'usage',
        modules: false,
      },
    ],
    ...baseConfig.presets,
  ],
};

const nodeConfig = {
  ...baseConfig,
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: process.versions.node,
        },
        modules: 'auto',
      },
    ],
    ...baseConfig.presets,
  ],
};

module.exports = {
  ...browserConfig,
  env: {
    test: {
      ...nodeConfig,
    },
    cli: {
      ...nodeConfig,
    },
  },
};
