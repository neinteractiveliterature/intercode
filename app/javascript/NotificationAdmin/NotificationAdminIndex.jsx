import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-apollo-hooks';
import sortBy from 'lodash-es/sortBy';
import { humanize, underscore, tableize } from 'inflected';
import Modal from 'react-bootstrap4-modal';

import { NotificationAdminQuery } from './queries.gql';
import NotificationsConfig from '../../../config/notifications.json';
import ErrorDisplay from '../ErrorDisplay';
import LoadingIndicator from '../LoadingIndicator';
import useModal from '../ModalDialogs/useModal';
import EventCategorySelect from '../BuiltInFormControls/EventCategorySelect';

function describeNotificationContext(context, contextType) {
  if (context == null) {
    return `All ${humanize(tableize(contextType)).toLowerCase()} without overrides`;
  }

  if (contextType === 'EventCategory') {
    return context.name;
  }

  return JSON.stringify(context);
}

function OverrideNotificationTemplateModal({ notificationTemplate, visible, close }) {
  const [notificationContext, setNotificationContext] = useState();
  const { data, loading, error } = useQuery(NotificationAdminQuery);

  const renderSelect = () => {
    if (!notificationTemplate) {
      return null;
    }

    if (notificationTemplate.event.context_type === 'EventCategory' && !loading && !error) {
      return (
        <EventCategorySelect
          value={notificationContext}
          onValueChange={setNotificationContext}
          eventCategories={data.convention.event_categories}
        />
      );
    }

    return null;
  };

  const overrideClicked = () => {}

  return (
    <Modal visible={visible}>
      <div className="modal-header">
        Override notification
      </div>

      <div className="modal-body">
        <p>
          {notificationTemplate && (
            <>
              You can override the default notifications for “
              {notificationTemplate.event.name}
              ”
              {' '}
              on a per-
              {humanize(underscore(notificationTemplate.event.context_type)).toLowerCase()}
              {' '}
              basis.
            </>
          )}
        </p>

        {renderSelect()}
      </div>

      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={close} type="button">
          Cancel
        </button>

        <button
          className="btn btn-primary"
          disabled={!notificationContext}
          onClick={overrideClicked}
          type="button"
        >
          Override
        </button>
      </div>
    </Modal>
  );
}

function NotificationAdminIndex() {
  const { data, loading, error } = useQuery(NotificationAdminQuery);
  const overrideModal = useModal();

  const notificationTemplatesWithCategoryAndEventData = useMemo(
    () => {
      if (loading || error) {
        return [];
      }

      return data.convention.notification_templates.map(
        (notificationTemplate) => {
          const [categoryKey, eventKey] = notificationTemplate.event_key.split('/');
          const categoryIndex = NotificationsConfig.categories.findIndex(
            (category) => categoryKey === category.key,
          );
          const category = NotificationsConfig.categories[categoryIndex];
          const eventIndex = category.events.findIndex((event) => eventKey === event.key);
          const event = category.events[eventIndex];

          return ({
            ...notificationTemplate, category, event, categoryIndex, eventIndex,
          });
        },
      );
    },
    [data, error, loading],
  );

  const sortedNotificationTemplates = useMemo(
    () => sortBy(
      notificationTemplatesWithCategoryAndEventData,
      (notificationTemplate) => [
        notificationTemplate.categoryIndex, notificationTemplate.eventIndex,
      ],
    ),
    [notificationTemplatesWithCategoryAndEventData],
  );

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay />;
  }

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
          {sortedNotificationTemplates.map((notificationTemplate) => (
            <tr key={notificationTemplate.event_key}>
              <td>{notificationTemplate.category.name}</td>
              <td>
                {notificationTemplate.event.name}
                {notificationTemplate.event.context_type && (
                  <>
                    <br />
                    <em>
                      {describeNotificationContext(
                        notificationTemplate.notification_context,
                        notificationTemplate.event.context_type,
                      )}
                    </em>
                  </>
                )}
              </td>
              <td>{notificationTemplate.event.destination_description}</td>
              <td>
                <Link
                  to={`/admin_notifications/${notificationTemplate.event_key}`}
                  className="btn btn-sm btn-outline-primary"
                >
                  Configure
                </Link>
                {notificationTemplate.event.context_type && (
                  notificationTemplate.notification_context
                    ? (
                      <button
                        className="d-block mt-1 btn btn-sm btn-outline-danger"
                        aria-label="Delete override"
                        type="button"
                      >
                        <i className="fa fa-trash-o" />
                      </button>
                    )
                    : (
                      <button
                        className="d-block mt-1 btn btn-sm btn-outline-secondary"
                        type="button"
                        onClick={() => overrideModal.open({ notificationTemplate })}
                      >
                        Override
                      </button>
                    )
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <OverrideNotificationTemplateModal
        visible={overrideModal.visible}
        close={overrideModal.close}
        notificationTemplate={(overrideModal.state || {}).notificationTemplate}
      />
    </>
  );
}

export default NotificationAdminIndex;
