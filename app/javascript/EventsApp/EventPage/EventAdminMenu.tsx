import { pluralize } from 'inflected';
import { Link } from 'react-router-dom';
import { LoadingIndicator, ErrorDisplay } from '@neinteractiveliterature/litform';

import { useTranslation } from 'react-i18next';
import buildEventUrl from '../buildEventUrl';
import { useEventPageQuery } from './queries.generated';

export type EventAdminMenuProps = {
  eventId: number;
};

function EventAdminMenu({ eventId }: EventAdminMenuProps) {
  const { t } = useTranslation();
  const { data, loading, error } = useEventPageQuery({ variables: { eventId } });

  if (loading) {
    return <LoadingIndicator iconSet="bootstrap-icons" />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const { currentAbility, event } = data!;
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
}

export default EventAdminMenu;
