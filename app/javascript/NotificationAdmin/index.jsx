import React from 'react';
import { Switch, Route } from 'react-router-dom';

import NotificationAdminIndex from './NotificationAdminIndex';
import NotificationConfiguration from './NotificationConfiguration';

function NotificationAdmin() {
  return (
    <Switch>
      <Route path="/admin_notifications/:category/:event" component={NotificationConfiguration} />
      <Route path="/admin_notifications" component={NotificationAdminIndex} />
    </Switch>
  );
}

export default NotificationAdmin;
