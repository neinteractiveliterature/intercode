const legacyJavascriptConfig = require('./legacyJavascriptConfig');
const moduleJavascriptConfig = require('./moduleJavascriptConfig');

function buildWebpackConfigs(buildConfig) {
  return [
    buildConfig(legacyJavascriptConfig),
    buildConfig(moduleJavascriptConfig),
  ];
}

module.exports = buildWebpackConfigs;
