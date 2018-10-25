import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter } from 'react-router-dom';
import { humanize } from 'inflected';
import moment from 'moment-timezone';
import arrayToSentence from 'array-to-sentence';
import Pagination from 'react-js-pagination';
import { timespanFromConvention, getConventionDayTimespans } from '../TimespanUtils';

import CombinedReactTableConsumer from '../Tables/CombinedReactTableConsumer';
import { EventListQuery } from './queries.gql';
import EventListSortDropdown from './EventListSortDropdown';
import QueryWithStateDisplay from '../QueryWithStateDisplay';
import { ReactRouterReactTableProvider, ReactRouterReactTableConsumer } from '../Tables/ReactRouterReactTableContext';
import {
  reactTableFiltersToTableResultsFilters,
  reactTableSortToTableResultsSort,
} from '../Tables/TableUtils';

function getSortedRuns(event) {
  return [...event.runs].sort((a, b) => (
    moment(a.starts_at).valueOf() - moment(b.starts_at).valueOf()
  ));
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

  renderPagination = (data, onPageChange) => {
    const {
      current_page: currentPage,
      total_pages: totalPages,
    } = data.convention.events_paginated;

    return (
      <nav>
        <Pagination
          totalItemsCount={totalPages}
          activePage={currentPage}
          onChange={onPageChange}
          itemsCountPerPage={1}
          innerClass="pagination justify-content-center mt-4"
          itemClass="page-item"
          linkClass="page-link"
        />
      </nav>
    );
  }

  renderEvents = (data, sorted) => {
    let previousConventionDay = null;
    const conventionDayTimespans = getConventionDayTimespans(
      timespanFromConvention(data.convention),
      data.convention.timezone_name,
    );

    return data.convention.events_paginated.entries.map((event) => {
      let preamble = null;
      if (sorted.some(sort => sort.id === 'first_scheduled_run_start')) {
        const runs = getSortedRuns(event);
        if (runs.length > 0) {
          const conventionDay = conventionDayTimespans.find(timespan => timespan.includesTime(
            moment.tz(runs[0].starts_at, data.convention.timezone_name),
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
            data.convention.timezone_name,
          )}
        </React.Fragment>
      );
    });
  }

  render = () => (
    <BrowserRouter basename={this.props.basename}>
      <ReactRouterReactTableProvider>
        <CombinedReactTableConsumer consumers={[ReactRouterReactTableConsumer]}>
          {({ page, sorted, onPageChange, onSortedChange }) => (
            <QueryWithStateDisplay
              query={EventListQuery}
              variables={{
                page: (page || 1),
                sort: reactTableSortToTableResultsSort(sorted || [{ id: 'title', desc: 'false' }]),
              }}
            >
              {({ data }) => (
                <React.Fragment>
                  <div className="d-flex align-items-center flex-wrap">
                    <div className="col p-0">
                      <h1 className="text-nowrap">
                        Events at
                        {' '}
                        {data.convention.name}
                      </h1>
                    </div>
                    <EventListSortDropdown
                      showConventionOrder={data.myProfile.ability.can_read_schedule}
                      value={sorted}
                      onChange={onSortedChange}
                    />
                  </div>

                  {this.renderPagination(data, onPageChange)}
                  {this.renderEvents(data, sorted)}
                  {this.renderPagination(data, onPageChange)}
                </React.Fragment>
              )}
            </QueryWithStateDisplay>
          )}
        </CombinedReactTableConsumer>
      </ReactRouterReactTableProvider>
    </BrowserRouter>
  )
}

export default EventList;
