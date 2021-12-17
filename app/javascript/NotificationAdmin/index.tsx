import { Routes, Route } from 'react-router-dom';

import NotificationAdminIndex from './NotificationAdminIndex';
import NotificationConfiguration from './NotificationConfiguration';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';

function NotificationAdmin(): JSX.Element {
  const authorizationWarning = useAuthorizationRequired('can_update_notification_templates');
  if (authorizationWarning) return authorizationWarning;

  return (
    <Routes>
      <Route path="/admin_notifications/:category/:event" element={<NotificationConfiguration />} />
      <Route path="/admin_notifications" element={<NotificationAdminIndex />} />
    </Routes>
  );
}

export default NotificationAdmin;
