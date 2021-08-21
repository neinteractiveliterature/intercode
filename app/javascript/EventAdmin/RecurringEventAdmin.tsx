import { Link, Route } from 'react-router-dom';
import { pluralize } from 'inflected';
import { ErrorDisplay, PageLoadingIndicator } from '@neinteractiveliterature/litform';

import EditRun from './EditRun';
import RecurringEventSection from './RecurringEventSection';
import usePageTitle from '../usePageTitle';
import useEventAdminCategory from './useEventAdminCategory';
import buildEventCategoryUrl from './buildEventCategoryUrl';
import useValueUnless from '../useValueUnless';
import { useEventAdminEventsQuery } from './queries.generated';

export type RecurringEventAdminProps = {
  eventCategoryId: number;
};

function RecurringEventAdmin({ eventCategoryId }: RecurringEventAdminProps) {
  const { data, loading, error } = useEventAdminEventsQuery();
  const [eventCategory, sortedEvents] = useEventAdminCategory(
    data,
    loading,
    error,
    eventCategoryId,
  );

  usePageTitle(useValueUnless(() => pluralize(eventCategory!.name), error || loading));

  if (loading) {
    return <PageLoadingIndicator visible iconSet="bootstrap-icons" />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <div>
      <Link className="btn btn-primary mt-4" to={`${buildEventCategoryUrl(eventCategory)}/new`}>
        {'Create new '}
        {eventCategory?.name.toLowerCase()}
      </Link>
      <hr className="my-4" />
      {sortedEvents.map((event) => (
        <RecurringEventSection convention={data!.convention} event={event} key={event.id} />
      ))}
      <Route
        path={`${buildEventCategoryUrl(eventCategory)}/:eventId/runs/:runId/edit`}
        render={() => <EditRun events={data!.events} convention={data!.convention} />}
      />
    </div>
  );
}

export default RecurringEventAdmin;
