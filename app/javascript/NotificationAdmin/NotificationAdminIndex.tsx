import React from 'react';
import { Link } from 'react-router-dom';

import NotificationsConfig from '../../../config/notifications.json';

function NotificationAdminIndex() {
  return (
    <>
      <h1 className="mb-4">Notifications</h1>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Category</th>
            <th>Event</th>
            <th>Destination</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {NotificationsConfig.categories.map((category) => (
            <React.Fragment key={category.key}>
              {category.events.map((event) => (
                <tr key={`${category.key}/${event.key}`}>
                  <td>{category.name}</td>
                  <td>{event.name}</td>
                  <td>{event.destination_description}</td>
                  <td>
                    <Link
                      to={`/admin_notifications/${category.key}/${event.key}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      Configure
                    </Link>
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default NotificationAdminIndex;
