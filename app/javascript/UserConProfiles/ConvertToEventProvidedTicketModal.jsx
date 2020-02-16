import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';
import { useMutation, useQuery } from '@apollo/react-hooks';

import { ConvertTicketToEventProvided } from './mutations.gql';
import { ConvertToEventProvidedTicketQuery, UserConProfileAdminQuery } from './queries.gql';
import ErrorDisplay from '../ErrorDisplay';
import EventSelect from '../BuiltInFormControls/EventSelect';
import ProvidableTicketTypeSelection from '../EventsApp/TeamMemberAdmin/ProvidableTicketTypeSelection';
import TicketingStatusDescription from '../EventsApp/TeamMemberAdmin/TicketingStatusDescription';
import useAsyncFunction from '../useAsyncFunction';
import LoadingIndicator from '../LoadingIndicator';

function EventSpecificSection({
  // eslint-disable-next-line react/prop-types
  event, userConProfile, convention, ticketTypeId, setTicketTypeId, disabled,
}) {
  const { data, loading, error } = useQuery(ConvertToEventProvidedTicketQuery, {
    variables: { eventId: event.id }, // eslint-disable-line react/prop-types
  });

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <>
      <p className="mt-4">
        <TicketingStatusDescription
          userConProfile={userConProfile}
          convention={convention}
        />
      </p>

      <ProvidableTicketTypeSelection
        event={data.event}
        convention={data.convention}
        value={ticketTypeId}
        onChange={setTicketTypeId}
        disabled={disabled}
      />
    </>
  );
}

function ConvertToEventProvidedTicketModal({
  convention, userConProfile, visible, onClose,
}) {
  const [event, setEvent] = useState(null);
  const [ticketTypeId, setTicketTypeId] = useState(null);
  const [convertMutate] = useMutation(ConvertTicketToEventProvided);
  const [convertTicketToEventProvided, error, inProgress] = useAsyncFunction(convertMutate);

  const convertClicked = async () => {
    await convertTicketToEventProvided({
      variables: {
        eventId: event.id,
        ticketTypeId,
        userConProfileId: userConProfile.id,
      },
      update: (cache, { data: { convertTicketToEventProvided: { ticket } } }) => {
        const cachedData = cache.readQuery({
          query: UserConProfileAdminQuery,
          variables: { id: userConProfile.id },
        });

        cache.writeQuery({
          query: UserConProfileAdminQuery,
          variables: { id: userConProfile.id },
          data: {
            ...cachedData,
            userConProfile: {
              ...cachedData.userConProfile,
              ticket,
            },
          },
        });
      },
    });
    onClose();
  };

  return (
    <Modal visible={visible}>
      <div className="modal-header">
        {'Convert '}
        {userConProfile.name}
        {'\'s '}
        {convention.ticket_name}
        {' to event-provided'}
      </div>

      <div className="modal-body">
        <p>
          {'This will delete '}
          {userConProfile.name}
          ’s
          {' existing '}
          {convention.ticket_name}
          {' and create a new one for them, provided by an event.  If they paid for their existing '}
          {convention.ticket_name}
          {', that payment will be refunded.'}
        </p>

        <EventSelect
          value={event}
          onChange={(value) => { setEvent(value); setTicketTypeId(null); }}
          placeholder="Select event..."
          disabled={inProgress}
        />

        {event && (
          <EventSpecificSection
            event={event}
            userConProfile={userConProfile}
            convention={convention}
            ticketTypeId={ticketTypeId}
            setTicketTypeId={setTicketTypeId}
            disabled={inProgress}
          />
        )}

        <ErrorDisplay graphQLError={error} />
      </div>

      <div className="modal-footer">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-secondary"
          disabled={inProgress}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={inProgress || !event || !ticketTypeId}
          onClick={convertClicked}
        >
          {'Convert '}
          {convention.ticket_name}
        </button>
      </div>
    </Modal>
  );
}

ConvertToEventProvidedTicketModal.propTypes = {
  convention: PropTypes.shape({
    ticket_name: PropTypes.string.isRequired,
  }).isRequired,
  userConProfile: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ConvertToEventProvidedTicketModal;
