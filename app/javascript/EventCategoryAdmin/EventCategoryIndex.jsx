import React from 'react';

import { EventCategoryAdminQuery } from './queries.gql';
import QueryWithStateDisplay from '../QueryWithStateDisplay';
import { sortByLocaleString } from '../ValueUtils';
import { getEventCategoryStyles } from '../EventsApp/ScheduleGrid/StylingUtils';

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
