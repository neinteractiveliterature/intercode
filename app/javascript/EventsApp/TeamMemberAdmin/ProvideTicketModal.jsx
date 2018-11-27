import React from 'react';
import arrayToSentence from 'array-to-sentence';
import { capitalize, pluralize } from 'inflected';
import Modal from 'react-bootstrap4-modal';
import { Mutation } from 'react-apollo';

import { describeTicketType, describeTicketTypeProvidability } from './ProvideTicketUtils';
import ErrorDisplay from '../../ErrorDisplay';
import MultipleChoiceInput from '../../BuiltInFormControls/MultipleChoiceInput';
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

  renderTicketTypeSelection = (providableTicketTypes, providedTicketCountByType) => {
    const { teamMember, convention, event } = this.props;

    if (teamMember.user_con_profile.ticket) {
      return null;
    }

    const providableTicketTypeDescriptions = providableTicketTypes
      .map(ticketType => describeTicketTypeProvidability(
        ticketType,
        providedTicketCountByType[ticketType.id],
        convention.ticket_name,
      ));

    const providabilityDescription = [
      `${event.title} has`,
      (
        providableTicketTypeDescriptions.length > 0
          ? arrayToSentence(providableTicketTypeDescriptions)
          : 'no tickets'
      ),
      'remaining to provide',
    ].join(' ');

    const choices = providableTicketTypes.map((ticketType) => {
      const remaining = (
        ticketType.maximum_event_provided_tickets - providedTicketCountByType[ticketType.id]
      );

      return {
        label: `Provide ${describeTicketType(ticketType, convention.ticket_name)} (${remaining} remaining)`,
        value: ticketType.id.toString(),
        disabled: remaining < 1,
      };
    });

    return (
      <>
        <div>
          {providabilityDescription}
          .
        </div>

        <MultipleChoiceInput
          name="ticketTypeId"
          caption=""
          choices={choices}
          value={this.state.ticketTypeId == null ? '' : this.state.ticketTypeId.toString()}
          onChange={(value) => { this.setState({ ticketTypeId: Number.parseInt(value, 10) }); }}
          disabled={this.state.mutationInProgress}
        />
      </>
    );
  }

  render = () => {
    const {
      event, convention, onClose, teamMember, visible,
    } = this.props;

    const provideTicket = (mutate, ...args) => mutate({
      ...args,
      update: (store, { data: { provideEventTicket: { ticket } } }) => {
        const data = store.readQuery({
          query: TeamMembersQuery,
          variables: { eventId: event.id },
        });

        data.event.provided_tickets.push(ticket);
        const teamMemberToUpdate = data.event.team_members
          .find(tm => teamMember.id === tm.id);
        teamMemberToUpdate.user_con_profile.ticket = ticket;

        store.writeQuery({
          query: TeamMembersQuery,
          variables: { eventId: event.id },
          data,
        });
      },
    });

    const providableTicketTypes = convention.ticket_types.filter((
      ticketType => ticketType.maximum_event_provided_tickets > 0
    ));
    const providedTicketCountByType = Object.assign(
      {},
      ...providableTicketTypes.map((
        ticketType => ({
          [ticketType.id]: event.provided_tickets.filter((
            ticket => ticket.ticket_type.id === ticketType.id
          )).length,
        })
      )),
    );

    if (providableTicketTypes.length < 1) {
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

                  {this.renderTicketTypeSelection(providableTicketTypes, providedTicketCountByType)}
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
                    {mutate => (
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
