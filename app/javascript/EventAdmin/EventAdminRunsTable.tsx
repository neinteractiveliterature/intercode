import { Link } from 'react-router';

import EventAdminRow from './EventAdminRow';
import usePageTitle from '../usePageTitle';
import { useTranslation } from 'react-i18next';
import { CategorySpecificEventAdminComponentProps } from './CategorySpecificEventAdmin';

export default function EventAdminRunsTable({ data }: CategorySpecificEventAdminComponentProps) {
  const { t } = useTranslation();
  const eventCategory = data.convention.event_category;
  const events = data.convention.event_category.events_paginated.entries;

  usePageTitle(
    t('admin.events.eventListPageTitle', {
      categoryName: eventCategory.name,
    }),
  );

  return (
    <div>
      <Link to={`./events/new`} className="btn btn-primary mt-4 mb-2">
        {t('admin.events.newEventLabel', {
          categoryName: eventCategory.name,
        })}
      </Link>
      <table className="table table-striped no-top-border">
        <thead>
          <tr>
            <th style={{ minWidth: '200px' }}>{t('admin.events.titleColumn')}</th>
            <th>{t('admin.events.durationColumn')}</th>
            <th>{t('admin.events.runsColumn')}</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <EventAdminRow event={event} eventCategory={eventCategory} key={event.id} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
