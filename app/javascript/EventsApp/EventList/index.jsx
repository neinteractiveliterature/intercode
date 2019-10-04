import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo-hooks';

import { buildFieldFilterCodecs, FilterCodecs } from '../../Tables/FilterUtils';
import ErrorDisplay from '../../ErrorDisplay';
import EventListCategoryDropdown from './EventListCategoryDropdown';
import { EventListEventsQuery } from './queries.gql';
import EventListEvents from './EventListEvents';
import EventListPageSizeControl from './EventListPageSizeControl';
import EventListPagination from './EventListPagination';
import EventListSortDropdown from './EventListSortDropdown';
import useLocalStorageReactTable from '../../Tables/useLocalStorageReactTable';
import useReactRouterReactTable from '../../Tables/useReactRouterReactTable';
import {
  reactTableFiltersToTableResultsFilters,
  reactTableSortToTableResultsSort,
} from '../../Tables/TableUtils';
import usePageTitle from '../../usePageTitle';
import PageLoadingIndicator from '../../PageLoadingIndicator';
import SearchInput from '../../BuiltInFormControls/SearchInput';

const filterCodecs = buildFieldFilterCodecs({
  category: FilterCodecs.integerArray,
});

function EventList({ history }) {
  const {
    page, sorted, filtered, onPageChange: reactTableOnPageChange, onSortedChange, onFilteredChange,
  } = useReactRouterReactTable({ history, ...filterCodecs });
  const { pageSize, onPageSizeChange } = useLocalStorageReactTable('eventList');
  const { data, loading, error } = useQuery(
    EventListEventsQuery,
    {
      variables: {
        page: page + 1,
        pageSize: (pageSize || 20),
        sort: reactTableSortToTableResultsSort(
          sorted && sorted.length > 0
            ? sorted
            : [{ id: 'title', desc: false }],
        ),
        filters: reactTableFiltersToTableResultsFilters(filtered),
      },
    },
  );
  const [cachedConventionName, setCachedConventionName] = useState(null);
  const [cachedEventCategories, setCachedEventCategories] = useState(null);
  const [cachedPageCount, setCachedPageCount] = useState(null);
  const onPageChange = (newPage) => reactTableOnPageChange(newPage - 1);

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

  const totalPages = (loading ? cachedPageCount : eventsPaginated.total_pages);

  const renderPagination = () => (
    <>
      <EventListPagination
        currentPage={page + 1}
        totalPages={totalPages || 0}
        onPageChange={onPageChange}
      />
      <EventListPageSizeControl pageSize={pageSize} onPageSizeChange={onPageSizeChange} />
    </>
  );

  return (
    <>
      <h1 className="text-nowrap">
        Events
        {cachedConventionName && ` at ${cachedConventionName}`}
      </h1>

      <div className="d-flex align-items-start flex-wrap mt-4">
        <div className="flex-grow-1 d-flex flex-wrap">
          {renderPagination()}
        </div>

        <div className="d-flex flex-column flex-sm-row">
          <div className="d-flex flex-row mb-2">
            <div>
              {cachedEventCategories && (
                <EventListCategoryDropdown
                  eventCategories={cachedEventCategories}
                  value={((filtered || []).find(({ id }) => id === 'category') || {}).value}
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
              value={((filtered || []).find(({ id }) => id === 'title_prefix') || {}).value}
              onChange={titlePrefixChanged}
            />
          </div>
        </div>
      </div>

      <PageLoadingIndicator visible={loading} />
      {
        loading
          ? null
          : (
            <>
              <EventListEvents
                convention={data.convention}
                eventsPaginated={eventsPaginated}
                sorted={sorted}
                canReadSchedule={data.currentAbility.can_read_schedule}
              />
              {
                eventsPaginated.entries.length >= 4
                  ? (
                    <div className="d-flex flex-wrap justify-content-center mt-4">
                      {renderPagination()}
                    </div>
                  )
                  : null
              }
            </>
          )
      }
    </>
  );
}

EventList.propTypes = {
  history: PropTypes.shape({}).isRequired,
};

export default EventList;
