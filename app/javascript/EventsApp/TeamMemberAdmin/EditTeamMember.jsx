import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { titleize, underscore } from 'inflected';
import { useMutation } from '@apollo/react-hooks';

import buildTeamMemberInput from './buildTeamMemberInput';
import ErrorDisplay from '../../ErrorDisplay';
import TeamMemberForm from './TeamMemberForm';
import { UpdateTeamMember } from './mutations.gql';
import useAsyncFunction from '../../useAsyncFunction';
import usePageTitle from '../../usePageTitle';

function EditTeamMember({
  event, eventPath, teamMemberId, history,
}) {
  const [teamMember, setTeamMember] = useState(
    event.team_members.find((tm) => tm.id === teamMemberId),
  );
  const [updateMutate] = useMutation(UpdateTeamMember);
  const [update, updateError, updateInProgress] = useAsyncFunction(updateMutate);

  usePageTitle(
    `Editing ${event.event_category.team_member_name} “${teamMember.user_con_profile.name_without_nickname}” - ${event.title}`,
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
        {titleize(underscore(event.event_category.team_member_name))}
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

        <dt className="col-md-3">Mobile phone</dt>
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
            {'Update '}
            {event.event_category.team_member_name}
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
  convention: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  eventPath: PropTypes.string.isRequired,
  teamMemberId: PropTypes.number.isRequired,
  history: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

export default EditTeamMember;
