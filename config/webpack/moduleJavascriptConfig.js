const baseConfig = require('./baseConfig');
const buildJavascriptRules = require('./buildJavascriptRules');
const buildOutputConfig = require('./buildOutputConfig');

module.exports = {
  name: 'module',
  ...baseConfig,
  output: {
    ...baseConfig.output,
    ...buildOutputConfig('module', '.mjs'),
  },
  module: {
    ...baseConfig.module,
    rules: [
      ...buildJavascriptRules('./babel.config.module.js'),
      ...baseConfig.module.rules,
    ],
  },
};
