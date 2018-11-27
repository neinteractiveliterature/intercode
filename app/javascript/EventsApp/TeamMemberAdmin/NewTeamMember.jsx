import React from 'react';
import PropTypes from 'prop-types';
import { humanize, titleize, underscore } from 'inflected';
import { Mutation } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { enableUniqueIds } from 'react-html-id';

import buildTeamMemberInput from './buildTeamMemberInput';
import { CreateTeamMember } from './mutations.gql';
import ErrorDisplay from '../../ErrorDisplay';
import TeamMemberForm from './TeamMemberForm';
import { TeamMembersQuery, TeamMemberUserConProfilesQuery } from './queries.gql';
import UserConProfileSelect from '../../BuiltInFormControls/UserConProfileSelect';

class NewTeamMember extends React.Component {
  static propTypes = {
    event: PropTypes.shape({
      title: PropTypes.string.isRequired,
      team_member_name: PropTypes.string.isRequired,
      team_members: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
      })).isRequired,
    }).isRequired,
    eventPath: PropTypes.string.isRequired,
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    enableUniqueIds(this);

    this.state = {
      mutationInProgress: false,
      teamMember: {
        user_con_profile: null,
        display: true,
        show_email: true,
        receive_con_email: true,
        receive_signup_email: false,
      },
    };
  }

  onChange = (teamMember) => { this.setState({ teamMember }); }

  render = () => {
    const { event, eventPath } = this.props;
    const { teamMember } = this.state;

    const userConProfileSelectId = this.nextUniqueId();

    return (
      <>
        <h1 className="mb-4">
          {'Add '}
          {titleize(underscore(event.team_member_name))}
        </h1>

        <div className="form-group">
          <label htmlFor={userConProfileSelectId}>
            {`${humanize(underscore(this.props.event.team_member_name))}`}
            {' '}
            to add
          </label>
          <UserConProfileSelect
            inputId={userConProfileSelectId}
            value={this.state.teamMember.user_con_profile}
            onChange={userConProfile => this.setState(prevState => ({
              teamMember: {
                ...prevState.teamMember,
                user_con_profile: userConProfile,
              },
            }))}
            disabled={this.state.mutationInProgress}
            userConProfilesQuery={TeamMemberUserConProfilesQuery}
            placeholder={`Type the name of the ${this.props.event.team_member_name} you want to add`}
          />
        </div>

        {
          this.state.teamMember.user_con_profile
            ? (
              <>
                <TeamMemberForm
                  event={event}
                  value={teamMember}
                  onChange={this.onChange}
                  disabled={this.state.mutationInProgress}
                />

                <ErrorDisplay graphQLError={this.state.error} />

                <ul className="list-inline mt-4">
                  <Mutation mutation={CreateTeamMember}>
                    {mutate => (
                      <li className="list-inline-item">
                        <button
                          type="button"
                          className="btn btn-primary"
                          disabled={this.state.mutationInProgress}
                          onClick={async () => {
                            this.setState({ mutationInProgress: true });
                            try {
                              await mutate({
                                variables: {
                                  input: {
                                    event_id: event.id,
                                    team_member: buildTeamMemberInput(teamMember),
                                    user_con_profile_id: teamMember.user_con_profile.id,
                                  },
                                },
                                update: (
                                  store,
                                  { data: { createTeamMember: { team_member: newTeamMember } } },
                                ) => {
                                  const data = store.readQuery({
                                    query: TeamMembersQuery,
                                    variables: { eventId: event.id },
                                  });
                                  store.writeQuery({
                                    query: TeamMembersQuery,
                                    variables: { eventId: event.id },
                                    data: {
                                      ...data,
                                      event: {
                                        ...data.event,
                                        team_members: [
                                          ...data.event.team_members,
                                          newTeamMember,
                                        ],
                                      },
                                    },
                                  });
                                },
                              });

                              this.props.history.replace(`${eventPath}/team_members`);
                            } catch (error) {
                              this.setState({ error, mutationInProgress: false });
                            }
                          }}
                        >
                          {'Add '}
                          {event.team_member_name}
                        </button>
                      </li>
                    )}
                  </Mutation>
                </ul>
              </>
            )
            : (
              <p>Select a person to continue.</p>
            )
        }
      </>
    );
  }
}

export default withRouter(NewTeamMember);
