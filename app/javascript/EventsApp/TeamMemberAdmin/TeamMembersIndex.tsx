import { useMemo } from 'react';
import { humanize, pluralize, titleize, underscore } from 'inflected';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  useModal,
  ErrorDisplay,
  useConfirm,
  sortByLocaleString,
  PageLoadingIndicator,
  useDeleteMutationWithReferenceArrayUpdater,
} from '@neinteractiveliterature/litform';

import Checkmark from './Checkmark';
import ProvideTicketModal from './ProvideTicketModal';
import usePageTitle from '../../usePageTitle';
import useValueUnless from '../../useValueUnless';
import { TeamMembersQueryData, useTeamMembersQuery } from './queries.generated';
import { DropdownMenu } from '../../UIComponents/DropdownMenu';
import FourOhFourPage from '../../FourOhFourPage';
import { useDeleteTeamMemberMutation } from './mutations.generated';

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

export type TeamMembersIndexProps = {
  eventId: string;
  eventPath: string;
};

function TeamMembersIndex({ eventId, eventPath }: TeamMembersIndexProps): JSX.Element {
  const { t } = useTranslation();
  const { data, loading, error } = useTeamMembersQuery({ variables: { eventId } });
  const modal = useModal<{ teamMember: TeamMembersQueryData['convention']['event']['team_members'][0] }>();

  const titleizedTeamMemberName = useMemo(
    () =>
      error || loading || !data
        ? null
        : pluralize(titleize(underscore(data.convention.event.event_category.team_member_name))),
    [error, loading, data],
  );

  const sortedTeamMembers = useMemo(
    () => (error || loading || !data ? null : sortTeamMembers(data.convention.event.team_members)),
    [data, error, loading],
  );

  usePageTitle(useValueUnless(() => `${titleizedTeamMemberName} - ${data?.convention.event.title}`, error || loading));

  if (loading) {
    return <PageLoadingIndicator visible iconSet="bootstrap-icons" />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  if (!data) {
    return <FourOhFourPage />;
  }

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
                      ticketName: titleize(convention.ticket_name),
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
                      eventPath={eventPath}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      <p>
        <Link to={`${eventPath}/team_members/new`} className="btn btn-primary">
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
}

export default TeamMembersIndex;
