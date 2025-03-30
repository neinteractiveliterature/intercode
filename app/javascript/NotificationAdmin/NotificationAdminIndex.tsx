import { BootstrapFormCheckbox, ErrorDisplay } from '@neinteractiveliterature/litform';
import { useModal } from '@neinteractiveliterature/litform';
import { Fragment, useContext, useEffect, useMemo, useState } from 'react';
import Modal from 'react-bootstrap4-modal';
import { Link, useFetcher } from 'react-router-dom';

import NotificationsConfig from '../../../config/notifications.json';
import AppRootContext from '../AppRootContext';
import { ApolloError } from '@apollo/client';
import { useTranslation } from 'react-i18next';

type NotificationPreviewModalProps = {
  visible: boolean;
  close: () => void;
  eventKey?: string;
  categoryKey?: string;
};

function NotificationPreviewModal({
  visible,
  close,
  eventKey,
  categoryKey,
}: NotificationPreviewModalProps): JSX.Element {
  const { t } = useTranslation();
  const { myProfile } = useContext(AppRootContext);
  const [sendEmail, setSendEmail] = useState(true);
  const [sendSms, setSendSms] = useState(true);

  const eventConfig = useMemo(() => {
    if (categoryKey == null || eventKey == null) {
      return;
    }

    const category = NotificationsConfig.categories.find((cat) => cat.key === categoryKey);
    const event = category?.events.find((evt) => evt.key === eventKey);
    return event;
  }, [eventKey, categoryKey]);

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
    fetcher.submit(
      { email: sendEmail, sms: sendSms },
      { action: `./${categoryKey}/${eventKey}/preview`, method: 'POST' },
    );
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
        <p>Send a preview of the {eventConfig?.name} notification?</p>
        <BootstrapFormCheckbox
          type="checkbox"
          checked={sendEmail}
          label={`Send email to ${myProfile?.email}`}
          onCheckedChange={setSendEmail}
        />
        {console.log(sendSms) ?? ''}
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

function NotificationAdminIndex(): JSX.Element {
  const previewModal = useModal<{ categoryKey: string; eventKey: string }>();

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
          {NotificationsConfig.categories.map((category) => (
            <Fragment key={category.key}>
              {category.events.map((event) => (
                <tr key={`${category.key}/${event.key}`}>
                  <td>{category.name}</td>
                  <td>{event.name}</td>
                  <td className="text-end">
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary me-2"
                      onClick={() => previewModal.open({ categoryKey: category.key, eventKey: event.key })}
                    >
                      Preview
                    </button>
                    <Link
                      to={`/admin_notifications/${category.key}/${event.key}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      Configure
                    </Link>
                  </td>
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>

      <NotificationPreviewModal
        visible={previewModal.visible}
        close={previewModal.close}
        eventKey={previewModal.state?.eventKey}
        categoryKey={previewModal.state?.categoryKey}
      />
    </>
  );
}

export const Component = NotificationAdminIndex;
