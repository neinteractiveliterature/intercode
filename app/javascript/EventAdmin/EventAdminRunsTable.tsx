import { Route, Link, Routes } from 'react-router-dom';
import { LoadQueryWrapper } from '@neinteractiveliterature/litform';

import EditRun from './EditRun';
import EventAdminRow from './EventAdminRow';
import usePageTitle from '../usePageTitle';
import buildEventCategoryUrl from './buildEventCategoryUrl';
import useEventAdminCategory from './useEventAdminCategory';
import {
  EventAdminEventsQueryData,
  EventAdminEventsQueryVariables,
  useEventAdminEventsQuery,
} from './queries.generated';
import { useTranslation } from 'react-i18next';

export type EventAdminRunsTableProps = {
  eventCategoryId: string;
};

export default LoadQueryWrapper<EventAdminEventsQueryData, EventAdminEventsQueryVariables, EventAdminRunsTableProps>(
  useEventAdminEventsQuery,
  function EventAdminRunsTable({ eventCategoryId, data }) {
    const [eventCategory, sortedEvents] = useEventAdminCategory(data, eventCategoryId);
    const { t } = useTranslation();

    usePageTitle(
      t('admin.events.eventListPageTitle', '{{ categoryName, capitalize }} events', {
        categoryName: eventCategory?.name,
      }),
    );

    return (
      <div>
        <Link to={`${buildEventCategoryUrl(eventCategory)}/new`} className="btn btn-primary mt-4 mb-2">
          {t('admin.events.newEventLabel', 'Create new {{ categoryName }} event', {
            categoryName: eventCategory?.name,
          })}
        </Link>

        <table className="table table-striped no-top-border">
          <thead>
            <tr>
              <th style={{ minWidth: '200px' }}>{t('admin.events.titleColumn', 'Title')}</th>
              <th>{t('admin.events.durationColumn', 'Duration')}</th>
              <th>{t('admin.events.runsColumn', 'Runs')}</th>
            </tr>
          </thead>
          <tbody>
            {sortedEvents.map((event) => (
              <EventAdminRow event={event} convention={data.convention} key={event.id} />
            ))}
          </tbody>
        </table>

        <Routes>
          <Route
            path={`:eventId/runs/:runId/edit`}
            element={<EditRun events={data.convention.events} convention={data.convention} />}
          />
          <Route
            path={`:eventId/runs/new`}
            element={<EditRun events={data.convention.events} convention={data.convention} />}
          />
        </Routes>
      </div>
    );
  },
);
