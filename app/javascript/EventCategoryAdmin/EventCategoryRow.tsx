import { Link, useSubmit } from 'react-router-dom';
import { ErrorDisplay, useConfirm, ButtonWithTooltip } from '@neinteractiveliterature/litform';

import { getEventCategoryStyles } from '../EventsApp/ScheduleGrid/StylingUtils';
import { EventCategoryAdminQueryData } from './queries.generated';
import { Trans, useTranslation } from 'react-i18next';

export type EventCategoryRowProps = {
  eventCategory: EventCategoryAdminQueryData['convention']['event_categories'][0];
};

function EventCategoryRow({ eventCategory }: EventCategoryRowProps): JSX.Element {
  const confirm = useConfirm();
  const submit = useSubmit();
  const { t } = useTranslation();

  return (
    <tr>
      <td>
        <span className="rounded p-1" style={getEventCategoryStyles({ eventCategory, variant: 'default' })}>
          {eventCategory.name}
        </span>{' '}
        <small>
          <>
            (
            {t('admin.eventCategories.eventCount', {
              count: eventCategory.events_paginated.total_entries,
            })}
            )
          </>
        </small>
      </td>
      <td className="text-end">
        {eventCategory.events_paginated.total_entries > 0 ? (
          <ButtonWithTooltip
            buttonProps={{
              className: 'btn btn-outline-danger btn-sm me-2',
              disabled: true,
            }}
            tooltipContent={
              <Trans i18nKey="admin.eventCategories.cannotDeleteCategoryWithEvents">
                This event category cannot be deleted because there are events in it. To delete it, first either drop
                these events or change their categories.
              </Trans>
            }
          >
            <i className="bi-trash" />
            <span className="visually-hidden">{t('admin.eventCategories.deleteLabel')}</span>
          </ButtonWithTooltip>
        ) : (
          <button
            type="button"
            className="btn btn-outline-danger btn-sm me-2"
            onClick={() =>
              confirm({
                prompt: t('admin.eventCategories.deleteConfirmation'),
                renderError: (error) => <ErrorDisplay graphQLError={error} />,
                action: () => submit(null, { action: `./${eventCategory.id}`, method: 'DELETE' }),
              })
            }
          >
            <i className="bi-trash" />
            <span className="visually-hidden">Delete event category</span>
          </button>
        )}
        <Link to={`/event_categories/${eventCategory.id}/edit`} className="btn btn-primary btn-sm">
          {t('buttons.edit')}
        </Link>
      </td>
    </tr>
  );
}

export default EventCategoryRow;
