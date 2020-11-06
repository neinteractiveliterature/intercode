import { Link } from 'react-router-dom';

import EventCategoryRow from './EventCategoryRow';
import { sortByLocaleString } from '../ValueUtils';
import usePageTitle from '../usePageTitle';
import { useEventCategoryAdminQueryQuery } from './queries.generated';
import { LoadQueryWrapper } from '../GraphqlLoadingWrappers';

export default LoadQueryWrapper(useEventCategoryAdminQueryQuery, function EventCategoryIndex({
  data,
}) {
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
