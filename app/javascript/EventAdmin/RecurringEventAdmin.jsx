import React from 'react';
import PropTypes from 'prop-types';
import { Link, Route } from 'react-router-dom';
import { pluralize } from 'inflected';

import EditRun from './EditRun';
import RecurringEventSection from './RecurringEventSection';
import { EventAdminEventsQuery } from './queries.gql';
import useQuerySuspended from '../useQuerySuspended';
import ErrorDisplay from '../ErrorDisplay';
import usePageTitle from '../usePageTitle';
import useEventAdminCategory from './useEventAdminCategory';
import buildEventCategoryUrl from './buildEventCategoryUrl';
import useValueUnless from '../useValueUnless';

function RecurringEventAdmin({ eventCategoryId }) {
  const { data, error } = useQuerySuspended(EventAdminEventsQuery);
  const [eventCategory, sortedEvents] = useEventAdminCategory(data, error, eventCategoryId);

  usePageTitle(useValueUnless(() => pluralize(eventCategory.name), error));

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
      {sortedEvents.map(event => (
        <RecurringEventSection
          convention={data.convention}
          event={event}
          key={event.id}
        />
      ))}
      <Route path={`${buildEventCategoryUrl(eventCategory)}/:eventId/runs/:runId/edit`}>
        {props => (
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
