import { Link } from 'react-router';

import RecurringEventSection from './RecurringEventSection';
import usePageTitle from '../usePageTitle';
import { useTranslation } from 'react-i18next';
import { CategorySpecificEventAdminComponentProps } from './CategorySpecificEventAdmin';

export default function RecurringEventAdmin({ data }: CategorySpecificEventAdminComponentProps): JSX.Element {
  const { t } = useTranslation();
  const eventCategory = data.convention.event_category;

  usePageTitle(
    t('admin.events.eventListPageTitle', {
      categoryName: eventCategory.name,
    }),
  );

  return (
    <div>
      <Link className="btn btn-primary mt-4" to={`./events/new`}>
        {t('admin.events.newEventLabel', {
          categoryName: eventCategory?.name,
        })}
      </Link>
      <hr className="my-4" />
      {data.convention.event_category.events_paginated.entries.map((event) => (
        <RecurringEventSection convention={data.convention} event={event} key={event.id} />
      ))}
    </div>
  );
}
