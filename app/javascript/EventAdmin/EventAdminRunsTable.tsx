import { Link } from 'react-router-dom';

import EventAdminRow from './EventAdminRow';
import usePageTitle from '../usePageTitle';
import useEventAdminCategory from './useEventAdminCategory';
import { useTranslation } from 'react-i18next';
import { useEventAdminEventsLoader } from './loaders';

export type EventAdminRunsTableProps = {
  eventCategoryId: string;
};

export default function EventAdminRunsTable({ eventCategoryId }: EventAdminRunsTableProps) {
  const data = useEventAdminEventsLoader();
  const [eventCategory, sortedEvents] = useEventAdminCategory(data, eventCategoryId);
  const { t } = useTranslation();

  usePageTitle(
    t('admin.events.eventListPageTitle', {
      categoryName: eventCategory?.name,
    }),
  );

  return (
    <div>
      <Link to={`./events/new`} className="btn btn-primary mt-4 mb-2">
        {t('admin.events.newEventLabel', {
          categoryName: eventCategory?.name,
        })}
      </Link>
      <table className="table table-striped no-top-border">
        <thead>
          <tr>
            <th style={{ minWidth: '200px' }}>{t('admin.events.titleColumn')}</th>
            <th>{t('admin.events.durationColumn')}</th>
            <th>{t('admin.events.runsColumn')}</th>
          </tr>
        </thead>
        <tbody>
          {sortedEvents.map((event) => (
            <EventAdminRow event={event} convention={data.convention} key={event.id} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
