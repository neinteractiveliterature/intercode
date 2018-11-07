const { config } = require('@rails/webpacker');

function buildOutputConfig(configName, extension) {
  return {
    filename: `[name]-${configName}-[chunkhash]${extension}`,
    chunkFilename: `[name]-${configName}-[chunkhash].chunk${extension}`,
    hotUpdateChunkFilename: `[id]-${configName}-[hash].hot-update${extension}`,
    path: config.outputPath,
    publicPath: config.publicPath,
  };
}

module.exports = buildOutputConfig;
