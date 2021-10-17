/* eslint-disable @typescript-eslint/no-var-requires */
const BabelJest = require('babel-jest');
const config = require('../../babel.config.cjs');

module.exports = BabelJest.default.createTransformer(config);
