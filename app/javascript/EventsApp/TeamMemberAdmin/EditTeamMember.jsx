import React from 'react';
import PropTypes from 'prop-types';
import { humanize, titleize, underscore } from 'inflected';
import { Mutation } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import buildTeamMemberInput from './buildTeamMemberInput';
import Confirm from '../../ModalDialogs/Confirm';
import { DeleteTeamMember, UpdateTeamMember } from './mutations.gql';
import TeamMemberForm from './TeamMemberForm';
import { TeamMembersQuery } from './queries.gql';

class EditTeamMember extends React.Component {
  static propTypes = {
    event: PropTypes.shape({
      title: PropTypes.string.isRequired,
      team_member_name: PropTypes.string.isRequired,
      team_members: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
      })).isRequired,
    }).isRequired,
    eventPath: PropTypes.string.isRequired,
    teamMemberId: PropTypes.number.isRequired,
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    const { event, teamMemberId } = props;

    this.state = {
      mutationInProgress: false,
      teamMember: { ...event.team_members.find(tm => tm.id === teamMemberId) },
    };
  }

  onChange = (teamMember) => { this.setState({ teamMember }); }

  render = () => {
    const { event, eventPath } = this.props;
    const { teamMember } = this.state;

    return (
      <>
        <h1 className="mb-4">
          {titleize(underscore(event.team_member_name))}
          {' Settings for '}
          {teamMember.user_con_profile.name_without_nickname}
        </h1>

        <dl className="row">
          <dt className="col-md-3">Email</dt>
          <dd className="col-md-9">
            <a href={`mailto:${teamMember.user_con_profile.email}`}>
              {teamMember.user_con_profile.email}
            </a>
          </dd>

          <dt className="col-md-3">Daytime phone</dt>
          <dd className="col-md-9">
            <a href={`tel:${teamMember.user_con_profile.day_phone}`}>
              {teamMember.user_con_profile.day_phone}
            </a>
          </dd>

          <dt className="col-md-3">Evening phone</dt>
          <dd className="col-md-9">
            <a href={`tel:${teamMember.user_con_profile.evening_phone}`}>
              {teamMember.user_con_profile.evening_phone}
            </a>
          </dd>

          <dt className="col-md-3">Best time to call</dt>
          <dd className="col-md-9">
            {teamMember.user_con_profile.best_call_time}
          </dd>

          <dt className="col-md-3">Preferred contact method</dt>
          <dd className="col-md-9">
            {humanize(teamMember.user_con_profile.preferred_contact || '')}
          </dd>
        </dl>

        <TeamMemberForm
          event={event}
          value={teamMember}
          onChange={this.onChange}
          disabled={this.state.mutationInProgress}
        />

        <ul className="list-inline mt-4">
          <Mutation mutation={UpdateTeamMember}>
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
                            id: teamMember.id,
                            team_member: buildTeamMemberInput(teamMember),
                          },
                        },
                      });

                      this.props.history.replace(`${eventPath}/team_members`);
                    } catch (error) {
                      this.setState({ mutationInProgress: false });
                    }
                  }}
                >
                  {'Update '}
                  {event.team_member_name}
                </button>
              </li>
            )}
          </Mutation>
        </ul>
      </>
    );
  }
}

export default withRouter(EditTeamMember);
