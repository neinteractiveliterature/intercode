import React from 'react';
import { capitalize, pluralize } from 'inflected';
import Modal from 'react-bootstrap4-modal';
import { Mutation } from 'react-apollo';

import ErrorDisplay from '../../ErrorDisplay';
import { getProvidableTicketTypes } from './ProvideTicketUtils';
import ProvidableTicketTypeSelection from './ProvidableTicketTypeSelection';
import { ProvideEventTicket } from './mutations.gql';
import { TeamMembersQuery } from './queries.gql';
import TicketingStatusDescription from './TicketingStatusDescription';

class ProvideTicketModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ticketTypeId: null,
      mutationInProgress: false,
    };
  }

  render = () => {
    const {
      event, convention, onClose, teamMember, visible,
    } = this.props;

    const provideTicket = (mutate, args) => mutate({
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
    });

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
                          value={this.state.ticketTypeId}
                          onChange={(value) => { this.setState({ ticketTypeId: value }); }}
                          disabled={this.state.mutationInProgress}
                        />
                      )
                      : null
                  }
                </>
              )
              : null
          }

          <ErrorDisplay graphQLError={this.state.error} />
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
                    disabled={this.state.mutationInProgress}
                  >
                    Cancel
                  </button>
                  <Mutation mutation={ProvideEventTicket}>
                    {(mutate) => (
                      <button
                        type="button"
                        className="btn btn-primary"
                        disabled={this.state.ticketTypeId == null || this.state.mutationInProgress}
                        onClick={async () => {
                          this.setState({ mutationInProgress: true });
                          try {
                            await provideTicket(mutate, {
                              variables: {
                                eventId: event.id,
                                userConProfileId: teamMember.user_con_profile.id,
                                ticketTypeId: this.state.ticketTypeId,
                              },
                            });
                            this.setState({ mutationInProgress: false });
                            onClose();
                          } catch (error) {
                            this.setState({ error, mutationInProgress: false });
                          }
                        }}
                      >
                        {'Provide '}
                        {convention.ticket_name}
                      </button>
                    )}
                  </Mutation>
                </>
              )
          }
        </div>
      </Modal>
    );
  }
}

export default ProvideTicketModal;
