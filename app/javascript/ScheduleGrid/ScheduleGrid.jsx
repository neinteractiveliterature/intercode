import React from 'react';
import moment from 'moment-timezone';
import { gql, graphql } from 'react-apollo';
import { NavLink, Redirect, Route, Switch } from 'react-router-dom';
import ConfigPropType, { defaultConfigProp } from './ConfigPropType';
import GraphQLResultPropType from '../GraphQLResultPropType';
import GraphQLQueryResultWrapper from '../GraphQLQueryResultWrapper';
import LoadingIndicator from '../LoadingIndicator';
import EventRun from '../PCSG/EventRun';
import ScheduleBlock from '../PCSG/ScheduleBlock';
import Timespan from '../PCSG/Timespan';
import ScheduleGridEventRun from './ScheduleGridEventRun';
import computeRunDimensionsWithoutSpanning from '../PCSG/computeRunDimensionsWithoutSpanning';

const ScheduleQuery = gql`
query($extendedCounts: Boolean!) {
  convention {
    starts_at
    ends_at
    timezone_name

    away_blocks @include(if: $extendedCounts) {
      start
      finish
    }
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

      confirmed_signup_count
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

const PIXELS_PER_HOUR = 100;
const PIXELS_PER_LANE = 30;

function formatTime(time, timezoneName) {
  const timeInZone = time.tz(timezoneName);
  let phrasing;
  if (timeInZone.hour() === 0) {
    phrasing = 'Midnight';
  } else if (timeInZone.hour() === 12) {
    phrasing = 'Noon';
  } else {
    phrasing = timeInZone.format('h:mma');
  }

  return phrasing;
}

@graphql(
  ScheduleQuery,
  {
    options: props => ({
      variables: {
        extendedCounts: props.config.showExtendedCounts || false,
      },
    }),
  },
)
@GraphQLQueryResultWrapper
class ScheduleGrid extends React.Component {
  static propTypes = {
    data: GraphQLResultPropType(ScheduleQuery, 'events', 'convention').isRequired,
    config: ConfigPropType,
  };

  static defaultProps = {
    config: defaultConfigProp,
  };

  constructor(props) {
    super(props);
    this.recalculateGridFromProps(props);
  }

  componentWillReceiveProps = (nextProps) => {
    this.recalculateGridFromProps(nextProps);
  }

  getPixelWidth = timespan => timespan.getLength('hour') * PIXELS_PER_HOUR

  setConventionDay = (conventionDay) => {
    this.setState({ conventionDay });
  }

  recalculateGridFromProps = (nextProps) => {
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

    this.conventionDays = this.conventionTimespan.getTimeHopsWithin(
      data.convention.timezone_name,
      'day',
      moment.duration(6, 'hours'), // start convention days at 6:00am
    );
  }

  buildScheduleBlock = (events) => {
    const eventRuns = EventRun.buildEventRunsFromApi(events);
    return new ScheduleBlock(this.conventionTimespan, eventRuns);
  }

  groupEventRunsByCategory = eventRuns => (
    eventRuns.reduce(
      (eventRunsByCategory, eventRun) => {
        const { runId } = eventRun;
        const run = this.runsById.get(runId);
        const event = this.eventsById.get(run.event_id);
        const { category } = event;

        if (!eventRunsByCategory.has(category)) {
          eventRunsByCategory.set(category, []);
        }

        return eventRunsByCategory.set(
          category,
          eventRunsByCategory.get(category).concat(eventRun),
        );
      },
      new Map(),
    )
  )

  renderEvents = layoutResult => (
    layoutResult.runDimensions.map((runDimensions) => {
      const eventRun = runDimensions.eventRun;
      const run = this.runsById.get(eventRun.runId);
      if (run == null) {
        return null;
      }

      const event = this.eventsById.get(run.event_id);
      if (event == null) {
        return null;
      }

      let className;

      if (this.props.config.classifyEventsBy === 'category') {
        className = `event-category-${event.category.replace(/_/g, '-')}`;
      } else if (this.props.config.classifyEventsBy === 'fullness') {
        if (!event.registration_policy.slots_limited) {
          className = 'event-fullness-unlimited';
        } else if (run.confirmed_signup_count >= event.registration_policy.total_slots) {
          className = 'event-fullness-full';
        } else if (run.confirmed_signup_count >= event.registration_policy.preferred_slots) {
          className = 'event-fullness-preferred';
        } else if (run.confirmed_signup_count >= event.registration_policy.minimum_slots) {
          className = 'event-fullness-minimum';
        } else {
          className = 'event-fullness-below-minimum';
        }
      }

      return (
        <ScheduleGridEventRun
          key={run.id}
          layoutResult={layoutResult}
          runDimensions={runDimensions}
          event={event}
          run={run}
          convention={this.props.data.convention}
          className={className}
          config={this.props.config}
        />
      );
    })
  )

  renderHours = (timespan, eventRuns) => {
    const now = timespan.start.clone();
    const hourDivs = [];
    while (timespan.includesTime(now)) {
      let extendedCounts = null;
      if (this.props.config.showExtendedCounts) {
        const hourTimespan = new Timespan(now, now.clone().add(1, 'hour'));
        const hourEventRuns = eventRuns.filter(
          eventRun => hourTimespan.overlapsTimespan(eventRun.timespan),
        );
        const awayTimespans = this.props.data.convention.away_blocks.map(awayBlock => (
          new Timespan(moment(awayBlock.start), moment(awayBlock.finish))
        ));

        const hourRunData = hourEventRuns.map((eventRun) => {
          const run = this.runsById.get(eventRun.runId);
          const event = this.eventsById.get(run.event_id);
          return { eventRun, run, event };
        });

        const minimumSlots = hourRunData.reduce(
          (sum, runData) => sum + runData.event.registration_policy.minimum_slots,
          0,
        );

        const preferredSlots = hourRunData.reduce(
          (sum, runData) => sum + runData.event.registration_policy.preferred_slots,
          0,
        );

        const totalSlots = hourRunData.reduce(
          (sum, runData) => sum + runData.event.registration_policy.total_slots,
          0,
        );

        const confirmedSignups = hourRunData.reduce(
          (sum, runData) => sum + runData.run.confirmed_signup_count,
          0,
        );

        const notCountedSignups = hourRunData.reduce(
          (sum, runData) => sum + runData.run.not_counted_signup_count,
          0,
        );

        const waitlistedSignups = hourRunData.reduce(
          (sum, runData) => sum + runData.run.waitlisted_signup_count,
          0,
        );

        const awayCount = awayTimespans.filter(
          awayTimespan => awayTimespan.overlapsTimespan(hourTimespan),
        ).length;

        const playerCount = confirmedSignups + notCountedSignups + waitlistedSignups + awayCount;

        extendedCounts = (
          <div className="schedule-grid-hour-extended-counts">
            <div>{minimumSlots}/{preferredSlots}/{totalSlots}</div>
            <div>
              <span className="text-success">{confirmedSignups}</span>
              {'/'}
              <span className="text-info">{notCountedSignups}</span>
              {'/'}
              <span className="text-danger">{waitlistedSignups}</span>
              {'/'}
              {awayCount}
            </div>
            <div>Players: {playerCount}</div>
          </div>
        );
      }

      hourDivs.push(
        <div key={now.toISOString()} style={{ width: `${PIXELS_PER_HOUR}px`, overflow: 'hidden' }}>
          <div className="small text-muted ml-1">
            {formatTime(now, this.props.data.convention.timezone_name)}
            {extendedCounts}
          </div>
        </div>,
      );

      now.add(1, 'hour');
    }

    return hourDivs;
  }

  renderScheduleBlock(scheduleBlock, key, options = {}) {
    const layoutResult = computeRunDimensionsWithoutSpanning(scheduleBlock);
    const runDivs = this.renderEvents(layoutResult, options);
    const blockContentStyle = {
      position: 'relative',
      width: `${this.getPixelWidth(scheduleBlock.timespan)}px`,
      height: `${layoutResult.laneCount * PIXELS_PER_LANE}px`,
    };

    return (
      <div className="schedule-grid-block" style={{ flexGrow: (options.flexGrow ? 1 : null) }} key={key}>
        <div style={blockContentStyle}>
          {runDivs}
        </div>
      </div>
    );
  }

  renderGridWithEventRuns = (eventRuns, gridTimespan) => {
    const maxTimespan = eventRuns.reduce(
      (timespan, eventRun) => timespan.expandedToFit(eventRun.timespan),
      eventRuns.length > 0 ? eventRuns[0].timespan : gridTimespan,
    );

    const eventRunsByCategory = this.groupEventRunsByCategory(eventRuns);

    const volunteerEventRuns = eventRunsByCategory.get('volunteer_event') || [];
    const panelEventRuns = eventRunsByCategory.get('panel') || [];
    const otherEventRuns = [...eventRunsByCategory.entries()].map(
      ([category, eventRunsInCategory]) => {
        if (category === 'volunteer_event' || category === 'panel') {
          return [];
        }

        return eventRunsInCategory;
      },
    ).reduce((eventRunList, categoryEventRuns) => [...eventRunList, ...categoryEventRuns], []);

    const scheduleBlocks = [
      [new ScheduleBlock(maxTimespan, panelEventRuns)],
      [new ScheduleBlock(maxTimespan, otherEventRuns), { flexGrow: 1 }],
      [new ScheduleBlock(maxTimespan, volunteerEventRuns)],
    ].filter(scheduleBlock => scheduleBlock[0].eventRuns.length > 0);

    const hourDivs = this.renderHours(maxTimespan, eventRuns);
    const scheduleBlockDivs = scheduleBlocks.map(
      ([scheduleBlock, options], i) => this.renderScheduleBlock(scheduleBlock, i, options),
    );

    return (
      <div className="schedule-grid mb-4 bg-light" style={{ overflowX: 'auto' }}>
        <div className="schedule-grid-content" style={{ backgroundSize: `${PIXELS_PER_HOUR}px ${PIXELS_PER_LANE}px` }}>
          <div className="mt-1 d-flex">
            {hourDivs}
          </div>
          {scheduleBlockDivs}
        </div>
      </div>
    );
  }

  render = () => {
    const { data } = this.props;

    const conventionDayTabs = this.conventionDays.map(conventionDay => (
      <li className="nav-item" key={conventionDay.toISOString()}>
        <NavLink to={`/${conventionDay.format('dddd').toLowerCase()}`} className="nav-link">
          <span className="d-inline d-md-none">
            {conventionDay.format('ddd')}
          </span>
          <span className="d-none d-md-inline">
            {conventionDay.format('dddd')}
          </span>
        </NavLink>
      </li>
    ));

    const eventRuns = EventRun.buildEventRunsFromApi(data.events);

    const conventionDayGrids = this.conventionDays.map((conventionDay) => {
      const conventionDayTimespan = new Timespan(conventionDay, conventionDay.clone().add(1, 'day'));
      const conventionDayEvents = eventRuns.filter(
        eventRun => conventionDayTimespan.overlapsTimespan(eventRun.timespan),
      );
      const renderer = () => this.renderGridWithEventRuns(
        conventionDayEvents,
        conventionDayTimespan,
      );

      return (
        <Route
          path={`/${conventionDay.format('dddd').toLowerCase()}`}
          render={renderer}
          key={conventionDay.toISOString()}
        />
      );
    });

    return (
      <div>
        <ul className="nav nav-tabs">
          {conventionDayTabs}
        </ul>
        <Switch>
          {conventionDayGrids}
          <Redirect to={`${this.conventionDays[0].format('dddd').toLowerCase()}`} />
        </Switch>
      </div>
    );
  }
}

export default ScheduleGrid;
