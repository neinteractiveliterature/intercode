import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useQuery } from 'react-apollo-hooks';

import { buildFieldFilterCodecs, FilterCodecs } from '../../Tables/FilterUtils';
import ErrorDisplay from '../../ErrorDisplay';
import EventListCategoryDropdown from './EventListCategoryDropdown';
import { EventListCommonDataQuery, EventListEventsQuery } from './queries.gql';
import EventListEvents from './EventListEvents';
import EventListPageSizeControl from './EventListPageSizeControl';
import EventListPagination from './EventListPagination';
import EventListSortDropdown from './EventListSortDropdown';
import LoadingIndicator from '../../LoadingIndicator';
import useLocalStorageReactTable from '../../Tables/useLocalStorageReactTable';
import useReactRouterReactTable from '../../Tables/useReactRouterReactTable';
import {
  reactTableFiltersToTableResultsFilters,
  reactTableSortToTableResultsSort,
} from '../../Tables/TableUtils';
import useQuerySuspended from '../../useQuerySuspended';

const filterCodecs = buildFieldFilterCodecs({
  category: FilterCodecs.integerArray,
});

function EventListBody({ convention, currentAbility, history }) {
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
  const [cachedPageCount, setCachedPageCount] = useState(null);
  const onPageChange = newPage => reactTableOnPageChange(newPage - 1);

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
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
      <EventListPageSizeControl pageSize={pageSize} onPageSizeChange={onPageSizeChange} />
    </>
  );

  return (
    <>
      <div className="d-flex align-items-start flex-wrap mt-4">
        <div className="flex-grow-1 d-flex">
          {renderPagination()}
        </div>

        <div className="d-flex flex-wrap">
          <div className="mb-2">
            <EventListCategoryDropdown
              eventCategories={convention.event_categories}
              value={((filtered || []).find(({ id }) => id === 'category') || {}).value}
              onChange={(value) => {
                onFilteredChange([
                  ...(filtered || []).filter(({ id }) => id !== 'category'),
                  { id: 'category', value },
                ]);
              }}
            />
          </div>

          <div className="ml-2">
            <EventListSortDropdown
              showConventionOrder={currentAbility.can_read_schedule}
              value={sorted}
              onChange={onSortedChange}
            />
          </div>
        </div>
      </div>

      {
        loading
          ? <LoadingIndicator />
          : (
            <>
              <EventListEvents
                convention={convention}
                eventsPaginated={eventsPaginated}
                sorted={sorted}
                canReadSchedule={currentAbility.can_read_schedule}
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

EventListBody.propTypes = {
  convention: PropTypes.shape({
    event_categories: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }).isRequired,
  currentAbility: PropTypes.shape({
    can_read_schedule: PropTypes.bool.isRequired,
  }).isRequired,
  history: PropTypes.shape({}).isRequired,
};

const EventListBodyWithRouter = withRouter(EventListBody);

function EventList() {
  const {
    data: { convention, currentAbility },
    error,
  } = useQuerySuspended(EventListCommonDataQuery);

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <>
      <h1 className="text-nowrap">
        Events at
        {' '}
        {convention.name}
      </h1>

      <EventListBodyWithRouter convention={convention} currentAbility={currentAbility} />
    </>
  );
}

export default withRouter(EventList);
