const baseConfig = require('./baseConfig');
const buildJavascriptRules = require('./buildJavascriptRules');
const buildOutputConfig = require('./buildOutputConfig');

module.exports = {
  name: 'legacy',
  ...baseConfig,
  output: {
    ...baseConfig.output,
    ...buildOutputConfig('legacy', '.js'),
  },
  module: {
    ...baseConfig.module,
    rules: [
      ...buildJavascriptRules('./babel.config.legacy.js'),
      ...baseConfig.module.rules,
    ],
  },
};
