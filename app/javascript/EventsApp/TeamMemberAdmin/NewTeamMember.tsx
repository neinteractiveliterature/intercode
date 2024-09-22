import { useId, useState } from 'react';
import { ActionFunction, Form, redirect, useNavigation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ErrorDisplay } from '@neinteractiveliterature/litform';
import capitalize from 'lodash/capitalize';

import TeamMemberForm, { buildTeamMemberInputFromFormData } from './TeamMemberForm';
import UserConProfileSelect from '../../BuiltInFormControls/UserConProfileSelect';
import usePageTitle from '../../usePageTitle';
import {
  TeamMembersQueryData,
  TeamMembersQueryDocument,
  TeamMemberUserConProfilesQueryDocument,
} from './queries.generated';
import { ReceiveSignupEmail } from '../../graphqlTypes.generated';
import { useTeamMembersLoader } from './loader';
import { client } from '../../useIntercodeApolloClient';
import { CreateTeamMemberDocument } from './mutations.generated';

export const action: ActionFunction = async ({ params: { eventId }, request }) => {
  const formData = await request.formData();
  await client.mutate({
    mutation: CreateTeamMemberDocument,
    variables: {
      input: {
        eventId,
        userConProfileId: formData.get('userConProfileId') as string | null,
        team_member: buildTeamMemberInputFromFormData(formData),
      },
    },
    refetchQueries: [{ query: TeamMembersQueryDocument, variables: { eventId } }],
    awaitRefetchQueries: true,
  });
  return redirect(`/events/${eventId}/team_members`);
};

function NewTeamMember(): JSX.Element {
  const navigation = useNavigation();
  const data = useTeamMembersLoader();
  const event = data.convention.event;
  const { t } = useTranslation();
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

  const createInProgress = navigation.state !== 'idle';
  const createError = undefined;

  return (
    <Form method="POST" action=".">
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
          name="userConProfileId"
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

          <ErrorDisplay graphQLError={createError} />

          <ul className="list-inline mt-4">
            <li className="list-inline-item">
              <button type="submit" className="btn btn-primary" disabled={createInProgress}>
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
    </Form>
  );
}

export const Component = NewTeamMember;
