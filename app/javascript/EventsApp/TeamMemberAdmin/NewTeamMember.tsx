import { useState } from 'react';
import { humanize, titleize, underscore } from 'inflected';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ApolloError } from '@apollo/client';

import buildTeamMemberInput from './buildTeamMemberInput';
import { CreateTeamMember } from './mutations';
import ErrorDisplay from '../../ErrorDisplay';
import TeamMemberForm from './TeamMemberForm';
import { TeamMembersQuery, TeamMemberUserConProfilesQuery } from './queries';
import UserConProfileSelect from '../../BuiltInFormControls/UserConProfileSelect';
import useUniqueId from '../../useUniqueId';
import useAsyncFunction from '../../useAsyncFunction';
import { useCreateMutation } from '../../MutationUtils';
import usePageTitle from '../../usePageTitle';
import { TeamMembersQueryData } from './queries.generated';
import { ReceiveSignupEmail } from '../../graphqlTypes.generated';

export type NewTeamMemberProps = {
  event: TeamMembersQueryData['event'];
  eventPath: string;
};

function NewTeamMember({ event, eventPath }: NewTeamMemberProps) {
  const { t } = useTranslation();
  const history = useHistory();
  const [teamMember, setTeamMember] = useState<
    Partial<TeamMembersQueryData['event']['team_members'][0]>
  >({
    user_con_profile: undefined,
    display_team_member: true,
    show_email: false,
    receive_con_email: true,
    receive_signup_email: ReceiveSignupEmail.NonWaitlistSignups,
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

  usePageTitle(
    t('events.teamMemberAdmin.newPageTitle', 'Add {{ teamMemberName }} - {{ eventTitle }}', {
      teamMemberName: event.event_category.team_member_name,
      eventTitle: event.title,
    }),
  );

  const userConProfileChanged = (userConProfile: typeof teamMember['user_con_profile']) =>
    setTeamMember((prevTeamMember) => ({
      ...prevTeamMember,
      user_con_profile: userConProfile,
    }));

  const createClicked = async () => {
    await createTeamMember({
      variables: {
        input: {
          event_id: event.id,
          team_member: buildTeamMemberInput(
            teamMember as TeamMembersQueryData['event']['team_members'][0],
          ),
          user_con_profile_id: teamMember.user_con_profile!.id,
        },
      },
    });

    history.replace(`${eventPath}/team_members`);
  };

  return (
    <>
      <h1 className="mb-4">
        {t('events.teamMemberAdmin.newHeader', 'Add {{ teamMemberName }}', {
          teamMemberName: titleize(underscore(event.event_category.team_member_name)),
        })}
      </h1>

      <div className="form-group">
        <label htmlFor={userConProfileSelectId}>
          {t('events.teamMemberAdmin.userConProfileLabel', '{{ teamMemberName }} to add', {
            teamMemberName: humanize(underscore(event.event_category.team_member_name)),
          })}
        </label>
        <UserConProfileSelect
          inputId={userConProfileSelectId}
          value={teamMember.user_con_profile}
          onChange={userConProfileChanged}
          disabled={createInProgress}
          userConProfilesQuery={TeamMemberUserConProfilesQuery}
          placeholder={t(
            'events.teamMemberAdmin.userConProfilePlaceholder',
            'Type the name of the {{ teamMemberName }} you want to add',
            { teamMemberName: event.event_category.team_member_name },
          )}
        />
      </div>

      {teamMember.user_con_profile ? (
        <>
          <TeamMemberForm
            event={event}
            value={teamMember}
            onChange={setTeamMember}
            disabled={createInProgress}
          />

          <ErrorDisplay graphQLError={createError as ApolloError} />

          <ul className="list-inline mt-4">
            <li className="list-inline-item">
              <button
                type="button"
                className="btn btn-primary"
                disabled={createInProgress}
                onClick={createClicked}
              >
                {t('events.teamMemberAdmin.addButton', 'Add {{ teamMemberName }}', {
                  teamMemberName: event.event_category.team_member_name,
                })}
              </button>
            </li>
          </ul>
        </>
      ) : (
        <p>
          {t('events.teamMemberAdmin.selectUserConProfilePrompt', 'Select a person to continue.')}
        </p>
      )}
    </>
  );
}

export default NewTeamMember;
