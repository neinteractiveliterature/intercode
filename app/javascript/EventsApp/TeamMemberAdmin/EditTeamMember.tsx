import { useState } from 'react';
import { ApolloError } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ErrorDisplay, LoadQueryWrapper } from '@neinteractiveliterature/litform';
import capitalize from 'lodash/capitalize';

import buildTeamMemberInput from './buildTeamMemberInput';
import TeamMemberForm from './TeamMemberForm';
import useAsyncFunction from '../../useAsyncFunction';
import usePageTitle from '../../usePageTitle';
import { TeamMembersQueryData } from './queries.generated';
import { useUpdateTeamMemberMutation } from './mutations.generated';
import FourOhFourPage from '../../FourOhFourPage';
import useTeamMembersQueryFromParams from './useTeamMembersQueryFromParams';
import buildEventUrl from '../buildEventUrl';

export default LoadQueryWrapper(useTeamMembersQueryFromParams, function EditTeamMember({ data }): JSX.Element {
  const event = data.convention.event;
  const { t } = useTranslation();
  const { teamMemberId } = useParams<{ teamMemberId: string }>();
  const navigate = useNavigate();
  const [teamMember, setTeamMember] = useState(event.team_members.find((tm) => tm.id === teamMemberId));
  const [updateMutate] = useUpdateTeamMemberMutation();
  const [update, updateError, updateInProgress] = useAsyncFunction(updateMutate);

  usePageTitle(
    t('events.teamMemberAdmin.editPageTitle', {
      teamMemberName: event.event_category.team_member_name,
      name: teamMember?.user_con_profile.name_without_nickname,
      eventTitle: event.title,
    }),
  );

  const updateClicked = async () => {
    if (!teamMember) {
      return;
    }

    await update({
      variables: {
        input: {
          id: teamMember.id,
          team_member: buildTeamMemberInput(teamMember),
        },
      },
    });

    navigate(`${buildEventUrl(event)}/team_members`, { replace: true });
  };

  if (!teamMember) {
    return <FourOhFourPage />;
  }

  return (
    <>
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
      <ErrorDisplay graphQLError={updateError as ApolloError} />
      <ul className="list-inline mt-4">
        <li className="list-inline-item">
          <button type="button" className="btn btn-primary" disabled={updateInProgress} onClick={updateClicked}>
            {t('events.teamMemberAdmin.updateButton', {
              teamMemberName: event.event_category.team_member_name,
            })}
          </button>
        </li>
      </ul>
    </>
  );
});
