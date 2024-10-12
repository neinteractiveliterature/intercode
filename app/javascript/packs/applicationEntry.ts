import './setPublicPath';
import 'vite/modulepreload-polyfill';
import('../styles/application.scss');

import(/* webpackChunkName: 'bootstrap-js' */ 'bootstrap');
import('./application');
