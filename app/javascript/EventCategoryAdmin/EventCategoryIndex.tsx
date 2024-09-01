import { Link } from 'react-router-dom';
import { sortByLocaleString } from '@neinteractiveliterature/litform';

import EventCategoryRow from './EventCategoryRow';
import usePageTitle from '../usePageTitle';
import { useEventCategoryAdminLoader } from './loaders';
import { useTranslation } from 'react-i18next';

function EventCategoryIndex() {
  const data = useEventCategoryAdminLoader();
  const { t } = useTranslation();
  usePageTitle(t('navigation.admin.eventCategories'));

  const { event_categories: eventCategories } = data.convention;

  return (
    <>
      <h1 className="mb-4">{t('navigation.admin.eventCategories')}</h1>

      <table className="table table-striped">
        <tbody>
          {sortByLocaleString([...eventCategories], (eventCategory) => eventCategory.name).map((eventCategory) => (
            <EventCategoryRow eventCategory={eventCategory} key={eventCategory.id} />
          ))}
        </tbody>
      </table>

      <Link to="/event_categories/new" className="btn btn-primary">
        New event category
      </Link>
    </>
  );
}

export const Component = EventCategoryIndex;
