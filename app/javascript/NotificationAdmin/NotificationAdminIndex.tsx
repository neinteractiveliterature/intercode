import { BootstrapFormCheckbox, ErrorDisplay } from '@neinteractiveliterature/litform';
import { useModal } from '@neinteractiveliterature/litform';
import { useContext, useEffect, useMemo, useState } from 'react';
import Modal from 'react-bootstrap4-modal';
import { Link, useFetcher } from 'react-router';

import AppRootContext from '../AppRootContext';
import { ApolloError } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { NotificationsConfigQueryData, NotificationsConfigQueryDocument } from './queries.generated';
import sortBy from 'lodash/sortBy';
import { Route } from './+types/NotificationAdminIndex';
import { apolloClientContext } from 'AppContexts';

type NotificationPreviewModalProps = {
  visible: boolean;
  close: () => void;
  eventConfig?: NotificationsConfigQueryData['notificationEvents'][number];
};

function NotificationPreviewModal({ visible, close, eventConfig }: NotificationPreviewModalProps): JSX.Element {
  const { t } = useTranslation();
  const { myProfile } = useContext(AppRootContext);
  const [sendEmail, setSendEmail] = useState(true);
  const [sendSms, setSendSms] = useState(true);

  useEffect(() => {
    if (eventConfig?.sends_sms) {
      setSendSms(myProfile?.mobile_phone != null);
    } else {
      setSendSms(false);
    }
  }, [eventConfig, myProfile?.mobile_phone]);

  const fetcher = useFetcher();
  const error = fetcher.data instanceof Error ? fetcher.data : undefined;

  const sendPreview = () => {
    fetcher.submit({ email: sendEmail, sms: sendSms }, { action: `./${eventConfig?.key}/preview`, method: 'POST' });
  };

  useEffect(() => {
    if (fetcher.data != null && fetcher.state === 'idle' && !error) {
      close();
    }
  }, [error, fetcher.data, fetcher.state, close]);

  return (
    <Modal visible={visible}>
      <div className="modal-header">Preview</div>
      <div className="modal-body">
        <p>Send a preview of the {eventConfig && t(`admin.notifications.events.${eventConfig.key}`)} notification?</p>
        <BootstrapFormCheckbox
          type="checkbox"
          checked={sendEmail}
          label={`Send email to ${myProfile?.email}`}
          onCheckedChange={setSendEmail}
        />
        <BootstrapFormCheckbox
          type="checkbox"
          checked={sendSms}
          disabled={!eventConfig?.sends_sms || !myProfile?.mobile_phone}
          label={`Send SMS to ${myProfile?.mobile_phone ?? 'unknown number'}`}
          onCheckedChange={setSendSms}
        />
      </div>
      <div className="modal-footer">
        <ErrorDisplay graphQLError={error as ApolloError} />
        <button type="button" className="btn btn-secondary" onClick={close}>
          {t('buttons.cancel')}
        </button>
        <button type="button" className="btn btn-primary" onClick={sendPreview} disabled={fetcher.state !== 'idle'}>
          Send
        </button>
      </div>
    </Modal>
  );
}

export async function loader({ context }: Route.LoaderArgs) {
  const { data } = await context.get(apolloClientContext).query({ query: NotificationsConfigQueryDocument });
  return data;
}

function NotificationAdminIndex({ loaderData: data }: Route.ComponentProps): JSX.Element {
  const previewModal = useModal<{ eventConfig: NotificationsConfigQueryData['notificationEvents'][number] }>();
  const { t } = useTranslation();

  const sortedEvents = useMemo(() => {
    return sortBy(data.notificationEvents, (event) => event.key);
  }, [data]);

  return (
    <>
      <h1 className="mb-4">Notifications</h1>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Category</th>
            <th>Event</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {sortedEvents.map((event) => (
            <tr key={event.key}>
              <td>{event.category}</td>
              <td>{t(`admin.notifications.events.${event.key}`)}</td>
              <td className="text-end">
                <button
                  type="button"
                  className="btn btn-sm btn-secondary me-2"
                  onClick={() => previewModal.open({ eventConfig: event })}
                >
                  Preview
                </button>
                <Link to={`/admin_notifications/${event.key}`} className="btn btn-sm btn-outline-primary">
                  Configure
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <NotificationPreviewModal
        visible={previewModal.visible}
        close={previewModal.close}
        eventConfig={previewModal.state?.eventConfig}
      />
    </>
  );
}

export default NotificationAdminIndex;
