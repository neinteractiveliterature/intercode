import React from 'react';
import moment from 'moment-timezone';
import { propType } from 'graphql-anywhere';
import { Link } from 'react-router-dom';
import ScheduleMultipleRunsModal from './ScheduleMultipleRunsModal';
import { EventFields, ConventionFields } from './queries.gql';
import { timespanFromConvention } from '../TimespanUtils';

class VolunteerEventSection extends React.Component {
  static propTypes = {
    event: propType(EventFields).isRequired,
    convention: propType(ConventionFields).isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
      schedulingRuns: false,
    };
  }

  getConventionDays = () => timespanFromConvention(this.props.convention)
    .getTimespansWithin(
      this.props.convention.timezone_name,
      'day',
      moment.duration(6, 'hours'),
    )

  toggleExpanded = () => {
    this.setState(prevState => ({ expanded: !prevState.expanded }));
  }

  startSchedulingRuns = () => {
    this.setState({ schedulingRuns: true });
  }

  cancelSchedulingRuns = () => {
    this.setState({ schedulingRuns: false });
  }

  finishSchedulingRuns = () => {
    this.setState({ schedulingRuns: false });
  }

  renderRunList = (conventionDay) => {
    const dayRuns = this.props.event.runs.filter(run => (
      conventionDay.includesTime(moment(run.starts_at))
    ));

    dayRuns.sort((a, b) => moment(a.starts_at).diff(moment(b.starts_at)));

    const runItems = dayRuns.map((run) => {
      const runStart = moment(run.starts_at).tz(this.props.convention.timezone_name);
      let format = 'h:mma';
      if (runStart.day() !== conventionDay.start.day()) {
        format = 'ddd h:mma';
      }

      return (
        <li key={run.id} className="my-2">
          <Link className="btn btn-secondary" to={`/volunteer_events/${this.props.event.id}/runs/${run.id}/edit`}>
            {runStart.format(format)}
          </Link>
        </li>
      );
    });

    return (
      <div className="col" key={conventionDay.start.toISOString()}>
        <div className="card">
          <div className="card-header">{conventionDay.start.format('dddd, MMMM DD')}</div>
          <div className="card-body py-3">
            <ul className="list-unstyled m-0">
              {runItems}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  renderDisclosureTriangle = () => {
    if (this.state.expanded) {
      return '▼';
    }

    return '▶';
  }

  renderHeader = () => (
    <div className="d-flex">
      <div className="flex-grow-1">
        <button
          type="button"
          onClick={this.toggleExpanded}
          className="hidden-button"
          aria-expanded={this.state.expanded}
        >
          <h4>
            {this.renderDisclosureTriangle()}
            {' '}
            {this.props.event.title}
            {' '}
            <small>
              (
              {this.props.event.runs.length}
              {' '}
    runs;
              {' '}
              {moment.duration(this.props.event.length_seconds, 'seconds').humanize()}
              {' '}
    per run)
            </small>
          </h4>
        </button>
      </div>

      <div>
        <Link className="btn btn-outline-primary" to={`/${this.props.event.id}/edit`}>
          Edit
        </Link>
      </div>
    </div>
  )

  renderBody = () => {
    if (!this.state.expanded) {
      return null;
    }

    const { event } = this.props;

    const runLists = this.getConventionDays().map(conventionDay => this.renderRunList(conventionDay));

    return (
      <div>
        <div className="card bg-light my-4">
          <div
            className="card-body small"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: event.description_html }}
          />
        </div>

        <div className="mb-4">
          <button type="button" className="btn btn-primary" onClick={this.startSchedulingRuns}>
            Schedule additional runs
          </button>
        </div>

        <div className="d-flex mb-4">
          {runLists}
        </div>
      </div>
    );
  }

  render = () => (
    <section className="my-4">
      {this.renderHeader()}
      {this.renderBody()}
      <ScheduleMultipleRunsModal
        visible={this.state.schedulingRuns}
        convention={this.props.convention}
        event={this.props.event}
        onCancel={this.cancelSchedulingRuns}
        onFinish={this.finishSchedulingRuns}
      />

      <hr />
    </section>
  )
}

export default VolunteerEventSection;
