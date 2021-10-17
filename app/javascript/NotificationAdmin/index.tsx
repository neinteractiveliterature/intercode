import { Switch, Route } from 'react-router-dom';

import NotificationAdminIndex from './NotificationAdminIndex';
import NotificationConfiguration from './NotificationConfiguration';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';

function NotificationAdmin(): JSX.Element {
  const authorizationWarning = useAuthorizationRequired('can_update_notification_templates');
  if (authorizationWarning) return authorizationWarning;

  return (
    <Switch>
      <Route path="/admin_notifications/:category/:event">
        <NotificationConfiguration />
      </Route>
      <Route path="/admin_notifications">
        <NotificationAdminIndex />
      </Route>
    </Switch>
  );
}

export default NotificationAdmin;
