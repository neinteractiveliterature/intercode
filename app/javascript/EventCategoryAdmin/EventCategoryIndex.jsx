import React from 'react';
import { Link } from 'react-router-dom';

import { EventCategoryAdminQuery } from './queries.gql';
import EventCategoryRow from './EventCategoryRow';
import { sortByLocaleString } from '../ValueUtils';
import useQuerySuspended from '../useQuerySuspended';
import ErrorDisplay from '../ErrorDisplay';
import usePageTitle from '../usePageTitle';
import useValueUnless from '../useValueUnless';

function EventCategoryIndex() {
  const { data, error } = useQuerySuspended(EventCategoryAdminQuery);

  usePageTitle('Event Categories', useValueUnless(() => data.convention, error));

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const { event_categories: eventCategories } = data.convention;

  return (
    <>
      <h1 className="mb-4">Event categories</h1>

      <table className="table table-striped">
        <tbody>
          {sortByLocaleString([...eventCategories], eventCategory => eventCategory.name)
            .map(eventCategory => (
              <EventCategoryRow eventCategory={eventCategory} key={eventCategory.id} />
            ))}
        </tbody>
      </table>

      <Link to="/event_categories/new" className="btn btn-primary">
        New event category
      </Link>
    </>
  );
}

export default EventCategoryIndex;
