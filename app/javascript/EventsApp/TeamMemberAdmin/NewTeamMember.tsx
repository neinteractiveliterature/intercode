import { useId, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay, useCreateMutationWithReferenceArrayUpdater } from '@neinteractiveliterature/litform';
import capitalize from 'lodash/capitalize';

import buildTeamMemberInput from './buildTeamMemberInput';
import TeamMemberForm from './TeamMemberForm';
import UserConProfileSelect from '../../BuiltInFormControls/UserConProfileSelect';
import usePageTitle from '../../usePageTitle';
import {
  TeamMemberFieldsFragmentDoc,
  TeamMembersQueryData,
  TeamMemberUserConProfilesQueryDocument,
} from './queries.generated';
import { ReceiveSignupEmail } from '../../graphqlTypes.generated';
import { useCreateTeamMemberMutation } from './mutations.generated';
import buildEventUrl from '../buildEventUrl';
import { useTeamMembersLoader } from './loader';

function NewTeamMember(): JSX.Element {
  const data = useTeamMembersLoader();
  const event = data.convention.event;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [teamMember, setTeamMember] = useState<Partial<TeamMembersQueryData['convention']['event']['team_members'][0]>>(
    {
      user_con_profile: undefined,
      display_team_member: true,
      show_email: false,
      receive_con_email: true,
      receive_signup_email: ReceiveSignupEmail.NonWaitlistSignups,
    },
  );
  const userConProfileSelectId = useId();
  const [createTeamMember, { error: createError, loading: createInProgress }] =
    useCreateMutationWithReferenceArrayUpdater(
      useCreateTeamMemberMutation,
      event,
      'team_members',
      (data) => data.createTeamMember.team_member,
      TeamMemberFieldsFragmentDoc,
      'TeamMemberFields',
    );

  usePageTitle(
    t('events.teamMemberAdmin.newPageTitle', {
      teamMemberName: event.event_category.team_member_name,
      eventTitle: event.title,
    }),
  );

  const userConProfileChanged = (userConProfile: (typeof teamMember)['user_con_profile']) =>
    setTeamMember((prevTeamMember) => ({
      ...prevTeamMember,
      user_con_profile: userConProfile,
    }));

  const createClicked = async () => {
    if (teamMember.user_con_profile) {
      await createTeamMember({
        variables: {
          input: {
            eventId: event.id,
            team_member: buildTeamMemberInput(
              teamMember as TeamMembersQueryData['convention']['event']['team_members'][0],
            ),
            userConProfileId: teamMember.user_con_profile.id,
          },
        },
      });
      navigate(`${buildEventUrl(event)}/team_members`, { replace: true });
    }
  };

  return (
    <>
      <h1 className="mb-4">
        {t('events.teamMemberAdmin.newHeader', {
          teamMemberName: capitalize(event.event_category.team_member_name),
        })}
      </h1>
      <div className="mb-3">
        <label className="form-label" htmlFor={userConProfileSelectId}>
          {t('events.teamMemberAdmin.userConProfileLabel', {
            teamMemberName: capitalize(event.event_category.team_member_name),
          })}
        </label>
        <UserConProfileSelect
          inputId={userConProfileSelectId}
          value={teamMember.user_con_profile}
          onChange={(newValue) => userConProfileChanged(newValue ?? undefined)}
          isDisabled={createInProgress}
          userConProfilesQuery={TeamMemberUserConProfilesQueryDocument}
          placeholder={t('events.teamMemberAdmin.userConProfilePlaceholder', {
            teamMemberName: event.event_category.team_member_name,
          })}
        />
      </div>
      {teamMember.user_con_profile ? (
        <>
          <TeamMemberForm event={event} value={teamMember} onChange={setTeamMember} disabled={createInProgress} />

          <ErrorDisplay graphQLError={createError as ApolloError} />

          <ul className="list-inline mt-4">
            <li className="list-inline-item">
              <button type="button" className="btn btn-primary" disabled={createInProgress} onClick={createClicked}>
                {t('events.teamMemberAdmin.addButton', {
                  teamMemberName: event.event_category.team_member_name,
                })}
              </button>
            </li>
          </ul>
        </>
      ) : (
        <p>{t('events.teamMemberAdmin.selectUserConProfilePrompt')}</p>
      )}
    </>
  );
}

export const Component = NewTeamMember;
