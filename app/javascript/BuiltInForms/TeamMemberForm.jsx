import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { flowRight } from 'lodash';
import gql from 'graphql-tag';
import { enableUniqueIds } from 'react-html-id';
import { ConfirmModal } from 'react-bootstrap4-modal';
import { humanize, underscore, capitalize, pluralize } from 'inflected';
import arrayToSentence from 'array-to-sentence';
import BootstrapFormCheckbox from '../BuiltInFormControls/BootstrapFormCheckbox';
import MultipleChoiceInput from '../BuiltInFormControls/MultipleChoiceInput';
import UserConProfileSelect from '../BuiltInFormControls/UserConProfileSelect';
import { getStateChangeForCheckboxChange } from '../FormUtils';
import GraphQLQueryResultWrapper from '../GraphQLQueryResultWrapper';
import GraphQLResultPropType from '../GraphQLResultPropType';
import ErrorDisplay from '../ErrorDisplay';
import pluralizeWithCount from '../pluralizeWithCount';

const ticketFragment = gql`
fragment TeamMemberTicketFields on Ticket {
  id

  user_con_profile {
    id
  }

  ticket_type {
    id
    name
  }

  provided_by_event {
    id
    title
  }
}
`;

const userConProfileFragment = gql`
fragment TeamMemberUserConProfileFields on UserConProfile {
  id
  name_without_nickname

  ticket {
    ...TeamMemberTicketFields
  }
}

${ticketFragment}
`;

const teamMemberFragment = gql`
fragment TeamMemberFields on TeamMember {
  id
  display
  show_email
  receive_con_email
  receive_signup_email

  user_con_profile {
    ...TeamMemberUserConProfileFields
  }
}

${userConProfileFragment}
`;

const teamMemberQuery = gql`
query($eventId: Int!) {
  convention {
    name

    ticket_types {
      id
      name
      description
      maximum_event_provided_tickets(event_id: $eventId)
    }
    ticket_name
  }

  event(id: $eventId) {
    title
    team_member_name
    can_provide_tickets

    team_members {
      ...TeamMemberFields
    }

    provided_tickets {
      ticket_type {
        id
      }
    }
  }
}

${teamMemberFragment}
`;

const userConProfilesQuery = gql`
query($cursor: String) {
  convention {
    user_con_profiles(first: 1000, after: $cursor) {
      pageInfo {
        endCursor
        hasNextPage
      }

      edges {
        node {
          ...TeamMemberUserConProfileFields
        }
      }
    }
  }
}

${userConProfileFragment}
`;

const createTeamMemberMutation = gql`
mutation($input: CreateTeamMemberInput!) {
  createTeamMember(input: $input) {
    team_member {
      ...TeamMemberFields
    }
  }
}

${teamMemberFragment}
`;

const deleteTeamMemberMutation = gql`
mutation($input: DeleteTeamMemberInput!) {
  deleteTeamMember(input: $input) {
    team_member {
      ...TeamMemberFields
    }
  }
}

${teamMemberFragment}
`;

const updateTeamMemberMutation = gql`
mutation($input: UpdateTeamMemberInput!) {
  updateTeamMember(input: $input) {
    team_member {
      ...TeamMemberFields
    }
  }
}

${teamMemberFragment}
`;

const provideEventTicketMutation = gql`
mutation($input: ProvideEventTicketInput!) {
  provideEventTicket(input: $input) {
    ticket {
      ...TeamMemberTicketFields
    }
  }
}

${ticketFragment}
`;

const buildTeamMemberInput = teamMember => ({
  display: teamMember.display,
  show_email: teamMember.show_email,
  receive_con_email: teamMember.receive_con_email,
  receive_signup_email: teamMember.receive_signup_email,
});

const describeTicketType = (ticketType, ticketName) => (
  `${humanize(ticketType.name).toLowerCase()} ${ticketName}`
);

const describeTicketTypeProvidability = (ticketType, alreadyProvidedCount, ticketName) => {
  const remaining = (
    ticketType.maximum_event_provided_tickets - alreadyProvidedCount
  );

  return pluralizeWithCount(describeTicketType(ticketType, ticketName), remaining);
};

const describeTicketingStatus = (userConProfile, existingTicket, convention) => {
  const statusDescription = [];
  statusDescription.push(userConProfile.name_without_nickname);
  const { ticket_name: ticketName } = convention;

  if (existingTicket) {
    statusDescription.push((
      ` has a ${describeTicketType(existingTicket.ticket_type, ticketName)}`
    ));
    if (existingTicket.provided_by_event) {
      statusDescription.push(` provided by ${existingTicket.provided_by_event.title}`);
    }
  } else {
    statusDescription.push((
      <span key="unticketed-warning">
        <span className="text-danger"> has no {ticketName} for {convention.name}.</span>
        {' '}
        Without a {ticketName}, users cannot sign up for events at the convention.
      </span>
    ));
  }

  statusDescription.push('.');

  return statusDescription;
};

@flowRight([
  graphql(teamMemberQuery),
  graphql(createTeamMemberMutation, {
    props: ({ mutate }) => ({
      createTeamMember: (eventId, userConProfileId, teamMember, provideTicketTypeId) => mutate({
        variables: {
          input: {
            event_id: eventId,
            user_con_profile_id: userConProfileId,
            team_member: buildTeamMemberInput(teamMember),
            provide_ticket_type_id: provideTicketTypeId,
          },
        },
      }),
    }),
  }),
  graphql(deleteTeamMemberMutation, { name: 'deleteTeamMember' }),
  graphql(updateTeamMemberMutation, {
    props: ({ mutate }) => ({
      updateTeamMember: teamMember => mutate({
        variables: {
          input: {
            id: teamMember.id,
            team_member: buildTeamMemberInput(teamMember),
          },
        },
      }),
    }),
  }),
  graphql(provideEventTicketMutation, {
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
  }),
])
@GraphQLQueryResultWrapper
class TeamMemberForm extends React.Component {
  static propTypes = {
    data: GraphQLResultPropType(teamMemberQuery).isRequired,
    baseUrl: PropTypes.string.isRequired,
    eventId: PropTypes.number.isRequired, // eslint-disable-line react/no-unused-prop-types
    teamMemberId: PropTypes.number,
    createTeamMember: PropTypes.func.isRequired,
    deleteTeamMember: PropTypes.func.isRequired,
    updateTeamMember: PropTypes.func.isRequired,
    provideEventTicket: PropTypes.func.isRequired,
  };

  static defaultProps = {
    teamMemberId: null,
  };

  constructor(props) {
    super(props);
    enableUniqueIds(this);

    this.state = {
      confirmingDelete: false,
      confirmingProvideEventTicketTypeId: null,
      requestInProgress: false,
      provideTicketTypeId: null,
    };

    if (this.props.teamMemberId) {
      this.state.teamMember = this.props.data.event.team_members
        .find(teamMember => teamMember.id === this.props.teamMemberId);
    } else {
      this.state.teamMember = {
        user_con_profile: null,
        display: true,
        show_email: true,
        receive_con_email: true,
        receive_signup_email: false,
      };
    }
  }

  getExistingTicket = () => {
    if (this.state.teamMember.id) {
      const teamMemberFromData = this.props.data.event.team_members.find(teamMember =>
        teamMember.id === this.state.teamMember.id);
      return teamMemberFromData.user_con_profile.ticket;
    } else if (this.state.teamMember.user_con_profile) {
      return this.state.teamMember.user_con_profile.ticket;
    }

    return null;
  }

  getSubmitText = () => (
    `${this.state.teamMember.id ? 'Update' : 'Add'} ${this.props.data.event.team_member_name}`
  )

  checkboxChanged = (event) => {
    this.setState(getStateChangeForCheckboxChange(event, this.state, 'teamMember'));
  }

  userConProfileIdChanged = (selection) => {
    this.setState({
      teamMember: { ...this.state.teamMember, user_con_profile: selection.data },
    });
  }

  provideTicketTypeIdChanged = (value) => {
    this.setState({ provideTicketTypeId: value === '' ? null : parseInt(value, 10) });
  }

  deleteClicked = () => {
    this.setState({ confirmingDelete: true });
  }

  deleteConfirmed = async () => {
    try {
      await this.props.deleteTeamMember({ variables: { input: { id: this.state.teamMember.id } } });
      window.location.href = this.props.baseUrl;
    } catch (error) {
      this.setState({ error });
      this.deleteCanceled();
    }
  }

  deleteCanceled = () => {
    this.setState({ confirmingDelete: false });
  }

  submitClicked = async (event) => {
    event.preventDefault();

    const { teamMember } = this.state;

    this.setState({ requestInProgress: true });

    try {
      if (this.state.teamMember.id) {
        await this.props.updateTeamMember(teamMember);
      } else {
        await this.props.createTeamMember(
          this.props.eventId,
          teamMember.user_con_profile.id,
          teamMember,
          this.state.provideTicketTypeId,
        );
      }

      window.location.href = this.props.baseUrl;
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ requestInProgress: false });
    }
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
        this.state.teamMember.user_con_profile.id,
        ticketTypeId,
      );
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ requestInProgress: false });
    }
  }

  renderDeleteButtonItem = (submitDisabled) => {
    if (!this.state.teamMember.id) {
      return null;
    }

    return (
      <li className="list-inline-item">
        <button
          type="button"
          className="btn btn-danger"
          onClick={this.deleteClicked}
          disabled={submitDisabled}
        >
          {`Remove ${this.props.data.event.team_member_name}`}
        </button>
      </li>
    );
  }

  renderSubmitSection = () => (
    <ul className="list-inline">
      <li className="list-inline-item">
        <input
          type="submit"
          className="btn btn-primary"
          onClick={this.submitClicked}
          value={this.getSubmitText()}
          disabled={this.state.requestInProgress}
        />
      </li>
      {this.renderDeleteButtonItem(this.state.requestInProgress)}
    </ul>
  )

  renderUserConProfileSelect = () => {
    if (this.state.teamMember.id) {
      // can't change the user once the record is created
      return null;
    }

    const userConProfileSelectId = this.nextUniqueId();

    return (
      <div className="form-group">
        <label htmlFor={userConProfileSelectId}>
          {`${humanize(underscore(this.props.data.event.team_member_name))}`}
        </label>
        <UserConProfileSelect
          id={userConProfileSelectId}
          value={(this.state.teamMember.user_con_profile || {}).id}
          onChange={this.userConProfileIdChanged}
          userConProfilesQuery={userConProfilesQuery}
        />
      </div>
    );
  }

  renderCheckboxes = () => (
    [
      { name: 'display', label: `Display as ${this.props.data.event.team_member_name}` },
      { name: 'show_email', label: 'Show email address' },
      { name: 'receive_con_email', label: 'Receive email from convention' },
      { name: 'receive_signup_email', label: 'Receive email on signup and withdrawal' },
    ].map(({ name, label }) => (
      <BootstrapFormCheckbox
        key={name}
        label={label}
        name={name}
        checked={this.state.teamMember[name]}
        onChange={this.checkboxChanged}
      />
    ))
  )

  renderTicketingSection = () => {
    if (!this.props.data.event.can_provide_tickets) {
      return null;
    }

    let statusDescription;
    const providableTicketTypes = this.props.data.convention.ticket_types.filter((
      ticketType => ticketType.maximum_event_provided_tickets > 0
    ));
    const providedTicketCountByType = Object.assign(
      {},
      ...providableTicketTypes.map((
        ticketType => ({
          [ticketType.id]: this.props.data.event.provided_tickets.filter((
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
    const { ticket_name: ticketName } = this.props.data.convention;

    if (this.state.teamMember.id) {
      const teamMemberFromData = this.props.data.event.team_members.find(teamMember =>
        teamMember.id === this.state.teamMember.id);

      statusDescription = describeTicketingStatus(
        teamMemberFromData.user_con_profile,
        existingTicket,
        this.props.data.convention,
      );

      if (!existingTicket) {
        const providableTicketTypeDescriptions = providableTicketTypes.map(ticketType =>
          describeTicketTypeProvidability(
            ticketType,
            providedTicketCountByType[ticketType.id],
            ticketName,
          ));

        const providabilityDescription = [
          `${this.props.data.event.title} has`,
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
              Provide {describeTicketType(ticketType, ticketName)}
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
      if (!this.state.teamMember.user_con_profile) {
        return null;
      }

      statusDescription = describeTicketingStatus(
        this.state.teamMember.user_con_profile,
        existingTicket,
        this.props.data.convention,
      );

      if (!existingTicket) {
        const choices = providableTicketTypes.map((ticketType) => {
          const remaining = (
            ticketType.maximum_event_provided_tickets - providedTicketCountByType[ticketType.id]
          );

          return {
            label: `Provide ${describeTicketType(ticketType, ticketName)} (${remaining} remaining)`,
            value: ticketType.id.toString(),
            disabled: remaining < 1,
          };
        });

        ticketingControls = (
          <MultipleChoiceInput
            name="provideTicketTypeId"
            caption=""
            choices={[
              { label: `Don't provide a ${ticketName} at this time`, value: '' },
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
          <h5 className="mb-3">{capitalize(pluralize(this.props.data.convention.ticket_name))}</h5>

          <p className="m-0">{statusDescription}</p>

          {ticketingControls}
        </div>
      </section>
    );
  }

  render = () => (
    <form>
      <ErrorDisplay graphQLError={this.state.error} />
      {this.renderUserConProfileSelect()}
      {this.renderCheckboxes()}
      {this.renderTicketingSection()}

      <ConfirmModal
        title="Confirmation"
        onOK={this.deleteConfirmed}
        onCancel={this.deleteCanceled}
        visible={this.state.confirmingDelete}
      >
        {`Are you sure you want to remove this ${this.props.data.event.team_member_name}?`}
      </ConfirmModal>

      <ConfirmModal
        onOK={this.provideEventTicketForExistingTeamMemberConfirmed}
        onCancel={this.provideEventTicketForExistingTeamMemberCanceled}
        visible={this.state.confirmingProvideEventTicketTypeId != null}
      >
        Are you sure you want to provide a {this.props.data.convention.ticket_name} to
        {' '}
        {(this.state.teamMember.user_con_profile || {}).name_without_nickname}?
        This will use up one of {this.props.data.event.title}&apos;s
        {' '}
        {pluralize(this.props.data.convention.ticket_name)}.
      </ConfirmModal>

      {this.renderSubmitSection()}
    </form>
  )
}

export default TeamMemberForm;
