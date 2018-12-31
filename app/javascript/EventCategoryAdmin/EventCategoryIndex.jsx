import React from 'react';
import { Link } from 'react-router-dom';
import { Mutation } from 'react-apollo';

import Confirm from '../ModalDialogs/Confirm';
import { DeleteEventCategory } from './mutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import { EventCategoryAdminQuery } from './queries.gql';
import { getEventCategoryStyles } from '../EventsApp/ScheduleGrid/StylingUtils';
import pluralizeWithCount from '../pluralizeWithCount';
import PopperDropdown from '../UIComponents/PopperDropdown';
import QueryWithStateDisplay from '../QueryWithStateDisplay';
import { sortByLocaleString } from '../ValueUtils';
import Tooltip from '../UIComponents/Tooltip';

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
                      {
                        eventCategory.events_paginated.total_entries > 0
                          ? (
                            <PopperDropdown
                              placement="bottom-end"
                              renderReference={({ ref, setVisible }) => (
                                <button
                                  ref={ref}
                                  type="button"
                                  className="btn btn-outline-danger btn-sm mr-2"
                                  disabled
                                  onFocus={() => setVisible(true)}
                                  onBlur={() => setVisible(false)}
                                  onMouseOver={() => setVisible(true)}
                                  onMouseOut={() => setVisible(false)}
                                >
                                  <i className="fa fa-trash-o" />
                                  <span className="sr-only">Delete event category</span>
                                </button>
                              )}
                            >
                              {({ ref, ...popperProps }) => (
                                <Tooltip withRef={ref} {...popperProps}>
                                  This event category cannot be deleted because there are events in
                                  it.  To delete it, first either drop these events or change their
                                  categories.
                                </Tooltip>
                              )}
                            </PopperDropdown>
                          )
                          : (
                            <Confirm.Trigger>
                              {confirm => (
                                <Mutation mutation={DeleteEventCategory}>
                                  {mutate => (
                                    <button
                                      type="button"
                                      className="btn btn-outline-danger btn-sm mr-2"
                                      onClick={() => confirm({
                                        prompt: 'Are you sure you want to delete this event category?',
                                        renderError: error => <ErrorDisplay graphQLError={error} />,
                                        action: () => mutate({
                                          variables: { id: eventCategory.id },
                                          update: (store) => {
                                            const data = store.readQuery({
                                              query: EventCategoryAdminQuery,
                                            });
                                            store.writeQuery({
                                              query: EventCategoryAdminQuery,
                                              data: {
                                                ...data,
                                                convention: {
                                                  ...data.convention,
                                                  event_categories: data.convention.event_categories
                                                    .filter(c => c.id !== eventCategory.id),
                                                },
                                              },
                                            });
                                          },
                                        }),
                                      })}
                                    >
                                      <i className="fa fa-trash-o" />
                                      <span className="sr-only">Delete event category</span>
                                    </button>
                                  )}
                                </Mutation>
                              )}
                            </Confirm.Trigger>
                          )
                      }
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

      <Link to="/new" className="btn btn-primary">
        New event category
      </Link>
    </>
  );
}

export default EventCategoryIndex;
