import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Set } from 'immutable';

import ConfigPropType from './ConfigPropType';
import QueryWithStateDisplay from '../QueryWithStateDisplay';
import Schedule from './Schedule';

const ScheduleGridContext = React.createContext({
  schedule: {},
  isRunDetailsVisible: () => false,
  toggleRunDetailsVisibility: () => {},
});

export const ScheduleGridConsumer = ScheduleGridContext.Consumer;

const scheduleQuery = gql`
query($extendedCounts: Boolean!) {
  convention {
    starts_at
    ends_at
    timezone_name
  }

  events(extendedCounts: $extendedCounts) {
    id
    title
    length_seconds
    category
    short_blurb_html
    event_page_url

    registration_policy {
      slots_limited
      total_slots
      preferred_slots
      minimum_slots
    }

    runs {
      id
      starts_at
      schedule_note
      title_suffix

      confirmed_limited_signup_count
      confirmed_signup_count @include(if: $extendedCounts)
      waitlisted_signup_count @include(if: $extendedCounts)
      not_counted_signup_count @include(if: $extendedCounts)

      rooms {
        name
      }

      my_signups {
        state
      }
    }
  }
}
`;

export class ScheduleGridProvider extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    config: ConfigPropType.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      visibleRunDetailsIds: new Set(),
    };
  }

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

  render = () => (
    <QueryWithStateDisplay
      query={scheduleQuery}
      variables={{
        extendedCounts: this.props.config.showExtendedCounts || false,
      }}
    >
      {({ data }) => {
        const schedule = new Schedule(this.props.config, data);

        return (
          <ScheduleGridContext.Provider
            value={{
              schedule,
              isRunDetailsVisible: runId => this.state.visibleRunDetailsIds.contains(runId),
              toggleRunDetailsVisibility: this.toggleRunDetailsVisibility,
            }}
          >
            {this.props.children}
          </ScheduleGridContext.Provider>
        );
      }}
    </QueryWithStateDisplay>
  )
}
