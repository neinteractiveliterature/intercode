import React from 'react';
import PropTypes from 'prop-types';
import { Link, Route } from 'react-router-dom';
import { pluralize } from 'inflected';
import { useQuery } from 'react-apollo-hooks';

import EditRun from './EditRun';
import RecurringEventSection from './RecurringEventSection';
import { EventAdminEventsQuery } from './queries.gql';
import ErrorDisplay from '../ErrorDisplay';
import usePageTitle from '../usePageTitle';
import useEventAdminCategory from './useEventAdminCategory';
import buildEventCategoryUrl from './buildEventCategoryUrl';
import useValueUnless from '../useValueUnless';
import PageLoadingIndicator from '../PageLoadingIndicator';

function RecurringEventAdmin({ eventCategoryId }) {
  const { data, loading, error } = useQuery(EventAdminEventsQuery);
  const [eventCategory, sortedEvents] = useEventAdminCategory(data, loading, error, eventCategoryId);

  usePageTitle(useValueUnless(() => pluralize(eventCategory.name), error || loading));

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <div>
      <Link className="btn btn-primary mt-4" to={`${buildEventCategoryUrl(eventCategory)}/new`}>
        {'Create new '}
        {eventCategory.name.toLowerCase()}
      </Link>
      <hr className="my-4" />
      {sortedEvents.map((event) => (
        <RecurringEventSection
          convention={data.convention}
          event={event}
          key={event.id}
        />
      ))}
      <Route path={`${buildEventCategoryUrl(eventCategory)}/:eventId/runs/:runId/edit`}>
        {(props) => (
          <EditRun {...props} events={data.events} convention={data.convention} />
        )}
      </Route>
    </div>
  );
}

RecurringEventAdmin.propTypes = {
  eventCategoryId: PropTypes.number.isRequired,
};

export default RecurringEventAdmin;
