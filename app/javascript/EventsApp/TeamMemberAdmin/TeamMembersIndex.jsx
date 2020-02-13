import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  humanize, pluralize, titleize, underscore,
} from 'inflected';
import { useQuery } from 'react-apollo-hooks';
import { Link } from 'react-router-dom';

import Checkmark from './Checkmark';
import { useConfirm } from '../../ModalDialogs/Confirm';
import PopperDropdown from '../../UIComponents/PopperDropdown';
import ProvideTicketModal from './ProvideTicketModal';
import { sortByLocaleString } from '../../ValueUtils';
import { TeamMembersQuery } from './queries.gql';
import usePageTitle from '../../usePageTitle';
import useValueUnless from '../../useValueUnless';
import useModal from '../../ModalDialogs/useModal';
import ErrorDisplay from '../../ErrorDisplay';
import { useDeleteMutation } from '../../MutationUtils';
import { DeleteTeamMember } from './mutations.gql';
import PageLoadingIndicator from '../../PageLoadingIndicator';

function sortTeamMembers(teamMembers) {
  return sortByLocaleString(teamMembers, (teamMember) => teamMember.user_con_profile.name_inverted);
}

function TeamMemberActionMenu({
  event, convention, teamMember, openProvideTicketModal, eventPath,
}) {
  const confirm = useConfirm();
  const deleteTeamMember = useDeleteMutation(DeleteTeamMember, {
    query: TeamMembersQuery,
    queryVariables: { eventId: event.id },
    variables: { input: { id: teamMember.id } },
    idVariablePath: ['input', 'id'],
    arrayPath: ['event', 'team_members'],
  });

  return (
    <PopperDropdown
      renderReference={({ ref, toggle }) => (
        <button type="button" className="btn btn-sm btn-primary" ref={ref} onClick={toggle}>
          <i className="fa fa-ellipsis-h" />
          <span className="sr-only">Options</span>
        </button>
      )}
    >
      <Link to={`${eventPath}/team_members/${teamMember.id}`} className="dropdown-item">
        {'Edit '}
        {event.event_category.team_member_name}
        {' settings'}
      </Link>
      {
        event.event_category.can_provide_tickets && convention.ticket_mode !== 'disabled'
          ? (
            <button
              className="dropdown-item cursor-pointer"
              onClick={openProvideTicketModal}
              type="button"
            >
              {'Provide '}
              {convention.ticket_name}
            </button>
          )
          : null
      }
      <button
        className="dropdown-item cursor-pointer text-danger"
        type="button"
        onClick={() => confirm({
          prompt: `Are you sure you want to remove ${teamMember.user_con_profile.name_without_nickname} as a ${event.event_category.team_member_name}?`,
          action: deleteTeamMember,
          renderError: (error) => <ErrorDisplay graphQLError={error} />,
        })}
      >
        {'Remove '}
        {event.event_category.team_member_name}
      </button>
    </PopperDropdown>
  );
}

TeamMemberActionMenu.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
    event_category: PropTypes.shape({
      can_provide_tickets: PropTypes.bool.isRequired,
      team_member_name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  convention: PropTypes.shape({
    ticket_mode: PropTypes.string.isRequired,
    ticket_name: PropTypes.string.isRequired,
  }).isRequired,
  teamMember: PropTypes.shape({
    id: PropTypes.number.isRequired,
    user_con_profile: PropTypes.shape({
      name_without_nickname: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  openProvideTicketModal: PropTypes.func.isRequired,
  eventPath: PropTypes.string.isRequired,
};

function TeamMembersIndex({ eventId, eventPath }) {
  const { data, loading, error } = useQuery(TeamMembersQuery, { variables: { eventId } });
  const modal = useModal();

  const titleizedTeamMemberName = useMemo(
    () => (error || loading
      ? null
      : pluralize(titleize(underscore(data.event.event_category.team_member_name)))),
    [error, loading, data],
  );

  const sortedTeamMembers = useMemo(
    () => (error || loading ? null : sortTeamMembers(data.event.team_members)),
    [data, error, loading],
  );

  usePageTitle(
    useValueUnless(() => `${titleizedTeamMemberName} - ${data.event.title}`, error || loading),
  );

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const { convention, event } = data;

  return (
    <>
      <h1 className="mb-4">
        {titleizedTeamMemberName}
        {' for '}
        {event.title}
      </h1>

      {
        event.team_members.length > 0
          ? (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>
                      {'Display as '}
                      {event.event_category.team_member_name}
                    </th>
                    <th>Display email address</th>
                    <th>Receive email from con</th>
                    <th>Receive email on signup or withdrawal</th>
                    {
                      convention.ticket_mode !== 'disabled' && (
                        <th>
                          {titleize(convention.ticket_name)}
                          {' from this event'}
                        </th>
                      )
                    }
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {sortedTeamMembers.map((teamMember) => (
                    <tr key={teamMember.id}>
                      <td>
                        {teamMember.user_con_profile.name_inverted}
                      </td>
                      <td><Checkmark value={teamMember.display_team_member} /></td>
                      <td><Checkmark value={teamMember.show_email} /></td>
                      <td><Checkmark value={teamMember.receive_con_email} /></td>
                      <td>
                        {humanize(teamMember.receive_signup_email)}
                      </td>
                      {
                        convention.ticket_mode !== 'disabled' && (
                          <td>
                            <Checkmark
                              value={event.provided_tickets.some((ticket) => (
                                ticket.user_con_profile.id
                                  === teamMember.user_con_profile.id
                              ))}
                            />
                          </td>
                        )
                      }
                      <td>
                        <TeamMemberActionMenu
                          event={event}
                          convention={convention}
                          teamMember={teamMember}
                          openProvideTicketModal={() => modal.open({ teamMember })}
                          eventPath={eventPath}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
          : null
      }
      <p>
        <Link to={`${eventPath}/team_members/new`} className="btn btn-primary">
          {'Add '}
          {event.event_category.team_member_name}
        </Link>
      </p>

      <ProvideTicketModal
        visible={modal.visible}
        onClose={modal.close}
        event={event}
        convention={convention}
        teamMember={(modal.state || {}).teamMember}
      />
    </>
  );
}

TeamMembersIndex.propTypes = {
  eventId: PropTypes.number.isRequired,
  eventPath: PropTypes.string.isRequired,
};

export default TeamMembersIndex;
