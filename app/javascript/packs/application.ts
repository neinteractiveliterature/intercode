import 'regenerator-runtime/runtime';

import '../styles/application.scss';

import components from './components';
import mountReactComponents from '../mountReactComponents';

document.addEventListener('DOMContentLoaded', () => {
  mountReactComponents(components);
});
