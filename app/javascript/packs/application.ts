import 'bootstrap.native/dist/bootstrap-native-v4';

import '../styles/application.scss';
import 'react-table/react-table.css';
import '../inflections';

import components from './components';
import mountReactComponents from '../mountReactComponents';

document.addEventListener('DOMContentLoaded', () => { mountReactComponents(components); });
