const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { resolve } = require('path');

const getStyleRule = (test, preprocessors = []) => {
  const use = [
    {
      loader: 'css-loader',
      options: {
        sourceMap: true,
        importLoaders: 2,
        modules: false,
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        config: { path: resolve() },
        sourceMap: true
      }
    },
    ...preprocessors
  ];

  use.unshift(MiniCssExtractPlugin.loader);

  // sideEffects - See https://github.com/webpack/webpack/issues/6571
  return { test, use, sideEffects: true, exclude: /\.module\.[a-z]+$/ };
};

module.exports = getStyleRule;
