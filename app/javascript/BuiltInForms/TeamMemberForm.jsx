import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { enableUniqueIds } from 'react-html-id';
import { ConfirmModal } from 'react-bootstrap4-modal';
import { humanize } from 'inflected';
import arrayToSentence from 'array-to-sentence';
import BootstrapFormCheckbox from '../BuiltInFormControls/BootstrapFormCheckbox';
import UserConProfileSelect from '../BuiltInFormControls/UserConProfileSelect';
import { getStateChangeForCheckboxChange } from '../FormUtils';
import GraphQLQueryResultWrapper from '../GraphQLQueryResultWrapper';
import GraphQLResultPropType from '../GraphQLResultPropType';
import ErrorDisplay from '../ErrorDisplay';
import pluralizeWithCount from '../pluralizeWithCount';

const ticketFragment = gql`
fragment TeamMemberTicketFields on Ticket {
  id

  ticket_type {
    name
  }

  provided_by_event {
    id
    title
  }
}
`;

const teamMemberFragment = gql`
fragment TeamMemberFields on TeamMember {
  id
  display
  show_email
  receive_con_email
  receive_signup_email

  user_con_profile {
    id
    name_without_nickname

    ticket {
      ...TeamMemberTicketFields
    }
  }
}

${ticketFragment}
`;

const teamMemberQuery = gql`
query($eventId: Int!) {
  convention {
    name

    ticket_types {
      id
      name
      description
      maximum_event_provided_tickets
    }
  }

  event(id: $eventId) {
    title
    team_member_name

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

@compose(
  graphql(teamMemberQuery),
  graphql(createTeamMemberMutation, { name: 'createTeamMember' }),
  graphql(deleteTeamMemberMutation, { name: 'deleteTeamMember' }),
  graphql(updateTeamMemberMutation, { name: 'updateTeamMember' }),
  graphql(provideEventTicketMutation, {
    props: ({ mutate }) => ({
      provideEventTicket: (eventId, userConProfileId, ticketTypeId, options) => {
        debugger;
        mutate({
          variables: {
            input: {
              event_id: eventId,
              user_con_profile_id: userConProfileId,
              ticket_type_id: ticketTypeId,
            },
          },
          options: options || {},
        });
      },
    }),
  }),
)
@GraphQLQueryResultWrapper
class TeamMemberForm extends React.Component {
  static propTypes = {
    data: GraphQLResultPropType(teamMemberQuery, 'event', 'convention').isRequired,
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
      requestInProgress: false,
    };

    if (this.props.teamMemberId) {
      this.state.teamMember = this.props.data.event.team_members
        .find(teamMember => teamMember.id === this.props.teamMemberId);
    } else {
      this.state.teamMember = {
        user_con_profile_id: null,
        display: true,
        show_email: true,
        receive_con_email: true,
        receive_signup_email: false,
      };
    }
  }

  getSubmitText = () => (
    `${this.state.teamMember.id ? 'Update' : 'Add'} ${this.props.data.event.team_member_name}`
  )

  getSubmitRequestBody = () => ({
    team_member: this.state.teamMember,
  })

  checkboxChanged = (event) => {
    this.setState(getStateChangeForCheckboxChange(event, this.state, 'teamMember'));
  }

  userConProfileIdChanged = (selection) => {
    this.setState({
      teamMember: { ...this.state.teamMember, user_con_profile_id: selection.value },
    });
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

    const teamMemberInput = {
      display: teamMember.display,
      show_email: teamMember.show_email,
      receive_con_email: teamMember.receive_con_email,
      receive_signup_email: teamMember.receive_signup_email,
    };

    this.setState({ requestInProgress: true });

    try {
      if (this.state.teamMember.id) {
        await this.props.updateTeamMember({
          variables: { input: { id: teamMember.id, team_member: teamMemberInput } },
        });
      } else {
        await this.props.createTeamMember({
          variables: {
            input: {
              event_id: this.props.eventId,
              user_con_profile_id: teamMember.user_con_profile_id,
              team_member: teamMemberInput,
            },
          },
        });
      }

      window.location.href = this.props.baseUrl;
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ requestInProgress: false });
    }
  }

  provideEventTicketForExistingTeamMember = async (ticketTypeId) => {
    this.setState({ requestInProgress: true });

    try {
      await this.props.provideEventTicket(
        this.props.eventId,
        this.state.teamMember.user_con_profile.id,
        ticketTypeId,
        {
          update: (store, { data: { provideEventTicket: { ticket } } }) => {
            const data = store.readQuery(teamMemberQuery);
            const teamMemberToUpdate = data.event.team_members.find(teamMember =>
              teamMember.user_con_profile.id === this.state.teamMember.user_con_profile.id);
            teamMemberToUpdate.user_con_profile.ticket = ticket;

            debugger;

            store.writeQuery({ query: teamMemberQuery, data });
          },
        },
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
          {`${this.props.data.event.team_member_name} name`}
        </label>
        <UserConProfileSelect
          id={userConProfileSelectId}
          value={this.state.teamMember.user_con_profile_id}
          onChange={this.userConProfileIdChanged}
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
    const statusDescription = [];
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

    let ticketingControls = null;

    if (this.state.teamMember.id) {
      statusDescription.push(this.state.teamMember.user_con_profile.name_without_nickname);

      const existingTicket = this.state.teamMember.user_con_profile.ticket

      if (existingTicket) {
        statusDescription.push(` has a ${humanize(existingTicket.ticket_type.name).toLowerCase()} ticket`);
        if (existingTicket.provided_by_event) {
          statusDescription.push(` provided by ${existingTicket.provided_by_event.title}`);
        }
      } else {
        statusDescription.push((
          <span key="unticketed-warning">
            <span className="text-danger"> is unticketed for {this.props.data.convention.name}.</span>
            {' '}
              Without a ticket, users cannot sign up for events at the convention
          </span>
        ));

        const providableTicketTypeDescriptions = providableTicketTypes.map((ticketType) => {
          const remaining = (
            ticketType.maximum_event_provided_tickets -
            providedTicketCountByType[ticketType.id]
          );

          return pluralizeWithCount(`${humanize(ticketType.name).toLowerCase()} ticket`, remaining);
        });

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
              onClick={() => { this.provideEventTicketForExistingTeamMember(ticketType.id); }}
              disabled={this.state.requestInProgress}
            >
              Provide {humanize(ticketType.name).toLowerCase()} ticket
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

      statusDescription.push('.');
    } else {
      // TODO figure out how to handle ticketed users in the case of a new team member
    }

    return (
      <section className="card bg-light my-4">
        <div className="card-body">
          <h5 className="mb-3">Ticketing</h5>

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

      {this.renderSubmitSection()}
    </form>
  )
}

export default TeamMemberForm;
