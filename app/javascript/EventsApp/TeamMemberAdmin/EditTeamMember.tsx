import { useState } from 'react';
import { Form, redirect, useNavigation } from 'react-router';
import { useTranslation } from 'react-i18next';
import capitalize from 'lodash/capitalize';

import TeamMemberForm, { buildTeamMemberInputFromFormData } from './TeamMemberForm';
import usePageTitle from '../../usePageTitle';
import { TeamMembersQueryData, TeamMembersQueryDocument } from './queries.generated';
import FourOhFourPage from '../../FourOhFourPage';
import { DeleteTeamMemberDocument, UpdateTeamMemberDocument } from './mutations.generated';
import { Route } from './+types/EditTeamMember';
import { loader as indexLoader } from './index';
import { findById } from 'findById';
import { apolloClientContext } from 'AppContexts';

export async function loader({ params, context, request }: Route.LoaderArgs) {
  const data = await indexLoader({ params, context, request });
  return { data, teamMember: findById(data.convention.event.team_members, params.teamMemberId) };
}

export const action = async ({ params: { eventId, teamMemberId }, request, context }: Route.ActionArgs) => {
  if (request.method === 'DELETE') {
    await context.get(apolloClientContext).mutate({
      mutation: DeleteTeamMemberDocument,
      variables: {
        input: {
          id: teamMemberId,
        },
      },
      refetchQueries: [{ query: TeamMembersQueryDocument, variables: { eventId: eventId } }],
      awaitRefetchQueries: true,
    });
  } else {
    const formData = await request.formData();

    await context.get(apolloClientContext).mutate({
      mutation: UpdateTeamMemberDocument,
      variables: {
        input: {
          id: teamMemberId,
          team_member: buildTeamMemberInputFromFormData(formData),
        },
      },
    });
  }

  return redirect(`/events/${eventId}/team_members`);
};

function EditTeamMember({ loaderData: { data, teamMember: initialTeamMember } }: Route.ComponentProps): JSX.Element {
  const navigation = useNavigation();
  const event = data.convention.event;
  const { t } = useTranslation();
  const [teamMember, setTeamMember] = useState(initialTeamMember);

  usePageTitle(
    t('events.teamMemberAdmin.editPageTitle', {
      teamMemberName: event.event_category.team_member_name,
      name: teamMember?.user_con_profile.name_without_nickname,
      eventTitle: event.title,
    }),
  );

  if (!teamMember) {
    return <FourOhFourPage />;
  }

  const updateInProgress = navigation.state !== 'idle';

  return (
    <Form method="PATCH" action=".">
      <h1 className="mb-4">
        {t('events.teamMemberAdmin.editHeader', {
          teamMemberName: capitalize(event.event_category.team_member_name),
          name: teamMember.user_con_profile.name_without_nickname,
        })}
      </h1>
      <dl className="row">
        <dt className="col-md-3">{t('events.teamMemberAdmin.emailLabel')}</dt>
        <dd className="col-md-9">
          <a href={`mailto:${teamMember.user_con_profile.email}`}>{teamMember.user_con_profile.email}</a>
        </dd>

        <dt className="col-md-3">{t('events.teamMemberAdmin.mobilePhoneLabel')}</dt>
        <dd className="col-md-9">
          <a href={`tel:${teamMember.user_con_profile.mobile_phone}`}>{teamMember.user_con_profile.mobile_phone}</a>
        </dd>
      </dl>
      <TeamMemberForm
        event={event}
        value={teamMember}
        onChange={(newValue) =>
          setTeamMember(newValue as TeamMembersQueryData['convention']['event']['team_members'][0])
        }
        disabled={updateInProgress}
      />
      {/* <ErrorDisplay graphQLError={updateError as ApolloError} /> */}
      <ul className="list-inline mt-4">
        <li className="list-inline-item">
          <button type="submit" className="btn btn-primary" disabled={updateInProgress}>
            {t('events.teamMemberAdmin.updateButton', {
              teamMemberName: event.event_category.team_member_name,
            })}
          </button>
        </li>
      </ul>
    </Form>
  );
}

export default EditTeamMember;
