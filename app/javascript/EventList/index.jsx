import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter } from 'react-router-dom';
import { humanize } from 'inflected';
import moment from 'moment-timezone';
import arrayToSentence from 'array-to-sentence';
import Pagination from 'react-js-pagination';
import classNames from 'classnames';

import CombinedReactTableConsumer from '../Tables/CombinedReactTableConsumer';
import { decodeStringArray, encodeStringArray } from '../Tables/FilterUtils';
import EventListCategoryDropdown from './EventListCategoryDropdown';
import { EventListCommonDataQuery, EventListEventsQuery } from './queries.gql';
import EventListSortDropdown from './EventListSortDropdown';
import QueryWithStateDisplay from '../QueryWithStateDisplay';
import { ReactRouterReactTableProvider, ReactRouterReactTableConsumer } from '../Tables/ReactRouterReactTableContext';
import {
  reactTableFiltersToTableResultsFilters,
  reactTableSortToTableResultsSort,
} from '../Tables/TableUtils';
import { timespanFromConvention, getConventionDayTimespans } from '../TimespanUtils';

function getSortedRuns(event) {
  return [...event.runs].sort((a, b) => (
    moment(a.starts_at).valueOf() - moment(b.starts_at).valueOf()
  ));
}

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

class EventList extends React.PureComponent {
  static propTypes = {
    basename: PropTypes.string.isRequired,
  }

  renderFirstRunTime = (event, timezoneName) => {
    if (event.runs.length > 0) {
      const firstRunsSorted = getSortedRuns(event).slice(0, 4);

      return arrayToSentence([
        ...firstRunsSorted.map(run => (
          moment.tz(run.starts_at, timezoneName).format('dddd h:mma')
        )),
        ...(
          event.runs.length > firstRunsSorted.length
            ? [`${event.runs.length - firstRunsSorted.length} more`]
            : []
        ),
      ]);
    }

    return 'Unscheduled';
  }

  renderEventCard = (event, sorted, timezoneName) => {
    const formResponse = JSON.parse(event.form_response_attrs_json);
    const authorOrOrg = formResponse.author || formResponse.organization;

    return (
      <div className="card my-4" key={event.id}>
        <div className="card-header">
          <h4 className="m-0">
            <a href={`/events/${event.id}`}>{event.title}</a>
            {
              event.category !== 'filler'
                ? (
                  <small className="text-muted">
                    {' '}
                    &mdash;
                    {' '}
                    {humanize(event.category)}
                  </small>
                )
                : null
            }
          </h4>
          {
            authorOrOrg
              ? (
                <p className="m-0">
                  <em>
                    by
                    {' '}
                    {authorOrOrg}
                  </em>
                </p>
              )
              : null
          }
          <p className="m-0">
            {
              sorted.some(sort => sort.id === 'created_at')
                ? (
                  <strong>
                    Added
                    {' '}
                    {moment.tz(event.created_at, timezoneName).format('dddd, MMMM D, YYYY [at] h:mma')}
                  </strong>
                )
                : null
            }
            {
              sorted.some(sort => sort.id === 'first_scheduled_run_start')
                ? (
                  <strong>
                    {this.renderFirstRunTime(event, timezoneName)}
                  </strong>
                )
                : null
            }
          </p>
        </div>

        <div
          className="card-body"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: event.short_blurb_html }}
        />
      </div>
    );
  }

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
          {this.renderEventCard(
            event,
            sorted,
            convention.timezone_name,
          )}
        </React.Fragment>
      );
    });
  }

  render = () => (
    <BrowserRouter basename={this.props.basename}>
      <QueryWithStateDisplay query={EventListCommonDataQuery}>
        {({ data: { convention, myProfile } }) => (
          <ReactRouterReactTableProvider
            decodeFilterValue={decodeFilterValue}
            encodeFilterValue={encodeFilterValue}
          >
            <CombinedReactTableConsumer consumers={[ReactRouterReactTableConsumer]}>
              {({
                page, sorted, filtered, onPageChange, onSortedChange, onFilteredChange,
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
                      sort: reactTableSortToTableResultsSort(sorted || [{ id: 'title', desc: 'false' }]),
                      filters: reactTableFiltersToTableResultsFilters(filtered),
                    }}
                  >
                    {({ data: { convention: { events_paginated: eventsPaginated } } }) => (
                      <React.Fragment>
                        <div className="d-flex align-items-start flex-wrap mt-4">
                          <div className="flex-grow-1">
                            {this.renderPagination(eventsPaginated, onPageChange)}
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
                                showConventionOrder={myProfile.ability.can_read_schedule}
                                value={sorted}
                                onChange={onSortedChange}
                              />
                            </div>
                          </div>
                        </div>

                        {this.renderEvents(convention, eventsPaginated, sorted)}

                        {
                          eventsPaginated.entries.length > 3
                            ? this.renderPagination(eventsPaginated, onPageChange, 'justify-content-center mt-4')
                            : null
                        }
                      </React.Fragment>
                    )}
                  </QueryWithStateDisplay>
                </React.Fragment>
              )}
            </CombinedReactTableConsumer>
          </ReactRouterReactTableProvider>
        )}
      </QueryWithStateDisplay>
    </BrowserRouter>
  )
}

export default EventList;
