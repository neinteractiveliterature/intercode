const baseConfig = require('./babel.config.base');

module.exports = {
  ...baseConfig,
  presets: [
    ...baseConfig.presets,
    [
      '@babel/preset-env',
      { useBuiltIns: 'usage' },
    ],
  ],
};
