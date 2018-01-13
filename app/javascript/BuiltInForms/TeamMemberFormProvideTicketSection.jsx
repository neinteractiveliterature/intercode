import React from 'react';
import PropTypes from 'prop-types';
import arrayToSentence from 'array-to-sentence';
import { ConfirmModal } from 'react-bootstrap4-modal';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { humanize } from 'inflected';
import MultipleChoiceInput from '../BuiltInFormControls/MultipleChoiceInput';
import pluralizeWithCount from '../pluralizeWithCount';
import { ticketFragment, teamMemberQuery } from './TeamMemberForm';

export const provideEventTicketMutation = gql`
mutation($input: ProvideEventTicketInput!) {
  provideEventTicket(input: $input) {
    ticket {
      ...TeamMemberTicketFields
    }
  }
}

${ticketFragment}
`;

const describeTicketType = ticketType => `${humanize(ticketType.name).toLowerCase()} ticket`;

const describeTicketTypeProvidability = (ticketType, alreadyProvidedCount) => {
  const remaining = (
    ticketType.maximum_event_provided_tickets - alreadyProvidedCount
  );

  return pluralizeWithCount(describeTicketType(ticketType), remaining);
};

const describeTicketingStatus = (userConProfile, existingTicket, convention) => {
  const statusDescription = [];
  statusDescription.push(userConProfile.name_without_nickname);

  if (existingTicket) {
    statusDescription.push(` has a ${describeTicketType(existingTicket.ticket_type)}`);
    if (existingTicket.provided_by_event) {
      statusDescription.push(` provided by ${existingTicket.provided_by_event.title}`);
    }
  } else {
    statusDescription.push((
      <span key="unticketed-warning">
        <span className="text-danger"> is unticketed for {convention.name}.</span>
        {' '}
          Without a ticket, users cannot sign up for events at the convention
      </span>
    ));
  }

  statusDescription.push('.');

  return statusDescription;
};

const TicketTypePropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  maximum_event_provided_tickets: PropTypes.number.isRequired,
});

@graphql(provideEventTicketMutation, {
  props: ({ mutate }) => ({
    provideEventTicket: (eventId, userConProfileId, ticketTypeId) => mutate({
      variables: {
        input: {
          event_id: eventId,
          user_con_profile_id: userConProfileId,
          ticket_type_id: ticketTypeId,
        },
      },
      update: (proxy, { data: { provideEventTicket: { ticket } } }) => {
        const data = proxy.readQuery({ query: teamMemberQuery, variables: { eventId } });
        data.event.provided_tickets.push(ticket);
        const teamMemberToUpdate = data.event.team_members.find(teamMember =>
          teamMember.user_con_profile.id === ticket.user_con_profile.id);
        teamMemberToUpdate.user_con_profile.ticket = ticket;

        proxy.writeQuery({ query: teamMemberQuery, variables: { eventId }, data });
      },
    }),
  }),
})
class TeamMemberFormProvideTicketSection extends React.Component {
  static propTypes = {
    convention: PropTypes.shape({
      ticket_types: PropTypes.arrayOf(TicketTypePropType.isRequired).isRequired,
    }).isRequired,
    event: PropTypes.shape({
      can_provide_tickets: PropTypes.bool.isRequired,
      provided_tickets: PropTypes.arrayOf(PropTypes.shape({
        ticket_type: TicketTypePropType.isRequired,
      }).isRequired).isRequired,
      team_members: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        user_con_profile: PropTypes.shape({
          id: PropTypes.number.isRequired,
          name_without_nickname: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired).isRequired,
      title: PropTypes.string.isRequired,
    }).isRequired,
    teamMember: PropTypes.shape({
      id: PropTypes.number,
      user_con_profile: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name_without_nickname: PropTypes.string.isRequired,
      }),
    }).isRequired,
    eventId: PropTypes.number.isRequired,
    didError: PropTypes.func.isRequired,
    provideEventTicket: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      confirmingProvideEventTicketTypeId: null,
      requestInProgress: false,
      provideTicketTypeId: null,
    };
  }

  provideEventTicketForExistingTeamMemberClicked = (event, ticketTypeId) => {
    event.preventDefault();
    this.setState({ confirmingProvideEventTicketTypeId: ticketTypeId });
  }

  provideEventTicketForExistingTeamMemberCanceled = (event) => {
    event.preventDefault();
    this.setState({ confirmingProvideEventTicketTypeId: null });
  }

  provideEventTicketForExistingTeamMemberConfirmed = async () => {
    const ticketTypeId = this.state.confirmingProvideEventTicketTypeId;
    this.setState({ confirmingProvideEventTicketTypeId: null, requestInProgress: true });

    try {
      await this.props.provideEventTicket(
        this.props.eventId,
        this.props.teamMember.user_con_profile.id,
        ticketTypeId,
      );
    } catch (error) {
      this.props.didError(error);
    } finally {
      this.setState({ requestInProgress: false });
    }
  }

  render = () => {
    if (!this.props.event.can_provide_tickets) {
      return null;
    }

    let statusDescription;
    const providableTicketTypes = this.props.convention.ticket_types.filter((
      ticketType => ticketType.maximum_event_provided_tickets > 0
    ));
    const providedTicketCountByType = Object.assign(
      {},
      ...providableTicketTypes.map((
        ticketType => ({
          [ticketType.id]: this.props.event.provided_tickets.filter((
            ticket => ticket.ticket_type.id === ticketType.id
          )).length,
        })
      )),
    );

    if (providableTicketTypes.length < 1) {
      return null;
    }

    let ticketingControls = null;
    const existingTicket = this.getExistingTicket();

    if (this.props.teamMember.id) {
      const teamMemberFromData = this.props.event.team_members.find(teamMember =>
        teamMember.id === this.props.teamMember.id);

      statusDescription = describeTicketingStatus(
        teamMemberFromData.user_con_profile,
        existingTicket,
        this.props.convention,
      );

      if (!existingTicket) {
        const providableTicketTypeDescriptions = providableTicketTypes.map(ticketType =>
          describeTicketTypeProvidability(ticketType, providedTicketCountByType[ticketType.id]));

        const providabilityDescription = [
          `${this.props.event.title} has`,
          (
            providableTicketTypeDescriptions.length > 0 ?
              arrayToSentence(providableTicketTypeDescriptions) :
              'no tickets'
          ),
          'remaining to provide',
        ].join(' ');

        const providableTicketTypesWithRemainingTickets =
          providableTicketTypes.filter(ticketType =>
            ticketType.maximum_event_provided_tickets > providedTicketCountByType[ticketType.id]);

        const provideButtons = providableTicketTypesWithRemainingTickets.map(ticketType => (
          <li className="list-inline-item" key={ticketType.id}>
            <button
              className="btn btn-success"
              onClick={(event) => {
                this.provideEventTicketForExistingTeamMemberClicked(event, ticketType.id);
              }}
              disabled={this.state.requestInProgress}
            >
              Provide {describeTicketType(ticketType)}
            </button>
          </li>
        ));

        ticketingControls = (
          <div className="mt-3">
            <div>
              {providabilityDescription}.
            </div>

            <ul className="list-inline mt-2 mb-0">{provideButtons}</ul>
          </div>
        );
      }
    } else {
      if (!this.props.teamMember.user_con_profile) {
        return null;
      }

      statusDescription = describeTicketingStatus(
        this.props.teamMember.user_con_profile,
        existingTicket,
        this.props.convention,
      );

      if (!existingTicket) {
        const choices = providableTicketTypes.map((ticketType) => {
          const remaining = (
            ticketType.maximum_event_provided_tickets - providedTicketCountByType[ticketType.id]
          );

          return {
            label: `Provide ${describeTicketType(ticketType)} (${remaining} remaining)`,
            value: ticketType.id.toString(),
            disabled: remaining < 1,
          };
        });

        ticketingControls = (
          <MultipleChoiceInput
            name="provideTicketTypeId"
            caption=""
            choices={[
              { label: 'Don\'t provide a ticket at this time', value: '' },
              ...choices,
            ]}
            value={this.state.provideTicketTypeId == null ? '' : this.state.provideTicketTypeId.toString()}
            onChange={this.provideTicketTypeIdChanged}
          />
        );
      }
    }

    return (
      <section className="card bg-light my-4">
        <div className="card-body">
          <h5 className="mb-3">Ticketing</h5>

          <p className="m-0">{statusDescription}</p>

          {ticketingControls}
        </div>

        <ConfirmModal
          onOK={this.provideEventTicketForExistingTeamMemberConfirmed}
          onCancel={this.provideEventTicketForExistingTeamMemberCanceled}
          visible={this.state.confirmingProvideEventTicketTypeId != null}
        >
          Are you sure you want to provide a ticket to
          {' '}
          {(this.props.teamMember.user_con_profile || {}).name_without_nickname}?
          This will use up one of {this.props.event.title}&apos;s tickets.
        </ConfirmModal>
      </section>
    );
  }
}

export default TeamMemberFormProvideTicketSection;
