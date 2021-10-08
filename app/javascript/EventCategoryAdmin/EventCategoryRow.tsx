import { Link } from 'react-router-dom';
import {
  ErrorDisplay,
  useConfirm,
  ButtonWithTooltip,
  deleteObjectFromReferenceArrayUpdater,
} from '@neinteractiveliterature/litform';

import { getEventCategoryStyles } from '../EventsApp/ScheduleGrid/StylingUtils';
import pluralizeWithCount from '../pluralizeWithCount';
import { EventCategoryAdminQueryData } from './queries.generated';
import { useDeleteEventCategoryMutation } from './mutations.generated';

export type EventCategoryRowProps = {
  convention: EventCategoryAdminQueryData['convention'];
  eventCategory: EventCategoryAdminQueryData['convention']['event_categories'][0];
};

function EventCategoryRow({ convention, eventCategory }: EventCategoryRowProps): JSX.Element {
  const confirm = useConfirm();
  const [deleteEventCategory] = useDeleteEventCategoryMutation({
    update: deleteObjectFromReferenceArrayUpdater(convention, 'event_categories', eventCategory),
  });

  return (
    <tr>
      <td>
        <span className="rounded p-1" style={getEventCategoryStyles({ eventCategory, variant: 'default' })}>
          {eventCategory.name}
        </span>{' '}
        <small>({pluralizeWithCount('event', eventCategory.events_paginated.total_entries)})</small>
      </td>
      <td className="text-end">
        {eventCategory.events_paginated.total_entries > 0 ? (
          <ButtonWithTooltip
            buttonProps={{
              className: 'btn btn-outline-danger btn-sm me-2',
              disabled: true,
            }}
            tooltipContent={
              <>
                This event category cannot be deleted because there are events in it. To delete it, first either drop
                these events or change their categories.
              </>
            }
          >
            <i className="bi-trash" />
            <span className="visually-hidden">Delete event category</span>
          </ButtonWithTooltip>
        ) : (
          <button
            type="button"
            className="btn btn-outline-danger btn-sm me-2"
            onClick={() =>
              confirm({
                prompt: 'Are you sure you want to delete this event category?',
                renderError: (error) => <ErrorDisplay graphQLError={error} />,
                action: () =>
                  deleteEventCategory({
                    variables: { id: eventCategory.id },
                  }),
              })
            }
          >
            <i className="bi-trash" />
            <span className="visually-hidden">Delete event category</span>
          </button>
        )}
        <Link to={`/event_categories/${eventCategory.id}/edit`} className="btn btn-primary btn-sm">
          Edit
        </Link>
      </td>
    </tr>
  );
}

export default EventCategoryRow;
