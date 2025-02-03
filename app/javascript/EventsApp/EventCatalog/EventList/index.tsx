import { useState, useCallback, useContext, useMemo } from 'react';
import { ApolloError, useQuery } from '@apollo/client';
import { ColumnFiltersState } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import {
  LoadingIndicator,
  ErrorDisplay,
  PageLoadingIndicator,
  SearchInput,
  notEmpty,
} from '@neinteractiveliterature/litform';

import { buildFieldFilterCodecs, FilterCodecs } from '../../../Tables/FilterUtils';
import EventListCategoryDropdown from './EventListCategoryDropdown';
import EventListEvents from './EventListEvents';
import EventListSortDropdown from './EventListSortDropdown';
import useReactRouterReactTable from '../../../Tables/useReactRouterReactTable';
import { reactTableFiltersToTableResultsFilters, reactTableSortToTableResultsSort } from '../../../Tables/TableUtils';
import usePageTitle from '../../../usePageTitle';
import AppRootContext from '../../../AppRootContext';
import EventListMyRatingSelector from './EventListMyRatingSelector';
import useAsyncFunction from '../../../useAsyncFunction';
import { EventListEventsQueryData, EventListEventsQueryDocument } from './queries.generated';
import EventListFilterableFormItemDropdown from './EventListFilterableFormItemDropdown';
import { CommonConventionDataQueryData, CommonConventionDataQueryDocument } from '../../queries.generated';
import { getFilterableFormItems } from '../../useFilterableFormItems';
import useMergeCategoriesIntoEvents from '../../useMergeCategoriesIntoEvents';
import EventCatalogNavTabs from '../EventCatalogNavTabs';
import { LoaderFunction, useLoaderData } from 'react-router';
import { client } from '../../../useIntercodeApolloClient';
import { FetchMoreFunction } from '@apollo/client/react/hooks/useSuspenseQuery';
import { ResultOf, VariablesOf } from '@graphql-typed-document-node/core';

const PAGE_SIZE = 20;

const filterCodecs = buildFieldFilterCodecs({
  category: FilterCodecs.integerArray,
  my_rating: FilterCodecs.integerArray,
  title_prefix: FilterCodecs.nonEmptyString,
  form_items: FilterCodecs.json,
});

const fetchMoreEvents = async (
  fetchMore: FetchMoreFunction<
    ResultOf<typeof EventListEventsQueryDocument>,
    VariablesOf<typeof EventListEventsQueryDocument>
  >,
  page: number,
) => {
  try {
    await fetchMore({
      variables: { page, pageSize: PAGE_SIZE },
      updateQuery: (prev, { fetchMoreResult }) => {
        const updatedQuery: EventListEventsQueryData = {
          ...prev,
          convention: {
            ...prev.convention,
            events_paginated: {
              ...prev.convention.events_paginated,
              entries: [
                ...(prev.convention.events_paginated.entries ?? []),
                ...(fetchMoreResult?.convention?.events_paginated.entries ?? []),
              ],
            },
          },
        };
        return updatedQuery;
      },
    });
  } catch {
    // ignore, see https://github.com/apollographql/apollo-client/issues/4114#issuecomment-502111099
  }
};

type LoaderResult = {
  convention: CommonConventionDataQueryData['convention'];
  filterableFormItems: ReturnType<typeof getFilterableFormItems>;
};

export const loader: LoaderFunction = async () => {
  const { data } = await client.query<CommonConventionDataQueryData>({ query: CommonConventionDataQueryDocument });
  const filterableFormItems = getFilterableFormItems(data.convention);
  return { convention: data.convention, filterableFormItems } satisfies LoaderResult;
};

function EventList(): JSX.Element {
  const { filterableFormItems, convention } = useLoaderData() as LoaderResult;
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
  const [cachedPageCount, setCachedPageCount] = useState<number>();
  const defaultFiltered = myProfile
    ? [
        { id: 'my_rating', value: [1, 0] },
        { id: 'category', value: [] },
      ]
    : [{ id: 'category', value: [] }];
  const effectiveSortBy = sortBy && sortBy.length > 0 ? sortBy : defaultSort;
  const effectiveFilters: ColumnFiltersState = filters && filters.length > 0 ? filters : defaultFiltered;
  const filterableFormItemIdentifiers = useMemo(
    () => filterableFormItems.map((item) => item.identifier).filter(notEmpty),
    [filterableFormItems],
  );

  const { data, loading, error, fetchMore } = useQuery(EventListEventsQueryDocument, {
    variables: {
      page: 1,
      pageSize: PAGE_SIZE,
      sort: reactTableSortToTableResultsSort(effectiveSortBy),
      filters: reactTableFiltersToTableResultsFilters(effectiveFilters),
      fetchFormItemIdentifiers: filterableFormItemIdentifiers,
    },
  });
  const [fetchMoreEventsAsync, fetchMoreError, fetchMoreInProgress] = useAsyncFunction(fetchMoreEvents);

  const loadedEntries: number = loading || error || !data ? 0 : (data.convention?.events_paginated.entries.length ?? 0);
  const totalEntries: number = loading || error || !data ? 0 : (data.convention?.events_paginated.total_entries ?? 0);

  const fetchMoreIfNeeded = useCallback(() => {
    if (loadedEntries === 0) {
      return;
    }

    if (loadedEntries < totalEntries) {
      fetchMoreEventsAsync(fetchMore, loadedEntries / PAGE_SIZE + 1);
    }
  }, [fetchMore, fetchMoreEventsAsync, loadedEntries, totalEntries]);

  const changeFilterValue = useCallback(
    (fieldId: string, value: unknown) => {
      updateSearch({
        filters: [...filters.filter(({ id }) => id !== fieldId), { id: fieldId, value }],
      });
    },
    [updateSearch, filters],
  );

  const categoryChanged = useCallback((value: unknown) => changeFilterValue('category', value), [changeFilterValue]);

  const myRatingFilterChanged = useCallback(
    (value: unknown) => changeFilterValue('my_rating', value),
    [changeFilterValue],
  );

  const titlePrefixChanged = useCallback(
    (value: unknown) => changeFilterValue('title_prefix', value),
    [changeFilterValue],
  );

  const eventsWithCategories = useMergeCategoriesIntoEvents(
    convention.event_categories,
    data?.convention.events_paginated.entries ?? [],
  );

  usePageTitle(t('navigation.events.eventCatalog'));

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const eventsPaginated = (loading || !data
    ? undefined
    : { ...data.convention?.events_paginated, entries: eventsWithCategories }) ?? {
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
      <h1>Event Catalog</h1>

      <EventCatalogNavTabs />

      <div className="mb-2">
        <div className="d-flex flex-column flex-sm-row mt-4">
          <div className="d-flex flex-row">
            <div>
              <EventListCategoryDropdown
                eventCategories={convention.event_categories}
                value={(effectiveFilters.find(({ id }) => id === 'category')?.value ?? []) as string[]}
                onChange={categoryChanged}
              />
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

            {filterableFormItems.map((item) => (
              <div key={item.id}>
                <EventListFilterableFormItemDropdown
                  convention={convention}
                  formItem={item}
                  value={
                    ((effectiveFilters.find(({ id }) => id === 'form_items')?.value as
                      | Record<string, string[]>
                      | undefined) ?? {})[item.identifier ?? '']
                  }
                  onChange={(newValue) => {
                    const prevValue = effectiveFilters.find(({ id }) => id === 'form_items');
                    changeFilterValue('form_items', {
                      ...(prevValue?.value as Record<string, string[]> | undefined),
                      [item.identifier ?? '']: newValue,
                    });
                  }}
                />
              </div>
            ))}
          </div>

          <div className="ms-2 flex-grow-1">
            <SearchInput
              label="Search"
              value={effectiveFilters.find(({ id }) => id === 'title_prefix')?.value as string | undefined}
              onChange={titlePrefixChanged}
              iconSet="bootstrap-icons"
            />
          </div>
        </div>

        {myProfile && (
          <>
            <EventListMyRatingSelector
              value={effectiveFilters.find(({ id }) => id === 'my_rating')?.value as number[] | undefined}
              onChange={myRatingFilterChanged}
            />
          </>
        )}
      </div>

      <PageLoadingIndicator visible={loading} iconSet="bootstrap-icons" />
      {loading || !data ? null : (
        <>
          <EventListEvents
            convention={data.convention}
            eventsPaginated={eventsPaginated}
            sortBy={sortBy}
            canReadSchedule={data.currentAbility.can_read_schedule}
            fetchMoreIfNeeded={fetchMoreIfNeeded}
          />
          {fetchMoreInProgress && (
            <div>
              <LoadingIndicator iconSet="bootstrap-icons" /> <em className="text-muted">Loading more events...</em>
            </div>
          )}
          <ErrorDisplay graphQLError={fetchMoreError as ApolloError} />
        </>
      )}
    </>
  );
}

export const Component = EventList;
