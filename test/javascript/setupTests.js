/* eslint-disable import/first */
import './tempPolyfills';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

import 'jest-dom/extend-expect';
import { cleanup } from './testUtils';

afterEach(cleanup);
