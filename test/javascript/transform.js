/* eslint-disable import/extensions */

import BabelJest from 'babel-jest';
import config from '../../babel.config.cjs';

export default BabelJest.default.createTransformer(config);
