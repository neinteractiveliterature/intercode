import React from 'react';
import PropTypes from 'prop-types';
import { Set } from 'immutable';
import { detect } from 'detect-browser';

import ConfigPropType from './ConfigPropType';
import ConventionDayTabContainer from './ConventionDayTabContainer';
import QueryWithStateDisplay from '../../QueryWithStateDisplay';
import Schedule from './Schedule';
import { ScheduleGridConventionDataQuery, ScheduleGridEventsQuery, ScheduleGridCombinedQuery } from './queries.gql';
import { timespanFromConvention } from '../../TimespanUtils';

const IS_MOBILE = ['iOS', 'Android OS'].includes(detect().os);

const ScheduleGridContext = React.createContext({
  schedule: {},
  config: {},
  isRunDetailsVisible: () => false,
  toggleRunDetailsVisibility: () => {},
});

export const ScheduleGridConsumer = ScheduleGridContext.Consumer;

export class ScheduleGridProvider extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    config: ConfigPropType.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      visibleRunDetailsIds: new Set(),
    };
  }

  getEventsQueryParams = timespan => ({
    query: ScheduleGridEventsQuery,
    variables: {
      start: timespan.start.toISOString(),
      finish: timespan.finish.toISOString(),
      extendedCounts: this.props.config.showExtendedCounts || false,
    },
  })

  toggleRunDetailsVisibility = (schedule, runId) => {
    if (this.state.visibleRunDetailsIds.contains(runId)) {
      this.setState(prevState => ({
        visibleRunDetailsIds: prevState.visibleRunDetailsIds.subtract([runId]),
      }));

      return false;
    }

    const runTimespan = schedule.getRunTimespan(runId);
    const concurrentRunIds = schedule.getEventRunsOverlapping(runTimespan)
      .map(eventRun => eventRun.runId);

    this.setState(prevState => ({
      visibleRunDetailsIds: prevState.visibleRunDetailsIds.subtract(concurrentRunIds).add(runId),
    }));

    return true;
  }

  renderProvider = (convention, events, timespan) => {
    const schedule = new Schedule(this.props.config, convention, events);

    return (
      <ScheduleGridContext.Provider
        value={{
          schedule,
          convention,
          config: this.props.config,
          isRunDetailsVisible: runId => this.state.visibleRunDetailsIds.contains(runId),
          toggleRunDetailsVisibility: this.toggleRunDetailsVisibility,
        }}
      >
        {this.props.children(timespan)}
      </ScheduleGridContext.Provider>
    );
  }

  render = () => {
    const combinedQueryParams = {
      query: ScheduleGridCombinedQuery,
      variables: { extendedCounts: this.props.config.showExtendedCounts || false },
    };

    if (IS_MOBILE) {
      // We can't detect hovers on mobile, so prefetching isn't an option - just fetch all
      // the data on the first request

      return (
        <QueryWithStateDisplay {...combinedQueryParams}>
          {({ data: { convention, events }, client }) => (
            <ConventionDayTabContainer
              basename={this.props.config.basename}
              conventionTimespan={timespanFromConvention(convention)}
              timezoneName={convention.timezone_name}
              refreshData={() => client.query({ ...combinedQueryParams, fetchPolicy: 'network-only' })}
            >
              {timespan => this.renderProvider(convention, events, timespan)}
            </ConventionDayTabContainer>
          )}
        </QueryWithStateDisplay>
      );
    }

    return (
      <QueryWithStateDisplay query={ScheduleGridConventionDataQuery}>
        {({ data: { convention }, client }) => (
          <ConventionDayTabContainer
            basename={this.props.config.basename}
            conventionTimespan={timespanFromConvention(convention)}
            timezoneName={convention.timezone_name}
            prefetchTimespan={timespan => client.query(this.getEventsQueryParams(timespan))}
            refreshData={() => client.query({ ...combinedQueryParams, fetchPolicy: 'network-only' })}
          >
            {timespan => (
              <QueryWithStateDisplay {...this.getEventsQueryParams(timespan)}>
                {({ data: { events } }) => this.renderProvider(convention, events, timespan)}
              </QueryWithStateDisplay>
            )}
          </ConventionDayTabContainer>
        )}
      </QueryWithStateDisplay>
    );
  }
}
