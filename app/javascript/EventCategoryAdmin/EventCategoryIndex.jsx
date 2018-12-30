import React from 'react';
import { Link } from 'react-router-dom';

import { EventCategoryAdminQuery } from './queries.gql';
import { getEventCategoryStyles } from '../EventsApp/ScheduleGrid/StylingUtils';
import pluralizeWithCount from '../pluralizeWithCount';
import QueryWithStateDisplay from '../QueryWithStateDisplay';
import { sortByLocaleString } from '../ValueUtils';

function EventCategoryIndex() {
  return (
    <>
      <h1>Event categories</h1>

      <QueryWithStateDisplay query={EventCategoryAdminQuery}>
        {({ data: { convention: { event_categories: eventCategories } } }) => (
          <table className="table table-striped">
            <tbody>
              {sortByLocaleString([...eventCategories], eventCategory => eventCategory.name)
                .map(eventCategory => (
                  <tr key={eventCategory.id}>
                    <td>
                      <span className="rounded p-1" style={getEventCategoryStyles({ eventCategory, variant: 'default' })}>
                        {eventCategory.name}
                      </span>
                      {' '}
                      <small>
                        (
                        {pluralizeWithCount('event', eventCategory.events_paginated.total_entries)}
                        )
                      </small>
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm mr-2"
                      >
                        <i className="fa fa-trash-o" />
                        <span className="sr-only">Delete event category</span>
                      </button>
                      <Link
                        to={`/${eventCategory.id}/edit`}
                        className="btn btn-primary btn-sm"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </QueryWithStateDisplay>
    </>
  );
}

export default EventCategoryIndex;
