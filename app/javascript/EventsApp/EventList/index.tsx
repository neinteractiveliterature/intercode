import { useState, useEffect, useCallback, useContext } from 'react';
import { ApolloError } from '@apollo/client';
import { Filters } from 'react-table';
import { useTranslation } from 'react-i18next';
import {
  LoadingIndicator,
  ErrorDisplay,
  PageLoadingIndicator,
  SearchInput,
} from '@neinteractiveliterature/litform';

import { buildFieldFilterCodecs, FilterCodecs } from '../../Tables/FilterUtils';
import EventListCategoryDropdown from './EventListCategoryDropdown';
import EventListEvents from './EventListEvents';
import EventListSortDropdown from './EventListSortDropdown';
import useReactRouterReactTable from '../../Tables/useReactRouterReactTable';
import {
  reactTableFiltersToTableResultsFilters,
  reactTableSortToTableResultsSort,
} from '../../Tables/TableUtils';
import usePageTitle from '../../usePageTitle';
import AppRootContext from '../../AppRootContext';
import EventListMyRatingSelector from './EventListMyRatingSelector';
import useAsyncFunction from '../../useAsyncFunction';
import { EventListEventsQueryData, useEventListEventsQuery } from './queries.generated';

const PAGE_SIZE = 20;

const filterCodecs = buildFieldFilterCodecs({
  category: FilterCodecs.integerArray,
  my_rating: FilterCodecs.integerArray,
  title_prefix: FilterCodecs.nonEmptyString,
});

type FetchMoreFunction = ReturnType<typeof useEventListEventsQuery>['fetchMore'];
type EventType = NonNullable<
  EventListEventsQueryData['convention']
>['events_paginated']['entries'][number];

const fetchMoreEvents = async (fetchMore: FetchMoreFunction, page: number) => {
  try {
    await fetchMore({
      variables: { page, pageSize: PAGE_SIZE },
      updateQuery: (prev, { fetchMoreResult }) => {
        const updatedQuery: EventListEventsQueryData = {
          ...prev,
          convention: {
            ...prev.convention!,
            events_paginated: {
              ...prev.convention!.events_paginated,
              entries: [
                ...(prev.convention!.events_paginated.entries ?? []),
                ...(fetchMoreResult?.convention?.events_paginated.entries ?? []),
              ],
            },
          },
        };
        return updatedQuery;
      },
    });
  } catch (err) {
    // ignore, see https://github.com/apollographql/apollo-client/issues/4114#issuecomment-502111099
  }
};

function EventList() {
  const { sortBy, filters, updateSearch } = useReactRouterReactTable({
    ...filterCodecs,
  });
  const { myProfile } = useContext(AppRootContext);
  const { t } = useTranslation();
  const defaultSort = myProfile
    ? [
        { id: 'my_rating', desc: true },
        { id: 'title', desc: false },
      ]
    : [{ id: 'title', desc: false }];
  const [cachedConventionName, setCachedConventionName] = useState<string>();
  const [cachedEventCategories, setCachedEventCategories] = useState<
    NonNullable<EventListEventsQueryData['convention']>['event_categories']
  >();
  const [cachedPageCount, setCachedPageCount] = useState<number>();
  const defaultFiltered = myProfile
    ? [
        { id: 'my_rating', value: [1, 0] },
        { id: 'category', value: [] },
      ]
    : [{ id: 'category', value: [] }];
  const effectiveSortBy = sortBy && sortBy.length > 0 ? sortBy : defaultSort;
  const effectiveFilters: Filters<EventType> =
    filters && filters.length > 0 ? filters : defaultFiltered;

  const { data, loading, error, fetchMore } = useEventListEventsQuery({
    variables: {
      page: 1,
      pageSize: PAGE_SIZE,
      sort: reactTableSortToTableResultsSort(effectiveSortBy),
      filters: reactTableFiltersToTableResultsFilters(effectiveFilters),
    },
  });
  const [fetchMoreEventsAsync, fetchMoreError, fetchMoreInProgress] = useAsyncFunction(
    fetchMoreEvents,
  );

  const loadedEntries: number =
    loading || error || !data ? 0 : data.convention?.events_paginated.entries.length ?? 0;
  const totalEntries: number =
    loading || error || !data ? 0 : data.convention?.events_paginated.total_entries ?? 0;

  const fetchMoreIfNeeded = useCallback(() => {
    if (loadedEntries === 0) {
      return;
    }

    if (loadedEntries < totalEntries) {
      fetchMoreEventsAsync(fetchMore, loadedEntries / PAGE_SIZE + 1);
    }
  }, [fetchMore, fetchMoreEventsAsync, loadedEntries, totalEntries]);

  const changeFilterValue = useCallback(
    (fieldId, value) => {
      updateSearch({
        filters: [...filters.filter(({ id }) => id !== fieldId), { id: fieldId, value }],
      });
    },
    [updateSearch, filters],
  );

  const categoryChanged = useCallback((value) => changeFilterValue('category', value), [
    changeFilterValue,
  ]);

  const myRatingFilterChanged = useCallback((value) => changeFilterValue('my_rating', value), [
    changeFilterValue,
  ]);

  const titlePrefixChanged = useCallback((value) => changeFilterValue('title_prefix', value), [
    changeFilterValue,
  ]);

  useEffect(() => {
    if (!loading && !error && data) {
      setCachedConventionName(data.convention?.name);
      setCachedEventCategories(data.convention?.event_categories ?? []);
    }
  }, [data, loading, error]);

  usePageTitle(t('navigation.events.eventCatalog', 'Event Catalog'));

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  if (cachedEventCategories == null) {
    // we haven't had the first load yet, don't render the dropdowns because they will get positioned
    // wrong

    return <PageLoadingIndicator visible />;
  }

  const eventsPaginated = (loading || !data ? undefined : data.convention?.events_paginated) ?? {
    __typename: 'EventsPagination',
    entries: [],
    current_page: 1,
    per_page: 10,
    total_entries: 0,
    total_pages: 1,
  };

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
                  value={(effectiveFilters.find(({ id }) => id === 'category') || {}).value}
                  onChange={categoryChanged}
                />
              )}
            </div>

            <div>
              <EventListSortDropdown
                showConventionOrder={(!loading && data?.currentAbility.can_read_schedule) ?? false}
                value={sortBy}
                onChange={(newSortBy) => {
                  updateSearch({ sortBy: newSortBy });
                }}
              />
            </div>
          </div>

          <div className="ms-2 flex-grow-1">
            <SearchInput
              label="Search"
              value={(effectiveFilters.find(({ id }) => id === 'title_prefix') || {}).value}
              onChange={titlePrefixChanged}
            />
          </div>
        </div>

        {myProfile && (
          <>
            <EventListMyRatingSelector
              value={(effectiveFilters.find(({ id }) => id === 'my_rating') || {}).value}
              onChange={myRatingFilterChanged}
            />
          </>
        )}
      </div>

      <PageLoadingIndicator visible={loading} />
      {loading || !data ? null : (
        <>
          <EventListEvents
            convention={data.convention!}
            eventsPaginated={eventsPaginated}
            sortBy={sortBy}
            canReadSchedule={data.currentAbility.can_read_schedule}
            fetchMoreIfNeeded={fetchMoreIfNeeded}
          />
          {fetchMoreInProgress && (
            <div>
              <LoadingIndicator /> <em className="text-muted">Loading more events...</em>
            </div>
          )}
          <ErrorDisplay graphQLError={fetchMoreError as ApolloError} />
        </>
      )}
    </>
  );
}

export default EventList;
