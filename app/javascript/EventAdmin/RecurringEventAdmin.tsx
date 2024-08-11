import { Link } from 'react-router-dom';
import { LoadQueryWrapper } from '@neinteractiveliterature/litform';

import RecurringEventSection from './RecurringEventSection';
import usePageTitle from '../usePageTitle';
import useEventAdminCategory from './useEventAdminCategory';
import buildEventCategoryUrl from './buildEventCategoryUrl';
import {
  EventAdminEventsQueryData,
  EventAdminEventsQueryVariables,
  useEventAdminEventsQuery,
} from './queries.generated';
import { useTranslation } from 'react-i18next';

export type RecurringEventAdminProps = {
  eventCategoryId: string;
};

export default LoadQueryWrapper<EventAdminEventsQueryData, EventAdminEventsQueryVariables, RecurringEventAdminProps>(
  useEventAdminEventsQuery,
  function RecurringEventAdmin({ data, eventCategoryId }): JSX.Element {
    const [eventCategory, sortedEvents] = useEventAdminCategory(data, eventCategoryId);
    const { t } = useTranslation();

    usePageTitle(
      t('admin.events.eventListPageTitle', {
        categoryName: eventCategory?.name,
      }),
    );

    return (
      <div>
        <Link className="btn btn-primary mt-4" to={`${buildEventCategoryUrl(eventCategory)}/new`}>
          {t('admin.events.newEventLabel', {
            categoryName: eventCategory?.name,
          })}
        </Link>
        <hr className="my-4" />
        {sortedEvents.map((event) => (
          <RecurringEventSection convention={data.convention} event={event} key={event.id} />
        ))}
      </div>
    );
  },
);
