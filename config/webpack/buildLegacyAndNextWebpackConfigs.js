const environment = require('./environment');

function environmentWithBabelPresets(presets) {
  const modifiedEnvironment = { ...environment };
  modifiedEnvironment.toWebpackConfig = environment.toWebpackConfig.bind(modifiedEnvironment);
  const originalBabelLoader = modifiedEnvironment.loaders.get('babel');

  const babelLoader = {
    ...originalBabelLoader,
    options: {
      ...originalBabelLoader.options,
      presets,
      plugins: [
        'transform-decorators-legacy',
        'transform-class-properties',
      ],
    },
  };

  modifiedEnvironment.loaders = new Map(modifiedEnvironment.loaders);
  modifiedEnvironment.loaders.set('babel', babelLoader);

  return modifiedEnvironment;
}

function buildLegacyAndNextWebpackConfigs() {
  const legacyEnvironment = environmentWithBabelPresets([
    [
      'env', {
        modules: false,
        useBuiltIns: true,
        targets: {
          browsers: [
            '> 1%',
            'last 2 versions',
            'Firefox ESR',
          ],
        },
      },
    ],
    "react",
    "flow",
  ]);

  const nextEnvironment = environmentWithBabelPresets([
    [
      'env', {
        modules: false,
        useBuiltIns: true,
        targets: {
          browsers: [
            'Chrome >= 60',
            'Safari >= 10.1',
            'iOS >= 10.3',
            'Firefox >= 54',
            'Edge >= 15',
          ],
        },
      },
    ],
    "react",
    "flow",
  ]);

  const legacyConfig = legacyEnvironment.toWebpackConfig();
  const nextConfig = nextEnvironment.toWebpackConfig();

  console.log(nextConfig);

  legacyConfig.output.filename = '[name]-legacy-[chunkhash].js';
  legacyConfig.output.chunkFilename = '[name]-legacy-[chunkhash].chunk.js';

  legacyConfig.name = 'legacy';
  nextConfig.name = 'next';

  return [legacyConfig, nextConfig];
}

module.exports = buildLegacyAndNextWebpackConfigs;
