import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { DeleteEventCategory } from './mutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import { EventCategoryAdminQuery } from './queries.gql';
import { getEventCategoryStyles } from '../EventsApp/ScheduleGrid/StylingUtils';
import pluralizeWithCount from '../pluralizeWithCount';
import PopperDropdown from '../UIComponents/PopperDropdown';
import Tooltip from '../UIComponents/Tooltip';
import { useConfirm } from '../ModalDialogs/Confirm';
import { useDeleteMutation } from '../MutationUtils';

function EventCategoryRow({ eventCategory }) {
  const confirm = useConfirm();
  const deleteEventCategory = useDeleteMutation(DeleteEventCategory, {
    query: EventCategoryAdminQuery,
    idVariablePath: ['id'],
    arrayPath: ['convention', 'event_categories'],
  });

  return (
    <tr>
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
              <button
                type="button"
                className="btn btn-outline-danger btn-sm mr-2"
                onClick={() => confirm({
                  prompt: 'Are you sure you want to delete this event category?',
                  renderError: error => <ErrorDisplay graphQLError={error} />,
                  action: () => deleteEventCategory({
                    variables: { id: eventCategory.id },
                  }),
                })}
              >
                <i className="fa fa-trash-o" />
                <span className="sr-only">Delete event category</span>
              </button>
            )
        }
        <Link
          to={`/event_categories/${eventCategory.id}/edit`}
          className="btn btn-primary btn-sm"
        >
          Edit
        </Link>
      </td>
    </tr>
  );
}

EventCategoryRow.propTypes = {
  eventCategory: PropTypes.shape({
    id: PropTypes.number.isRequired,
    events_paginated: PropTypes.shape({
      total_entries: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
};

export default EventCategoryRow;
