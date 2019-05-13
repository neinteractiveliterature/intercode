import React from 'react';
import { Link } from 'react-router-dom';

import { EventCategoryAdminQuery } from './queries.gql';
import EventCategoryRow from './EventCategoryRow';
import QueryWithStateDisplay from '../QueryWithStateDisplay';
import { sortByLocaleString } from '../ValueUtils';

function EventCategoryIndex() {
  return (
    <>
      <h1 className="mb-4">Event categories</h1>

      <QueryWithStateDisplay query={EventCategoryAdminQuery}>
        {({ data: { convention: { event_categories: eventCategories } } }) => (
          <table className="table table-striped">
            <tbody>
              {sortByLocaleString([...eventCategories], eventCategory => eventCategory.name)
                .map(eventCategory => (
                  <EventCategoryRow eventCategory={eventCategory} key={eventCategory.id} />
                ))}
            </tbody>
          </table>
        )}
      </QueryWithStateDisplay>

      <Link to="/event_categories/new" className="btn btn-primary">
        New event category
      </Link>
    </>
  );
}

export default EventCategoryIndex;
