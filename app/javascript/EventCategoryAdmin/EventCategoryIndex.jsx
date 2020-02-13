import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-apollo-hooks';

import { EventCategoryAdminQuery } from './queries.gql';
import EventCategoryRow from './EventCategoryRow';
import { sortByLocaleString } from '../ValueUtils';
import ErrorDisplay from '../ErrorDisplay';
import usePageTitle from '../usePageTitle';
import PageLoadingIndicator from '../PageLoadingIndicator';

function EventCategoryIndex() {
  const { data, loading, error } = useQuery(EventCategoryAdminQuery);

  usePageTitle('Event Categories');

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const { event_categories: eventCategories } = data.convention;

  return (
    <>
      <h1 className="mb-4">Event categories</h1>

      <table className="table table-striped">
        <tbody>
          {sortByLocaleString([...eventCategories], (eventCategory) => eventCategory.name)
            .map((eventCategory) => (
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
