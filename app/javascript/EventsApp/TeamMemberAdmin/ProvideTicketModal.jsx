import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { capitalize, pluralize } from 'inflected';
import Modal from 'react-bootstrap4-modal';
import { useMutation } from 'react-apollo-hooks';

import ErrorDisplay from '../../ErrorDisplay';
import { getProvidableTicketTypes } from './ProvideTicketUtils';
import ProvidableTicketTypeSelection from './ProvidableTicketTypeSelection';
import { ProvideEventTicket } from './mutations.gql';
import { TeamMembersQuery } from './queries.gql';
import TicketingStatusDescription from './TicketingStatusDescription';
import useAsyncFunction from '../../useAsyncFunction';

function ProvideTicketModal({
  event, convention, onClose, teamMember, visible,
}) {
  const [ticketTypeId, setTicketTypeId] = useState(null);
  const [provideTicketMutate] = useMutation(ProvideEventTicket);
  const [provideTicketAsync, error, mutationInProgress] = useAsyncFunction(provideTicketMutate);

  const provideTicket = useCallback(
    (args) => provideTicketAsync({
      ...args,
      update: (store, { data: { provideEventTicket: { ticket } } }) => {
        const data = store.readQuery({
          query: TeamMembersQuery,
          variables: { eventId: event.id },
        });

        data.event.provided_tickets.push(ticket);
        const teamMemberToUpdate = data.event.team_members
          .find((tm) => teamMember.id === tm.id);
        teamMemberToUpdate.user_con_profile.ticket = ticket;

        store.writeQuery({
          query: TeamMembersQuery,
          variables: { eventId: event.id },
          data,
        });
      },
    }),
    [event, provideTicketAsync, teamMember],
  );

  const provideTicketClicked = async () => {
    await provideTicket({
      variables: {
        eventId: event.id,
        userConProfileId: teamMember.user_con_profile.id,
        ticketTypeId,
      },
    });
    onClose();
  };

  if (getProvidableTicketTypes(convention).length < 1) {
    return null;
  }

  return (
    <Modal visible={visible}>
      <div className="modal-header">
        {capitalize(pluralize(convention.ticket_name))}
      </div>

      <div className="modal-body">
        {
          teamMember
            ? (
              <>
                <p>
                  <TicketingStatusDescription
                    userConProfile={teamMember.user_con_profile}
                    convention={convention}
                  />
                </p>

                {
                  teamMember && !teamMember.user_con_profile.ticket
                    ? (
                      <ProvidableTicketTypeSelection
                        event={event}
                        convention={convention}
                        value={ticketTypeId}
                        onChange={setTicketTypeId}
                        disabled={mutationInProgress}
                      />
                    )
                    : null
                }
              </>
            )
            : null
        }

        <ErrorDisplay graphQLError={error} />
      </div>

      <div className="modal-footer">
        {
          teamMember && teamMember.user_con_profile.ticket
            ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={onClose}
              >
                OK
              </button>
            )
            : (
              <>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                  disabled={mutationInProgress}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={ticketTypeId == null || mutationInProgress}
                  onClick={provideTicketClicked}
                >
                  {'Provide '}
                  {convention.ticket_name}
                </button>
              </>
            )
        }
      </div>
    </Modal>
  );
}

ProvideTicketModal.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  convention: PropTypes.shape({
    ticket_name: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  teamMember: PropTypes.shape({
    id: PropTypes.number.isRequired,
    user_con_profile: PropTypes.shape({
      id: PropTypes.number.isRequired,
      ticket: PropTypes.shape({}),
    }).isRequired,
  }),
  visible: PropTypes.bool.isRequired,
};

ProvideTicketModal.defaultProps = {
  teamMember: null,
};

export default ProvideTicketModal;
