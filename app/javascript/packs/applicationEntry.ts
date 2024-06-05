import './setPublicPath';
import './sentryInit';
import './applicationStyles';

import(/* webpackChunkName: 'bootstrap-js' */ 'bootstrap');
import(/* webpackChunkName: "application-main" */ './application');
