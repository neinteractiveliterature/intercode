import React from 'react';
import { Switch, Route } from 'react-router-dom';

import NotificationAdminIndex from './NotificationAdminIndex';
import NotificationConfiguration from './NotificationConfiguration';

function NotificationAdmin() {
  return (
    <Switch>
      <Route path="/admin_notifications/:category/:event"><NotificationConfiguration /></Route>
      <Route path="/admin_notifications"><NotificationAdminIndex /></Route>
    </Switch>
  );
}

export default NotificationAdmin;
