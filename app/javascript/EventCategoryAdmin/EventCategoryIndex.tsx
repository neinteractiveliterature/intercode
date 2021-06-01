import { Link } from 'react-router-dom';
import { LoadQueryWrapper, sortByLocaleString } from '@neinteractiveliterature/litform';

import EventCategoryRow from './EventCategoryRow';
import usePageTitle from '../usePageTitle';
import { useEventCategoryAdminQuery } from './queries.generated';

export default LoadQueryWrapper(useEventCategoryAdminQuery, function EventCategoryIndex({ data }) {
  usePageTitle('Event Categories');

  const { event_categories: eventCategories } = data!.convention;

  return (
    <>
      <h1 className="mb-4">Event categories</h1>

      <table className="table table-striped">
        <tbody>
          {sortByLocaleString([...eventCategories], (eventCategory) => eventCategory.name).map(
            (eventCategory) => (
              <EventCategoryRow eventCategory={eventCategory} key={eventCategory.id} />
            ),
          )}
        </tbody>
      </table>

      <Link to="/event_categories/new" className="btn btn-primary">
        New event category
      </Link>
    </>
  );
});
