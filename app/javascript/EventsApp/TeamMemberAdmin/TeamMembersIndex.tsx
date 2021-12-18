import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  useModal,
  ErrorDisplay,
  useConfirm,
  sortByLocaleString,
  useDeleteMutationWithReferenceArrayUpdater,
  LoadQueryWrapper,
} from '@neinteractiveliterature/litform';
import capitalize from 'lodash/capitalize';

import Checkmark from './Checkmark';
import ProvideTicketModal from './ProvideTicketModal';
import usePageTitle from '../../usePageTitle';
import { TeamMembersQueryData } from './queries.generated';
import { DropdownMenu } from '../../UIComponents/DropdownMenu';
import { useDeleteTeamMemberMutation } from './mutations.generated';
import humanize from '../../humanize';
import useTeamMembersQueryFromParams from './useTeamMembersQueryFromParams';
import buildEventUrl from '../buildEventUrl';

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
  const [deleteTeamMember] = useDeleteMutationWithReferenceArrayUpdater(
    useDeleteTeamMemberMutation,
    event,
    'team_members',
    (teamMember) => ({ input: { id: teamMember.id } }),
  );

  return (
    <DropdownMenu
      buttonClassName="btn btn-sm btn-primary"
      buttonContent={
        <>
          <i className="bi-three-dots" />
          <span className="visually-hidden">{t('buttons.options', 'Options')}</span>
        </>
      }
      popperOptions={{ placement: 'bottom-end' }}
    >
      <>
        <Link to={`${eventPath}/team_members/${teamMember.id}`} className="dropdown-item">
          {t('events.teamMemberAdmin.editSettingsLink', 'Edit {{ teamMemberName }} settings', {
            teamMemberName: event.event_category.team_member_name,
          })}
        </Link>
        {event.event_category.can_provide_tickets && convention.ticket_mode !== 'disabled' ? (
          <button className="dropdown-item cursor-pointer" onClick={openProvideTicketModal} type="button">
            {t('events.teamMemberAdmin.provideTicketLink', 'Provide {{ ticketName }}', {
              ticketName: convention.ticket_name,
            })}
          </button>
        ) : null}
        <button
          className="dropdown-item cursor-pointer text-danger"
          type="button"
          onClick={() =>
            confirm({
              prompt: t(
                'events.teamMemberAdmin.removeTeamMemberPrompt',
                'Are you sure you want to remove {{ name }} as a {{ teamMemberName }}?',
                {
                  name: teamMember.user_con_profile.name_without_nickname,
                  teamMemberName: event.event_category.team_member_name,
                },
              ),
              action: () => deleteTeamMember(teamMember),
              renderError: (error) => <ErrorDisplay graphQLError={error} />,
            })
          }
        >
          {t('events.teamMemberAdmin.removeTeamMemberLink', 'Remove {{ teamMemberName }}', {
            teamMemberName: event.event_category.team_member_name,
          })}
        </button>
      </>
    </DropdownMenu>
  );
}

export default LoadQueryWrapper(useTeamMembersQueryFromParams, function TeamMembersIndex({ data }): JSX.Element {
  const { t } = useTranslation();
  const modal = useModal<{ teamMember: TeamMembersQueryData['convention']['event']['team_members'][0] }>();

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
        {t('events.teamMemberAdmin.header', '{{ teamMemberName }} for {{ eventTitle }}', {
          teamMemberName: titleizedTeamMemberName,
          eventTitle: event.title,
        })}
      </h1>

      {event.team_members.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>{t('events.teamMemberAdmin.nameHeader', 'Name')}</th>
                <th>
                  {t('events.teamMemberAdmin.displayHeader', 'Display as {{ teamMemberName }}', {
                    teamMemberName: event.event_category.team_member_name,
                  })}
                </th>
                <th>{t('events.teamMemberAdmin.displayEmailHeader', 'Display email address')}</th>
                <th>{t('events.teamMemberAdmin.receiveConEmailHeader', 'Receive email from con')}</th>
                <th>{t('events.teamMemberAdmin.receiveSignupEmailHeader', 'Receive email on signup or withdrawal')}</th>
                {convention.ticket_mode !== 'disabled' && (
                  <th>
                    {t('events.teamMemberAdmin.hasEventTicketHeader', '{{ ticketName }} from this event', {
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
                      openProvideTicketModal={() => modal.open({ teamMember })}
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
          {t('events.teamMemberAdmin.addTeamMemberButton', 'Add {{ teamMemberName }}', {
            teamMemberName: event.event_category.team_member_name,
          })}
        </Link>
      </p>

      <ProvideTicketModal
        visible={modal.visible}
        onClose={modal.close}
        event={event}
        convention={convention}
        teamMember={modal.state?.teamMember}
      />
    </>
  );
});
