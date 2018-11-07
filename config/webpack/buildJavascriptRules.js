const path = require('path');
const { config } = require('@rails/webpacker');

function buildJavascriptRules(babelConfigFile) {
  const babelLoaderConfig = {
    loader: 'babel-loader',
    options: {
      cacheDirectory: path.join(config.cache_path, 'babel-loader'),
      configFile: babelConfigFile,
    }
  };

  return [
    {
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
      use: [babelLoaderConfig],
    },
    {
      test: /\.(js|jsx)?(\.erb)?$/,
      exclude: /node_modules/,
      use: [babelLoaderConfig],
    },
  ];
}

module.exports = buildJavascriptRules;
