import { useMemo } from 'react';
import { Link, Outlet, useNavigate, useSubmit } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ErrorDisplay, useConfirm, sortByLocaleString } from '@neinteractiveliterature/litform';
import capitalize from 'lodash/capitalize';

import Checkmark from './Checkmark';
import usePageTitle from '../../usePageTitle';
import { TeamMembersQueryData } from './queries.generated';
import { DropdownMenu } from '../../UIComponents/DropdownMenu';
import humanize from '../../humanize';
import buildEventUrl from '../buildEventUrl';
import { useTeamMembersLoader } from './loader';

function sortTeamMembers(teamMembers: TeamMembersQueryData['convention']['event']['team_members']) {
  return sortByLocaleString(teamMembers, (teamMember) => teamMember.user_con_profile.name_inverted ?? '');
}

type TeamMemberActionMenuProps = {
  event: TeamMembersQueryData['convention']['event'];
  convention: NonNullable<TeamMembersQueryData['convention']>;
  teamMember: TeamMembersQueryData['convention']['event']['team_members'][0];
  openProvideTicketModal: () => void;
  eventPath: string;
};

function TeamMemberActionMenu({
  event,
  convention,
  teamMember,
  openProvideTicketModal,
  eventPath,
}: TeamMemberActionMenuProps) {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const submit = useSubmit();

  return (
    <DropdownMenu
      buttonClassName="btn btn-sm btn-primary"
      buttonContent={
        <>
          <i className="bi-three-dots" />
          <span className="visually-hidden">{t('buttons.options')}</span>
        </>
      }
      popperOptions={{ placement: 'bottom-end' }}
    >
      <>
        <Link to={`${eventPath}/team_members/${teamMember.id}`} className="dropdown-item">
          {t('events.teamMemberAdmin.editSettingsLink', {
            teamMemberName: event.event_category.team_member_name,
          })}
        </Link>
        {event.event_category.can_provide_tickets && convention.ticket_mode !== 'disabled' ? (
          <button className="dropdown-item cursor-pointer" onClick={openProvideTicketModal} type="button">
            {t('events.teamMemberAdmin.provideTicketLink', {
              ticketName: convention.ticket_name,
            })}
          </button>
        ) : null}
        <button
          className="dropdown-item cursor-pointer text-danger"
          type="button"
          onClick={() =>
            confirm({
              prompt: t('events.teamMemberAdmin.removeTeamMemberPrompt', {
                name: teamMember.user_con_profile.name_without_nickname,
                teamMemberName: event.event_category.team_member_name,
              }),
              action: () => submit({}, { action: teamMember.id, method: 'DELETE' }),
              renderError: (error) => <ErrorDisplay graphQLError={error} />,
            })
          }
        >
          {t('events.teamMemberAdmin.removeTeamMemberLink', {
            teamMemberName: event.event_category.team_member_name,
          })}
        </button>
      </>
    </DropdownMenu>
  );
}

function TeamMembersIndex(): React.JSX.Element {
  const data = useTeamMembersLoader();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const titleizedTeamMemberName = useMemo(
    () => capitalize(data.convention.event.event_category.teamMemberNamePlural),
    [data.convention.event.event_category.teamMemberNamePlural],
  );

  const sortedTeamMembers = useMemo(
    () => sortTeamMembers(data.convention.event.team_members),
    [data.convention.event.team_members],
  );

  usePageTitle(`${titleizedTeamMemberName} - ${data.convention.event.title}`);

  const { convention } = data;
  const { event } = convention;

  return (
    <>
      <h1 className="mb-4">
        {t('events.teamMemberAdmin.header', {
          teamMemberName: titleizedTeamMemberName,
          eventTitle: event.title,
        })}
      </h1>
      {event.team_members.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>{t('events.teamMemberAdmin.nameHeader')}</th>
                <th>
                  {t('events.teamMemberAdmin.displayHeader', {
                    teamMemberName: event.event_category.team_member_name,
                  })}
                </th>
                <th>{t('events.teamMemberAdmin.displayEmailHeader')}</th>
                <th>{t('events.teamMemberAdmin.receiveConEmailHeader')}</th>
                <th>{t('events.teamMemberAdmin.receiveSignupEmailHeader')}</th>
                {convention.ticket_mode !== 'disabled' && (
                  <th>
                    {t('events.teamMemberAdmin.hasEventTicketHeader', {
                      ticketName: capitalize(convention.ticket_name),
                    })}
                  </th>
                )}
                <th />
              </tr>
            </thead>
            <tbody>
              {sortedTeamMembers?.map((teamMember) => (
                <tr key={teamMember.id}>
                  <td>{teamMember.user_con_profile.name_inverted}</td>
                  <td>
                    <Checkmark value={teamMember.display_team_member} />
                  </td>
                  <td>
                    <Checkmark value={teamMember.show_email} />
                  </td>
                  <td>
                    <Checkmark value={teamMember.receive_con_email} />
                  </td>
                  <td>{humanize(teamMember.receive_signup_email)}</td>
                  {convention.ticket_mode !== 'disabled' && (
                    <td>
                      <Checkmark
                        value={event.provided_tickets.some(
                          (ticket) => ticket.user_con_profile.id === teamMember.user_con_profile.id,
                        )}
                      />
                    </td>
                  )}
                  <td>
                    <TeamMemberActionMenu
                      event={event}
                      convention={convention}
                      teamMember={teamMember}
                      openProvideTicketModal={() => navigate(`${teamMember.id}/provide_ticket`)}
                      eventPath={buildEventUrl(event)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      <p>
        <Link to={`${buildEventUrl(event)}/team_members/new`} className="btn btn-primary">
          {t('events.teamMemberAdmin.addTeamMemberButton', {
            teamMemberName: event.event_category.team_member_name,
          })}
        </Link>
      </p>
      <Outlet />
    </>
  );
}

export const Component = TeamMembersIndex;
