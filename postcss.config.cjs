/* eslint-disable @typescript-eslint/no-var-requires */

module.exports = {
  plugins: [
    require('autoprefixer'),
    ...(process.env.NODE_ENV === 'production' ? [require('cssnano')({ preset: 'default' })] : []),
  ],
};
