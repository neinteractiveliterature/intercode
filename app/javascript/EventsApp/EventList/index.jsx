import React, {
  useState, useEffect, useCallback, useContext,
} from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo-hooks';

import { buildFieldFilterCodecs, FilterCodecs } from '../../Tables/FilterUtils';
import ErrorDisplay from '../../ErrorDisplay';
import EventListCategoryDropdown from './EventListCategoryDropdown';
import { EventListEventsQuery } from './queries.gql';
import EventListEvents from './EventListEvents';
import EventListSortDropdown from './EventListSortDropdown';
import useReactRouterReactTable from '../../Tables/useReactRouterReactTable';
import {
  reactTableFiltersToTableResultsFilters,
  reactTableSortToTableResultsSort,
} from '../../Tables/TableUtils';
import usePageTitle from '../../usePageTitle';
import PageLoadingIndicator from '../../PageLoadingIndicator';
import SearchInput from '../../BuiltInFormControls/SearchInput';
import AppRootContext from '../../AppRootContext';
import EventListMyRatingDropdown from './EventListMyRatingDropdown';

const filterCodecs = buildFieldFilterCodecs({
  category: FilterCodecs.integerArray,
  my_rating: FilterCodecs.integerArray,
  title_prefix: FilterCodecs.nonEmptyString,
});

function EventList({ history }) {
  const {
    sorted, filtered, onSortedChange, onFilteredChange,
  } = useReactRouterReactTable({ history, ...filterCodecs });
  const { myProfile } = useContext(AppRootContext);
  const defaultSort = (myProfile
    ? [{ id: 'my_rating', desc: true }, { id: 'title', desc: false }]
    : [{ id: 'title', desc: false }]
  );
  const [cachedConventionName, setCachedConventionName] = useState(null);
  const [cachedEventCategories, setCachedEventCategories] = useState(null);
  const [cachedPageCount, setCachedPageCount] = useState(null);
  const allCategoryIds = cachedEventCategories ? cachedEventCategories.map((c) => c.id) : [];
  const defaultFiltered = (myProfile
    ? [{ id: 'my_rating', value: [1, 0] }, { id: 'category', value: allCategoryIds }]
    : [{ id: 'category', value: allCategoryIds }]
  );
  const effectiveSorted = (sorted && sorted.length > 0) ? sorted : defaultSort;
  const effectiveFiltered = (filtered && filtered.length > 0) ? filtered : defaultFiltered;

  const {
    data, loading, error, fetchMore,
  } = useQuery(
    EventListEventsQuery,
    {
      variables: {
        page: 1,
        pageSize: 10,
        sort: reactTableSortToTableResultsSort(effectiveSorted),
        filters: reactTableFiltersToTableResultsFilters(effectiveFiltered),
      },
    },
  );

  useEffect(
    () => {
      if (loading || error) {
        return;
      }

      const totalEntries = data.convention.events_paginated.total_entries;

      if (data.convention.events_paginated.entries.length < totalEntries) {
        // this is a little weird but because of the way pagination works, we're going to end up
        // re-fetching the first 20 - so just go ahead and replace them
        fetchMore({
          variables: { page: 1, pageSize: totalEntries },
          updateQuery: (prev, { fetchMoreResult }) => ({
            ...prev,
            convention: {
              ...prev.convention,
              events_paginated: {
                ...prev.convention.events_paginated,
                entries: fetchMoreResult.convention.events_paginated.entries,
              },
            },
          }),
        });
      }
    },
    [loading, error, data, fetchMore],
  );

  const changeFilterValue = useCallback(
    (fieldId, value) => {
      onFilteredChange((prevFiltered) => [
        ...(prevFiltered || []).filter(({ id }) => id !== fieldId),
        { id: fieldId, value },
      ]);
    },
    [onFilteredChange],
  );

  const categoryChanged = useCallback(
    (value) => changeFilterValue('category', value),
    [changeFilterValue],
  );

  const myRatingFilterChanged = useCallback(
    (value) => changeFilterValue('my_rating', value),
    [changeFilterValue],
  );

  const titlePrefixChanged = useCallback(
    (value) => changeFilterValue('title_prefix', value),
    [changeFilterValue],
  );

  useEffect(
    () => {
      if (!loading && !error) {
        setCachedConventionName(data.convention.name);
        setCachedEventCategories(data.convention.event_categories);
      }
    },
    [data, loading, error],
  );

  usePageTitle('List of Events');

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const eventsPaginated = (loading ? { entries: [] } : data.convention.events_paginated);

  if (!loading && cachedPageCount !== eventsPaginated.total_pages) {
    setCachedPageCount(eventsPaginated.total_pages);
  }

  return (
    <>
      <h1>
        Events
        {cachedConventionName && ` at ${cachedConventionName}`}
      </h1>

      <div className="mb-2">
        <div className="d-flex flex-column flex-sm-row mt-4">
          <div className="d-flex flex-row">
            <div>
              {cachedEventCategories && (
                <EventListCategoryDropdown
                  eventCategories={cachedEventCategories}
                  value={(effectiveFiltered.find(({ id }) => id === 'category') || {}).value}
                  onChange={categoryChanged}
                />
              )}
            </div>

            <div>
              <EventListSortDropdown
                showConventionOrder={!loading && data.currentAbility.can_read_schedule}
                value={sorted}
                onChange={onSortedChange}
              />
            </div>
          </div>

          <div className="ml-2 flex-grow-1">
            <SearchInput
              label="Search"
              value={(effectiveFiltered.find(({ id }) => id === 'title_prefix') || {}).value}
              onChange={titlePrefixChanged}
            />
          </div>
        </div>

        {myProfile && (
          <EventListMyRatingDropdown
            value={(effectiveFiltered.find(({ id }) => id === 'my_rating') || {}).value}
            onChange={myRatingFilterChanged}
          />
        )}
      </div>

      <PageLoadingIndicator visible={loading} />
      {
        loading
          ? null
          : (
            <EventListEvents
              convention={data.convention}
              eventsPaginated={eventsPaginated}
              sorted={sorted}
              canReadSchedule={data.currentAbility.can_read_schedule}
            />
          )
      }
    </>
  );
}

EventList.propTypes = {
  history: PropTypes.shape({}).isRequired,
};

export default EventList;
