import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { humanize, titleize, underscore } from 'inflected';
import { useHistory } from 'react-router-dom';

import buildTeamMemberInput from './buildTeamMemberInput';
import { CreateTeamMember } from './mutations.gql';
import ErrorDisplay from '../../ErrorDisplay';
import TeamMemberForm from './TeamMemberForm';
import { TeamMembersQuery, TeamMemberUserConProfilesQuery } from './queries.gql';
import UserConProfileSelect from '../../BuiltInFormControls/UserConProfileSelect';
import useUniqueId from '../../useUniqueId';
import useAsyncFunction from '../../useAsyncFunction';
import { useCreateMutation } from '../../MutationUtils';
import usePageTitle from '../../usePageTitle';

function NewTeamMember({ event, eventPath }) {
  const history = useHistory();
  const [teamMember, setTeamMember] = useState({
    user_con_profile: null,
    display_team_member: true,
    show_email: false,
    receive_con_email: true,
    receive_signup_email: 'NON_WAITLIST_SIGNUPS',
  });
  const userConProfileSelectId = useUniqueId('user-con-profile-');
  const [createTeamMember, createError, createInProgress] = useAsyncFunction(
    useCreateMutation(CreateTeamMember, {
      query: TeamMembersQuery,
      queryVariables: { eventId: event.id },
      arrayPath: ['event', 'team_members'],
      newObjectPath: ['createTeamMember', 'team_member'],
    }),
  );

  usePageTitle(`Add ${event.event_category.team_member_name} - ${event.title}`);

  const userConProfileChanged = (userConProfile) => setTeamMember((prevTeamMember) => ({
    ...prevTeamMember,
    user_con_profile: userConProfile,
  }));

  const createClicked = async () => {
    await createTeamMember({
      variables: {
        input: {
          event_id: event.id,
          team_member: buildTeamMemberInput(teamMember),
          user_con_profile_id: teamMember.user_con_profile.id,
        },
      },
      refetchQueries: [
        { query: TeamMembersQuery, variables: { eventId: event.id } },
      ],
      awaitRefetchQueries: true,
    });

    history.replace(`${eventPath}/team_members`);
  };

  return (
    <>
      <h1 className="mb-4">
        {'Add '}
        {titleize(underscore(event.event_category.team_member_name))}
      </h1>

      <div className="form-group">
        <label htmlFor={userConProfileSelectId}>
          {`${humanize(underscore(event.event_category.team_member_name))}`}
          {' '}
          to add
        </label>
        <UserConProfileSelect
          inputId={userConProfileSelectId}
          value={teamMember.user_con_profile}
          onChange={userConProfileChanged}
          disabled={createInProgress}
          userConProfilesQuery={TeamMemberUserConProfilesQuery}
          placeholder={`Type the name of the ${event.event_category.team_member_name} you want to add`}
        />
      </div>

      {
        teamMember.user_con_profile
          ? (
            <>
              <TeamMemberForm
                event={event}
                value={teamMember}
                onChange={setTeamMember}
                disabled={createInProgress}
              />

              <ErrorDisplay graphQLError={createError} />

              <ul className="list-inline mt-4">
                <li className="list-inline-item">
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={createInProgress}
                    onClick={createClicked}
                  >
                    {'Add '}
                    {event.event_category.team_member_name}
                  </button>
                </li>
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

NewTeamMember.propTypes = {
  event: PropTypes.shape({
    title: PropTypes.string.isRequired,
    event_category: PropTypes.shape({
      team_member_name: PropTypes.string.isRequired,
    }).isRequired,
    team_members: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
    })).isRequired,
    id: PropTypes.number.isRequired,
  }).isRequired,
  eventPath: PropTypes.string.isRequired,
};

export default NewTeamMember;
