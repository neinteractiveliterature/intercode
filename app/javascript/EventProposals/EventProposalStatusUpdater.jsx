import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';

import { useMutation, useApolloClient } from '@apollo/react-hooks';
import BooleanInput from '../BuiltInFormControls/BooleanInput';
import ErrorDisplay from '../ErrorDisplay';
import MultipleChoiceInput from '../BuiltInFormControls/MultipleChoiceInput';
import { TransitionEventProposal } from './mutations.gql';
import useModal from '../ModalDialogs/useModal';
import useAsyncFunction from '../useAsyncFunction';

const STATUSES = [
  { key: 'proposed', transitionLabel: 'Update', buttonClass: 'btn-primary' },
  { key: 'reviewing', transitionLabel: 'Update', buttonClass: 'btn-primary' },
  { key: 'accepted', transitionLabel: 'Accept', buttonClass: 'btn-success' },
  {
    key: 'rejected', transitionLabel: 'Reject', buttonClass: 'btn-danger', offerDropEvent: true,
  },
  {
    key: 'withdrawn', transitionLabel: 'Update', buttonClass: 'btn-danger', offerDropEvent: true,
  },
];

function getStatus(key) {
  return STATUSES.find((status) => status.key === key);
}

function EventProposalStatusUpdater({ eventProposal }) {
  const [status, setStatus] = useState(eventProposal.status);
  const [dropEvent, setDropEvent] = useState(false);
  const { open: openModal, close: closeModal, visible: modalVisible } = useModal();
  const apolloClient = useApolloClient();
  const [transitionMutate] = useMutation(TransitionEventProposal);
  const [transitionEventProposal, transitionError, transitionInProgress] = useAsyncFunction(
    transitionMutate,
  );

  const performTransition = async () => {
    await transitionEventProposal({
      variables: {
        eventProposalId: eventProposal.id,
        status,
        dropEvent,
      },
    });
    await apolloClient.resetStore();

    closeModal();
  };

  return (
    <div>
      Status:
      {' '}
      {eventProposal.status}
      {' '}
      <button type="button" className="btn btn-sm btn-primary" onClick={openModal}>
        Change
      </button>

      <Modal visible={modalVisible}>
        <div className="modal-header">
          {'Change status for '}
          {eventProposal.title}
        </div>

        <div className="modal-body">
          <MultipleChoiceInput
            caption="New status"
            choices={['proposed', 'reviewing', 'accepted', 'rejected', 'withdrawn'].map((s) => ({
              label: s, value: s,
            }))}
            value={status}
            onChange={(newStatus) => { setStatus(newStatus); setDropEvent(false); }}
            disabled={transitionInProgress}
          />

          {
            status === 'accepted' && !eventProposal.event
              ? (
                <p className="text-danger">
                  This will create an event on the convention web site.  It will not yet be
                  on the schedule or possible to sign up for, but it will appear in the events
                  list.
                </p>
              )
              : null
          }

          {
            getStatus(status).offerDropEvent && eventProposal.event
              ? (
                <BooleanInput
                  caption="Drop event?"
                  value={dropEvent}
                  onChange={setDropEvent}
                  disabled={transitionInProgress}
                />
              )
              : null
          }

          <ErrorDisplay graphQLError={transitionError} />
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={closeModal}
            disabled={transitionInProgress}
          >
            Cancel
          </button>

          <button
            type="button"
            className={`btn ${getStatus(status).buttonClass}`}
            onClick={performTransition}
            disabled={
              transitionInProgress
              || status === eventProposal.status
            }
          >
            {getStatus(status).transitionLabel}
          </button>
        </div>
      </Modal>
    </div>
  );
}

EventProposalStatusUpdater.propTypes = {
  eventProposal: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string,
    status: PropTypes.string.isRequired,
    event: PropTypes.shape({}),
  }).isRequired,
};

export default EventProposalStatusUpdater;
