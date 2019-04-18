import React from 'react';
import PropTypes from 'prop-types';
import {
  humanize, pluralize, titleize, underscore,
} from 'inflected';
import { Link, withRouter } from 'react-router-dom';

import Checkmark from './Checkmark';
import Confirm from '../../ModalDialogs/Confirm';
import DeleteTeamMemberControl from './DeleteTeamMemberControl';
import ModalContainer from '../../ModalDialogs/ModalContainer';
import PopperDropdown from '../../UIComponents/PopperDropdown';
import ProvideTicketModal from './ProvideTicketModal';
import QueryWithStateDisplay from '../../QueryWithStateDisplay';
import { sortByLocaleString } from '../../ValueUtils';
import { TeamMembersQuery } from './queries.gql';

function sortTeamMembers(teamMembers) {
  return sortByLocaleString(teamMembers, teamMember => teamMember.user_con_profile.name_inverted);
}

function TeamMembersIndex({ eventId, eventPath, history }) {
  return (
    <ModalContainer>
      {({
        modalVisible, openModal, closeModal, modalState,
      }) => (
        <QueryWithStateDisplay query={TeamMembersQuery} variables={{ eventId }}>
          {({ data: { convention, event } }) => (
            <>
              <h1>
                {pluralize(titleize(underscore(event.event_category.team_member_name)))}
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
                          {sortTeamMembers(event.team_members).map(teamMember => (
                            <tr key={teamMember.id}>
                              <td>
                                {teamMember.user_con_profile.name_inverted}
                              </td>
                              <td><Checkmark value={teamMember.display} /></td>
                              <td><Checkmark value={teamMember.show_email} /></td>
                              <td><Checkmark value={teamMember.receive_con_email} /></td>
                              <td>
                                {humanize(teamMember.receive_signup_email)}
                              </td>
                              {
                                convention.ticket_mode !== 'disabled' && (
                                  <td>
                                    <Checkmark
                                      value={event.provided_tickets.some(ticket => (
                                        ticket.user_con_profile.id
                                          === teamMember.user_con_profile.id
                                      ))}
                                    />
                                  </td>
                                )
                              }
                              <td>
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
                                          onClick={() => openModal({ teamMember })}
                                          type="button"
                                        >
                                          {'Provide '}
                                          {convention.ticket_name}
                                        </button>
                                      )
                                      : null
                                  }
                                  <DeleteTeamMemberControl event={event} teamMember={teamMember}>
                                    {deleteTeamMember => (
                                      <Confirm.Trigger>
                                        {confirm => (
                                          <button
                                            className="dropdown-item cursor-pointer text-danger"
                                            type="button"
                                            onClick={() => confirm({
                                              prompt: `Are you sure you want to remove ${teamMember.user_con_profile.name_without_nickname} as a ${event.team_member_name}?`,
                                              action: async () => {
                                                await deleteTeamMember();
                                                history.replace(`${eventPath}/team_members`);
                                              },
                                            })}
                                          >
                                            {'Remove '}
                                            {event.event_category.team_member_name}
                                          </button>
                                        )}
                                      </Confirm.Trigger>
                                    )}
                                  </DeleteTeamMemberControl>
                                </PopperDropdown>
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
                visible={modalVisible}
                onClose={closeModal}
                event={event}
                convention={convention}
                teamMember={(modalState || {}).teamMember}
              />
            </>
          )}
        </QueryWithStateDisplay>
      )}
    </ModalContainer>
  );
}

TeamMembersIndex.propTypes = {
  eventId: PropTypes.number.isRequired,
  eventPath: PropTypes.string.isRequired,
  history: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(TeamMembersIndex);
