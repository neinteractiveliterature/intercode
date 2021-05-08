import 'regenerator-runtime/runtime';
import 'bootstrap';

import '../styles/application.scss';
import '../inflections';

import components from './components';
import mountReactComponents from '../mountReactComponents';

document.addEventListener('DOMContentLoaded', () => {
  mountReactComponents(components);
});
