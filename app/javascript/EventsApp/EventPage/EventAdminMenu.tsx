import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import capitalize from 'lodash/capitalize';

import buildEventUrl from '../buildEventUrl';
import { EventPageQueryData } from './queries.generated';
import { useContext } from 'react';
import AppRootContext from '../../AppRootContext';
import { TicketMode } from '../../graphqlTypes.generated';
import MenuIcon from '../../NavigationBar/MenuIcon';

export type EventAdminMenuProps = {
  data: EventPageQueryData;
};

export default function EventAdminMenu({ data }: EventAdminMenuProps) {
  const { t } = useTranslation();

  const { ticketMode, ticketName } = useContext(AppRootContext);
  const { currentAbility } = data;
  const event = data.convention.event;
  const eventPath = buildEventUrl(event);

  if (!currentAbility.can_update_event) {
    return null;
  }

  return (
    <div className="card mb-4">
      <div className="card-header">{t('events.adminMenu.header')}</div>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          <Link to={`${eventPath}/edit`}>
            <>
              <MenuIcon icon="bi-pencil-square" colorClass="" /> {t('events.adminMenu.editLink')}
            </>
          </Link>
        </li>
        <li className="list-group-item">
          <Link to={`${eventPath}/team_members`}>
            <>
              <MenuIcon icon="bi-megaphone-fill" colorClass="" />{' '}
              {t('events.adminMenu.editTeamMembersLink', {
                teamMemberNamePlural: event.event_category.teamMemberNamePlural,
              })}
            </>
          </Link>
        </li>
        {ticketMode === TicketMode.TicketPerEvent && (
          <li className="list-group-item">
            <Link to={`${eventPath}/ticket_types`}>
              <>
                <MenuIcon icon="bi-person-badge-fill" colorClass="" />{' '}
                {t('navigation.admin.ticketTypes', {
                  ticketName: capitalize(ticketName ?? 'ticket'),
                })}
              </>
            </Link>
          </li>
        )}
        <li className="list-group-item">
          <Link to={`${eventPath}/history`}>
            <>
              <MenuIcon icon="bi-hourglass-split" colorClass="" /> {t('events.adminMenu.historyLink')}
            </>
          </Link>
        </li>
      </ul>
    </div>
  );
}
