// @flow

import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';
import { gql, graphql } from 'react-apollo';
import { propType } from 'graphql-anywhere';
import LoadingIndicator from '../LoadingIndicator';
import EventRun from '../PCSG/EventRun';
import ScheduleBlock, { ScheduleLayoutResult } from '../PCSG/ScheduleBlock';
import Timespan from '../PCSG/Timespan';
import ScheduleGridEventRun from './ScheduleGridEventRun';

const ScheduleQuery = gql`
query {
  convention {
    starts_at
    ends_at
    timezone_name
  }

  events {
    id
    title
    length_seconds
    category
    short_blurb_html

    registration_policy {
      slots_limited
      total_slots
    }

    runs {
      id
      starts_at
      schedule_note
      title_suffix

      confirmed_signup_count

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

const PIXELS_PER_HOUR = 100;
const PIXELS_PER_LANE = 30;

function GraphQLPropType(query, rootKey) {
  return (props) => {
    if (!props.loading) {
      return propType(query)(props[rootKey]);
    }

    return undefined;
  };
}

function formatTime(time: moment, timezoneName: string): string {
  const timeInZone = time.tz(timezoneName);
  let phrasing: string;
  if (timeInZone.hour() === 0) {
    phrasing = 'Midnight';
  } else if (timeInZone.hour() === 12) {
    phrasing = 'Noon';
  } else {
    phrasing = timeInZone.format('h:mma');
  }

  return phrasing;
}

@graphql(ScheduleQuery)
class ScheduleGrid extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      events: GraphQLPropType(ScheduleQuery, 'events'),
      convention: GraphQLPropType(ScheduleQuery, 'convention'),
      loading: PropTypes.boolean,
      error: PropTypes.object,
    }),
  };

  static defaultProps = {
    data: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      conventionDay: null,
    };
  }

  componentWillReceiveProps = (nextProps: any) => {
    const { data } = nextProps;

    if (data.loading || data.error) {
      this.eventsById = new Map();
      this.runsById = new Map();
      return;
    }

    this.eventsById = new Map(data.events.map(event => [event.id, event]));
    this.runsById = new Map(data.events.map(event => (
      event.runs.map(run => [run.id, { ...run, event_id: event.id }])
    )).reduce(
      (runEntries, entriesForEvent) => [...runEntries, ...entriesForEvent], [],
    ));

    this.conventionTimespan = new Timespan(
      moment(data.convention.starts_at),
      moment(data.convention.ends_at),
    );

    this.conventionDays = [];
    const now = this.conventionTimespan.start.clone().tz(data.convention.timezone_name).startOf('day');
    while (now.isBefore(this.conventionTimespan.finish)) {
      this.conventionDays.push(now.clone().add(6, 'hours')); // start convention days at 6am
      now.add(1, 'day');
    }

    if (this.state.conventionDay == null) {
      this.setState({ conventionDay: this.conventionDays[0] });
    }
  }

  getPixelWidth = (timespan: Timespan): number => timespan.getLength('hour') * PIXELS_PER_HOUR

  runsById: Map<number, any>;
  eventsById: Map<number, any>;
  eventsByCategory: Map<string, Array<any>>;
  conventionTimespan: Timespan;
  conventionDays: Array<moment>;

  buildScheduleBlock = (events: Array<any>): ScheduleBlock => {
    const eventRuns = EventRun.buildEventRunsFromApi(events);
    return new ScheduleBlock(this.conventionTimespan, eventRuns);
  }

  groupEventRunsByCategory = (eventRuns: Array<EventRun>): Map<string, Array<any>> => (
    eventRuns.reduce(
      (eventRunsByCategory, eventRun) => {
        const { runId } = eventRun;
        const run = this.runsById.get(runId);
        const event = this.eventsById.get(run.event_id);
        const { category } = event;

        if (!eventRunsByCategory.has(category)) {
          eventRunsByCategory.set(category, []);
        }

        return eventRunsByCategory.set(category, eventRunsByCategory.get(category).concat(eventRun));
      },
      new Map(),
    )
  )

  setConventionDay = (conventionDay: moment) => {
    this.setState({ conventionDay });
  }

  renderEvents = (layoutResult: ScheduleLayoutResult, options: any = {}): Array<*> => (
    layoutResult.runDimensions.map((runDimensions) => {
      const eventRun = runDimensions.eventRun;
      const run = this.runsById.get(eventRun.runId);
      const event = this.eventsById.get(run.event_id);

      return (
        <ScheduleGridEventRun
          key={run.id}
          layoutResult={layoutResult}
          runDimensions={runDimensions}
          event={event}
          run={run}
          convention={this.props.data.convention}
          options={options}
        />
      );
    })
  )

  renderHours = (timespan: Timespan) => {
    const hourCount = timespan.getLength('hour');

    const now = timespan.start.clone();
    const hourDivs = [];
    while (timespan.includesTime(now)) {
      const left = (now.diff(timespan.start, 'hour') / hourCount) * 100;

      hourDivs.push(
        <div key={now.toISOString()} style={{ position: 'absolute', left: `${left}%` }} className="text-muted ml-1">
          {formatTime(now, this.props.data.convention.timezone_name)}
        </div>
      );

      now.add(1, 'hour');
    }

    return hourDivs;
  }

  renderScheduleBlock(scheduleBlock: ScheduleBlock, key: any, options: any = {}) {
    const layoutResult = scheduleBlock.computeRunDimensionsWithoutSpanning();
    const runDivs = this.renderEvents(layoutResult, options);
    const gridStyle = {
      position: 'relative',
      width: `${this.getPixelWidth(scheduleBlock.timespan)}px`,
      height: `${layoutResult.laneCount * PIXELS_PER_LANE}px`,
    };

    return (
      <div style={gridStyle} key={key}>
        {runDivs}
      </div>
    );
  }

  renderGridWithEventRuns = (eventRuns: Array<EventRun>, gridTimespan: Timespan): ?React$Element<*> => {
    const maxTimespan = eventRuns.reduce(
      (timespan, eventRun) => timespan.expandedToFit(eventRun.timespan),
      eventRuns.length > 0 ? eventRuns[0].timespan : gridTimespan,
    );

    const eventRunsByCategory = this.groupEventRunsByCategory(eventRuns);

    const volunteerEventRuns = eventRunsByCategory.get('volunteer_event') || [];
    const otherEventRuns = [...eventRunsByCategory.entries()].map(([category, eventRunsInCategory]) => {
      if (category === 'volunteer_event') {
        return [];
      }

      return eventRunsInCategory;
    }).reduce((eventRunList, categoryEventRuns) => [...eventRunList, ...categoryEventRuns], []);

    const scheduleBlocks = [
      [new ScheduleBlock(maxTimespan, otherEventRuns)],
      [new ScheduleBlock(maxTimespan, volunteerEventRuns)],
    ];


    const hourDivs = this.renderHours(maxTimespan);
    const scheduleBlockDivs = scheduleBlocks.map(
      ([scheduleBlock, options], i) => this.renderScheduleBlock(scheduleBlock, i, options),
    );

    const gridLineStyle = {
      backgroundImage: 'linear-gradient(90deg, rgba(0, 0, 0, .1) 0%, rgba(0, 0, 0, .1) 1%, transparent 2%, transparent)',
      backgroundSize: `${PIXELS_PER_HOUR}px ${PIXELS_PER_LANE}px`,
      minHeight: '300px',
    };

    return (
      <div className="schedule-grid mb-4 bg-light" style={{ overflowX: 'auto' }}>
        <div style={{ ...gridLineStyle, display: 'inline-block' }}>
          <div style={{ width: this.getPixelWidth(maxTimespan), height: '2em', position: 'relative' }} className="small mt-1">
            {hourDivs}
          </div>
          {scheduleBlockDivs}
        </div>
      </div>
    );
  }

  render = () => {
    const { data } = this.props;

    if (data.loading) {
      return <LoadingIndicator />;
    }
    if (data.error) {
      return <div className="alert alert-danger">{this.props.data.error.message}</div>;
    }

    const conventionDayTabs = this.conventionDays.map(conventionDay => (
      <li className="nav-item" key={conventionDay.toISOString()}>
        <a // eslint-disable-line jsx-a11y/href-no-hash
          className={classNames('nav-link', { active: conventionDay.isSame(this.state.conventionDay) })}
          href="#"
          onClick={() => this.setConventionDay(conventionDay)}
        >
          {conventionDay.format('dddd')}
        </a>
      </li>
    ));

    const eventRuns = EventRun.buildEventRunsFromApi(this.props.data.events);

    const conventionDayTimespan = new Timespan(this.state.conventionDay, this.state.conventionDay.clone().add(1, 'day'));
    const conventionDayEvents = eventRuns.filter(eventRun => conventionDayTimespan.overlapsTimespan(eventRun.timespan));

    return (
      <div>
        <ul className="nav nav-tabs">
          {conventionDayTabs}
        </ul>
        {this.renderGridWithEventRuns(conventionDayEvents, conventionDayTimespan)}
      </div>
    );
  }
}

export default ScheduleGrid;
