import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { titleize, underscore } from 'inflected';
import { useMutation } from '@apollo/react-hooks';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import buildTeamMemberInput from './buildTeamMemberInput';
import ErrorDisplay from '../../ErrorDisplay';
import TeamMemberForm from './TeamMemberForm';
import { UpdateTeamMember } from './mutations.gql';
import useAsyncFunction from '../../useAsyncFunction';
import usePageTitle from '../../usePageTitle';

function EditTeamMember({ event, eventPath }) {
  const { t } = useTranslation();
  const teamMemberId = Number.parseInt(useParams().teamMemberId, 10);
  const history = useHistory();
  const [teamMember, setTeamMember] = useState(
    event.team_members.find((tm) => tm.id === teamMemberId),
  );
  const [updateMutate] = useMutation(UpdateTeamMember);
  const [update, updateError, updateInProgress] = useAsyncFunction(updateMutate);

  usePageTitle(
    t(
      'events.teamMemberAdmin.editPageTitle',
      'Editing {{ teamMemberName }} “{{ name }}” - {{ eventTitle }}',
      {
        teamMemberName: event.event_category.team_member_name,
        name: teamMember.user_con_profile.name_without_nickname,
        eventTitle: event.title,
      },
    ),
  );

  const updateClicked = async () => {
    await update({
      variables: {
        input: {
          id: teamMember.id,
          team_member: buildTeamMemberInput(teamMember),
        },
      },
    });

    history.replace(`${eventPath}/team_members`);
  };

  return (
    <>
      <h1 className="mb-4">
        {t(
          'events.teamMemberAdmin.editHeader',
          '{{ teamMemberName }} Settings for {{ name }}',
          {
            teamMemberName: titleize(underscore(event.event_category.team_member_name)),
            name: teamMember.user_con_profile.name_without_nickname,
          },
        )}
      </h1>

      <dl className="row">
        <dt className="col-md-3">{t('events.teamMemberAdmin.emailLabel', 'Email')}</dt>
        <dd className="col-md-9">
          <a href={`mailto:${teamMember.user_con_profile.email}`}>
            {teamMember.user_con_profile.email}
          </a>
        </dd>

        <dt className="col-md-3">{t('events.teamMemberAdmin.mobilePhoneLabel', 'Mobile phone')}</dt>
        <dd className="col-md-9">
          <a href={`tel:${teamMember.user_con_profile.mobile_phone}`}>
            {teamMember.user_con_profile.mobile_phone}
          </a>
        </dd>
      </dl>

      <TeamMemberForm
        event={event}
        value={teamMember}
        onChange={setTeamMember}
        disabled={updateInProgress}
      />

      <ErrorDisplay graphQLError={updateError} />

      <ul className="list-inline mt-4">
        <li className="list-inline-item">
          <button
            type="button"
            className="btn btn-primary"
            disabled={updateInProgress}
            onClick={updateClicked}
          >
            {t(
              'events.teamMemberAdmin.updateButton',
              'Update {{ teamMemberName }}',
              { teamMemberName: event.event_category.team_member_name },
            )}
          </button>
        </li>
      </ul>
    </>
  );
}

EditTeamMember.propTypes = {
  event: PropTypes.shape({
    title: PropTypes.string.isRequired,
    event_category: PropTypes.shape({
      team_member_name: PropTypes.string.isRequired,
    }).isRequired,
    team_members: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
    })).isRequired,
  }).isRequired,
  eventPath: PropTypes.string.isRequired,
};

export default EditTeamMember;
