import './setPublicPath';
import 'vite/modulepreload-polyfill';
import './sentryInit';
import('../styles/application.scss');

import(/* webpackChunkName: 'bootstrap-js' */ 'bootstrap');
import(/* webpackChunkName: "application-main" */ './application');
