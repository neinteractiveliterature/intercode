import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap4-modal';
import { useModal, BooleanInput, ErrorDisplay, MultipleChoiceInput } from '@neinteractiveliterature/litform';

import { ApolloError } from '@apollo/client';
import { EventProposalQueryWithOwnerQueryData } from './queries.generated';
import humanize from '../humanize';
import { useFetcher } from 'react-router';
import { useTranslation } from 'react-i18next';

const STATUSES = [
  { key: 'proposed', transitionLabel: 'Update', buttonClass: 'btn-primary' },
  { key: 'reviewing', transitionLabel: 'Update', buttonClass: 'btn-primary' },
  { key: 'tentative_accept', transitionLabel: 'Accept tentatively', buttonClass: 'btn-primary' },
  { key: 'accepted', transitionLabel: 'Accept', buttonClass: 'btn-success' },
  {
    key: 'rejected',
    transitionLabel: 'Reject',
    buttonClass: 'btn-danger',
    offerDropEvent: true,
  },
  {
    key: 'withdrawn',
    transitionLabel: 'Update',
    buttonClass: 'btn-danger',
    offerDropEvent: true,
  },
];

function getStatus(key: string) {
  return STATUSES.find((status) => status.key === key);
}

export type EventProposalStatusUpdaterProps = {
  eventProposal: EventProposalQueryWithOwnerQueryData['convention']['event_proposal'];
};

function EventProposalStatusUpdater({ eventProposal }: EventProposalStatusUpdaterProps): JSX.Element {
  const [status, setStatus] = useState(eventProposal.status);
  const [dropEvent, setDropEvent] = useState(false);
  const { open: openModal, close: closeModal, visible: modalVisible } = useModal();
  const fetcher = useFetcher();
  const transitionError = fetcher.data instanceof Error ? fetcher.data : undefined;
  const { t } = useTranslation();

  useEffect(() => {
    if (fetcher.data && fetcher.state === 'idle' && !transitionError) {
      closeModal();
    }
  }, [fetcher.data, fetcher.state, closeModal, transitionError]);

  return (
    <div>
      <strong>Status:</strong> {humanize(eventProposal.status)}{' '}
      <button type="button" className="btn btn-sm btn-primary" onClick={openModal}>
        Change
      </button>
      <Modal visible={modalVisible}>
        <fetcher.Form action={`/event_proposals/${eventProposal.id}/transition`} method="PATCH">
          <div className="modal-header">
            {'Change status for '}
            {eventProposal.title}
          </div>

          <div className="modal-body">
            <MultipleChoiceInput
              caption="New status"
              name="status"
              choices={['proposed', 'reviewing', 'tentative_accept', 'accepted', 'rejected', 'withdrawn'].map((s) => ({
                label: humanize(s),
                value: s,
              }))}
              value={status}
              onChange={(newStatus: string) => {
                setStatus(newStatus);
                setDropEvent(false);
              }}
              disabled={fetcher.state !== 'idle'}
            />

            {status === 'accepted' && !eventProposal.event ? (
              <p className="text-danger">
                This will create an event on the convention web site. It will not yet be on the schedule or possible to
                sign up for, but it will appear in the events list.
              </p>
            ) : null}

            {getStatus(status)?.offerDropEvent && eventProposal.event ? (
              <BooleanInput
                caption="Drop event?"
                name="drop_event"
                value={dropEvent}
                onChange={setDropEvent}
                disabled={fetcher.state !== 'idle'}
              />
            ) : null}

            <ErrorDisplay graphQLError={transitionError as ApolloError} />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeModal}
              disabled={fetcher.state !== 'idle'}
            >
              {t('buttons.cancel')}
            </button>

            <button
              type="submit"
              className={`btn ${getStatus(status)?.buttonClass}`}
              disabled={fetcher.state !== 'idle' || status === eventProposal.status}
            >
              {getStatus(status)?.transitionLabel}
            </button>
          </div>
        </fetcher.Form>
      </Modal>
    </div>
  );
}

export default EventProposalStatusUpdater;
