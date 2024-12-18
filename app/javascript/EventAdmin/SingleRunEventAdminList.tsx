import { Link, useSubmit } from 'react-router';
import { ErrorDisplay, useConfirm } from '@neinteractiveliterature/litform';

import { getEventCategoryStyles } from '../EventsApp/ScheduleGrid/StylingUtils';
import { timespanFromRun } from '../TimespanUtils';
import usePageTitle from '../usePageTitle';
import { timezoneNameForConvention } from '../TimeUtils';
import { useFormatRunTimespan } from '../EventsApp/runTimeFormatting';
import { useTranslation } from 'react-i18next';
import { CategorySpecificEventAdminComponentProps } from './CategorySpecificEventAdmin';

export default function SingleRunEventAdminList({ data }: CategorySpecificEventAdminComponentProps) {
  const eventCategory = data.convention.event_category;
  const formatRunTimespan = useFormatRunTimespan();
  const { t } = useTranslation();
  const submit = useSubmit();

  const confirm = useConfirm();

  usePageTitle(
    t('admin.events.eventListPageTitle', {
      categoryName: eventCategory.name,
    }),
  );

  const eventRows = data.convention.event_category.events_paginated.entries.map((event) => {
    const run = event.runs[0];
    let timespan;
    if (run) {
      timespan = timespanFromRun(timezoneNameForConvention(data.convention), event, run);
    }

    return (
      <tr key={event.id}>
        <th scope="row">
          <span
            className="rounded p-1 text-dark"
            style={getEventCategoryStyles({ eventCategory: eventCategory, variant: 'default' })}
          >
            {event.title}
          </span>
        </th>
        <td>{timespan && formatRunTimespan(timespan, { formatType: 'short' })}</td>
        <td>
          <Link className="btn btn-secondary btn-sm" to={`./events/${event.id}/edit`}>
            {t('buttons.edit')}
          </Link>{' '}
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() =>
              confirm({
                prompt: t('admin.events.dropEventConfirmation'),
                action: () => submit({}, { action: `./events/${event.id}/drop`, method: 'PATCH' }),
                renderError: (e) => <ErrorDisplay graphQLError={e} />,
              })
            }
            aria-label={t('events.edit.dropButton')}
            title={t('events.edit.dropButton')}
          >
            <i className="bi-trash" />
          </button>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <Link className="btn btn-primary my-4" to={`./events/new`}>
        {t('admin.events.newEventLabel', {
          categoryName: eventCategory?.name,
        })}
      </Link>
      <table className="table table-striped">
        <tbody>{eventRows}</tbody>
      </table>
    </div>
  );
}
