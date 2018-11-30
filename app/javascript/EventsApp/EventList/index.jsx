import React from 'react';
import moment from 'moment-timezone';
import Pagination from 'react-js-pagination';
import classNames from 'classnames';

import CombinedReactTableConsumer from '../../Tables/CombinedReactTableConsumer';
import { decodeStringArray, encodeStringArray } from '../../Tables/FilterUtils';
import EventCard from './EventCard';
import EventListCategoryDropdown from './EventListCategoryDropdown';
import { EventListCommonDataQuery, EventListEventsQuery } from './queries.gql';
import EventListSortDropdown from './EventListSortDropdown';
import getSortedRuns from './getSortedRuns';
import QueryWithStateDisplay from '../../QueryWithStateDisplay';
import { ReactRouterReactTableProvider, ReactRouterReactTableConsumer } from '../../Tables/ReactRouterReactTableContext';
import {
  reactTableFiltersToTableResultsFilters,
  reactTableSortToTableResultsSort,
} from '../../Tables/TableUtils';
import { timespanFromConvention, getConventionDayTimespans } from '../../TimespanUtils';

function decodeFilterValue(field, value) {
  if (field === 'category') {
    return decodeStringArray(value);
  }

  return value;
}

function encodeFilterValue(field, value) {
  if (field === 'category') {
    return encodeStringArray(value);
  }

  return value;
}

class EventList extends React.Component {
  renderPagination = (eventsPaginated, onPageChange, extraClasses) => {
    const {
      current_page: currentPage,
      total_pages: totalPages,
    } = eventsPaginated;

    return (
      <nav>
        <Pagination
          totalItemsCount={totalPages}
          activePage={currentPage}
          onChange={onPageChange}
          itemsCountPerPage={1}
          innerClass={classNames('pagination', extraClasses)}
          itemClass="page-item"
          linkClass="page-link"
          hideNavigation
          hideFirstLastPages
          ellipsis
        />
      </nav>
    );
  }

  renderEvents = (convention, eventsPaginated, sorted) => {
    let previousConventionDay = null;
    const conventionDayTimespans = getConventionDayTimespans(
      timespanFromConvention(convention),
      convention.timezone_name,
    );

    return eventsPaginated.entries.map((event) => {
      let preamble = null;
      if (sorted.some(sort => sort.id === 'first_scheduled_run_start')) {
        const runs = getSortedRuns(event);
        if (runs.length > 0) {
          const conventionDay = conventionDayTimespans.find(timespan => timespan.includesTime(
            moment.tz(runs[0].starts_at, convention.timezone_name),
          ));
          if (
            conventionDay
            && (previousConventionDay == null || !previousConventionDay.isSame(conventionDay))
          ) {
            preamble = (
              <h3 className="mt-4">
                {conventionDay.start.format('dddd, MMMM D')}
              </h3>
            );
            previousConventionDay = conventionDay;
          }
        }
      }

      return (
        <React.Fragment key={event.id}>
          {preamble}
          <EventCard
            event={event}
            sorted={sorted}
            timezoneName={convention.timezone_name}
          />
        </React.Fragment>
      );
    });
  }

  renderPageSizeControl = ({ pageSize, onPageSizeChange }) => (
    <div className="form-inline align-items-start">
      <select
        className="form-control mx-1"
        value={pageSize.toString()}
        onChange={(event) => { onPageSizeChange(Number.parseInt(event.target.value, 10)); }}
      >
        {[10, 20, 50, 100, 200].map(pageSizeOption => (
          <option value={pageSizeOption.toString()} key={pageSizeOption}>
            {pageSizeOption}
            {' '}
            per page
          </option>
        ))}
      </select>
    </div>
  )

  renderBottomPagination = ({
    eventsPaginated, onPageChange, pageSize, onPageSizeChange,
  }) => {
    if (eventsPaginated.entries.length < 4) {
      return null;
    }

    return (
      <div className="d-flex flex-wrap justify-content-center mt-4">
        {this.renderPagination(eventsPaginated, onPageChange)}
        {this.renderPageSizeControl({ pageSize, onPageSizeChange })}
      </div>
    );
  }

  render = () => (
    <QueryWithStateDisplay query={EventListCommonDataQuery}>
      {({ data: { convention, currentAbility } }) => (
        <ReactRouterReactTableProvider
          decodeFilterValue={decodeFilterValue}
          encodeFilterValue={encodeFilterValue}
        >
          <CombinedReactTableConsumer consumers={[ReactRouterReactTableConsumer]}>
            {({
              page,
              sorted,
              filtered,
              pageSize,
              onPageChange,
              onSortedChange,
              onFilteredChange,
              onPageSizeChange,
            }) => (
              <React.Fragment>
                <h1 className="text-nowrap">
                  Events at
                  {' '}
                  {convention.name}
                </h1>

                <QueryWithStateDisplay
                  query={EventListEventsQuery}
                  variables={{
                    page: (page || 1),
                    pageSize: (pageSize || 20),
                    sort: reactTableSortToTableResultsSort(
                      sorted && sorted.length > 0
                        ? sorted
                        : [{ id: 'title', desc: false }],
                    ),
                    filters: reactTableFiltersToTableResultsFilters(filtered),
                  }}
                >
                  {({ data: { convention: { events_paginated: eventsPaginated } } }) => (
                    <React.Fragment>
                      <div className="d-flex align-items-start flex-wrap mt-4">
                        <div className="flex-grow-1 d-flex">
                          {this.renderPagination(eventsPaginated, onPageChange)}
                          {this.renderPageSizeControl({ pageSize, onPageSizeChange })}
                        </div>

                        <div className="d-flex flex-wrap">
                          <div className="mb-2">
                            <EventListCategoryDropdown
                              categoryKeys={convention.event_category_keys}
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

                      {this.renderEvents(convention, eventsPaginated, sorted)}
                      {this.renderBottomPagination({
                        eventsPaginated, onPageChange, pageSize, onPageSizeChange,
                      })}
                    </React.Fragment>
                  )}
                </QueryWithStateDisplay>
              </React.Fragment>
            )}
          </CombinedReactTableConsumer>
        </ReactRouterReactTableProvider>
      )}
    </QueryWithStateDisplay>
  )
}

export default EventList;
