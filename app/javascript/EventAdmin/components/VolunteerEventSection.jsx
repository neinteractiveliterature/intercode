import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { propType } from 'graphql-anywhere';
import ScheduleMultipleRunsModal from './ScheduleMultipleRunsModal';
import { fragments } from '../eventsQuery';
import { timespanFromConvention } from '../../TimespanUtils';

class VolunteerEventSection extends React.Component {
  static propTypes = {
    event: propType(fragments.eventFragment).isRequired,
    convention: propType(fragments.conventionFragment).isRequired,
    editRun: PropTypes.func.isRequired,
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
    this.setState({ expanded: !this.state.expanded });
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
          <button className="btn btn-secondary" onClick={() => this.props.editRun(this.props.event, run)}>
            {runStart.format(format)}
          </button>
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
    <button onClick={this.toggleExpanded} className="hidden-button" aria-expanded={this.state.expanded}>
      <h4>
        {this.renderDisclosureTriangle()}
        {' '}
        {this.props.event.title}
        {' '}
        <small>
          ({this.props.event.runs.length} runs;
          {' '}
          {moment.duration(this.props.event.length_seconds, 'seconds').humanize()} per run)
        </small>
      </h4>
    </button>
  )

  renderBody = () => {
    if (!this.state.expanded) {
      return null;
    }

    const { event } = this.props;

    const runLists = this.getConventionDays().map(
      conventionDay => this.renderRunList(conventionDay),
    );

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
          <button className="btn btn-primary" onClick={this.startSchedulingRuns}>
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
