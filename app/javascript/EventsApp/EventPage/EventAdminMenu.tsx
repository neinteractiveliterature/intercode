import { pluralize } from 'inflected';
import { Link } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import buildEventUrl from '../buildEventUrl';
import { useEventPageQuery } from './queries.generated';
import { LoadQueryWithVariablesWrapper } from '../../GraphqlLoadingWrappers';

export type EventAdminMenuProps = {
  eventId: number;
};

export default LoadQueryWithVariablesWrapper(
  useEventPageQuery,
  ({ eventId }: EventAdminMenuProps) => ({ eventId }),
  function EventAdminMenu({ data }) {
    const { t } = useTranslation();

    const { currentAbility } = data;
    const event = data.convention.event;
    const eventPath = buildEventUrl(event);

    if (!currentAbility.can_update_event) {
      return null;
    }

    return (
      <div className="card mb-4">
        <div className="card-header">{t('events.adminMenu.header', 'Event Admin')}</div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <Link to={`${eventPath}/edit`}>{t('events.adminMenu.editLink', 'Edit event')}</Link>
          </li>
          <li className="list-group-item">
            <Link to={`${eventPath}/team_members`}>
              {t('events.adminMenu.editTeamMembersLink', 'Edit {{ teamMemberNamePlural }}', {
                teamMemberNamePlural: pluralize(event.event_category.team_member_name),
              })}
            </Link>
          </li>
          <li className="list-group-item">
            <Link to={`${eventPath}/history`}>
              {t('events.adminMenu.historyLink', 'View edit history')}
            </Link>
          </li>
        </ul>
      </div>
    );
  },
);
