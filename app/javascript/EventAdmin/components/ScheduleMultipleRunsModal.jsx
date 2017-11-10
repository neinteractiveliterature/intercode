import React from 'react';
import PropTypes from 'prop-types';
import { propType } from 'graphql-anywhere';
import { graphql } from 'react-apollo';
import Modal from 'react-bootstrap4-modal';
import ConventionDaySelect from '../../BuiltInFormControls/ConventionDaySelect';
import TimeSelect from '../../BuiltInFormControls/TimeSelect';
import Timespan from '../../PCSG/Timespan';
import { timespanFromConvention, timespanFromRun } from '../../TimespanUtils';
import eventsQuery, { fragments } from '../eventsQuery';
import { createMultipleRunsMutation } from '../mutations';

@graphql(createMultipleRunsMutation, { name: 'createMultipleRuns' })
class ScheduleMultipleRunsModal extends React.Component {
  static propTypes = {
    convention: propType(fragments.conventionFragment).isRequired,
    event: propType(fragments.eventFragment).isRequired,
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onFinish: PropTypes.func.isRequired,
    createMultipleRuns: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      day: null,
      startHour: null,
      startMinute: null,
      finishHour: null,
      finishMinute: null,
    };
  }

  getTimespan = () => {
    if (!this.isDataComplete()) {
      return null;
    }

    const {
      startHour, startMinute, finishHour, finishMinute,
    } = this.state;

    return new Timespan(
      this.state.day.clone().set({ hour: startHour, minute: startMinute }),
      this.state.day.clone().set({ hour: finishHour, minute: finishMinute }),
    );
  }

  getTimespansWithinRange = () => {
    const timespan = this.getTimespan();
    if (!timespan) {
      return [];
    }

    return timespan.getTimespansWithin(
      this.props.convention.timezone_name,
      'hour',
    );
  }

  getExistingRunTimespans = () => (
    this.props.event.runs.map(run => (
      timespanFromRun(this.props.convention, this.props.event, run)
    ))
  )

  getNonConflictingTimespansWithinRange = () => {
    const runTimespans = this.getTimespansWithinRange();
    if (runTimespans.length < 1) {
      return [];
    }

    const existingRunTimespans = this.getExistingRunTimespans();

    return runTimespans.filter(runTimespan => (
      !existingRunTimespans.some(existingTimespan => existingTimespan.overlapsTimespan(runTimespan))
    ));
  }

  isDataComplete = () => (
    this.state.day &&
    this.state.startHour != null && this.state.startMinute != null &&
    this.state.finishHour != null && this.state.finishMinute != null
  )

  dayInputChanged = (newDay) => {
    this.setState({ day: newDay });
  }

  startTimeInputChanged = ({ hour, minute }) => {
    this.setState({ startHour: hour, startMinute: minute });
  }

  finishTimeInputChanged = ({ hour, minute }) => {
    this.setState({ finishHour: hour, finishMinute: minute });
  }

  scheduleRuns = () => {
    const runs = this.getNonConflictingTimespansWithinRange().map(timespan => ({
      event_id: this.props.event.id,
      starts_at: timespan.start.toISOString(),
    }));

    return this.props.createMultipleRuns({
      variables: {
        input: {
          runs,
        },
      },
      update: (store, { data: { createMultipleRuns: { runs: newRuns } } }) => {
        const eventsData = store.readQuery({ query: eventsQuery });
        const eventData = eventsData.events.find(event => event.id === this.props.event.id);
        eventData.runs = [...eventData.runs, ...newRuns];
        store.writeQuery({ query: eventsQuery, data: eventsData });
        this.props.onFinish();
      },
    });
  }

  renderTimeSelects = () => {
    const { convention } = this.props;
    const {
      day, startHour, startMinute, finishHour, finishMinute,
    } = this.state;

    if (!day) {
      return null;
    }

    const timespan = new Timespan(
      this.state.day.clone(),
      this.state.day.clone().add(1, 'day'),
    ).intersection(timespanFromConvention(convention));

    const timespanForFinish = new Timespan(
      timespan.start,
      timespan.finish.clone().add(1, 'hour'),
    );

    return (
      <div>
        <fieldset className="form-group">
          <legend className="col-form-legend">From</legend>
          <TimeSelect
            value={{ hour: startHour, minute: startMinute }}
            onChange={this.startTimeInputChanged}
            timespan={timespan}
          />
        </fieldset>

        <fieldset className="form-group">
          <legend className="col-form-legend">Until</legend>
          <TimeSelect
            value={{ hour: finishHour, minute: finishMinute }}
            onChange={this.finishTimeInputChanged}
            timespan={timespanForFinish}
          />
        </fieldset>
      </div>
    );
  }

  renderRunPreview = () => {
    const runTimespans = this.getTimespansWithinRange();
    if (runTimespans.length < 1) {
      return null;
    }

    const nonConflictingTimespans = this.getNonConflictingTimespansWithinRange();

    const runTimespanItems = runTimespans.map((runTimespan) => {
      let description = runTimespan.start.format('h:mma');
      const runConflicts = (
        nonConflictingTimespans.find(nonConflictingTimespan => nonConflictingTimespan.isSame(runTimespan)) == null
      );

      if (runConflicts) {
        description = <del title={`There is already a run scheduled at ${description}`}>{description}</del>;
      }

      return (
        <li key={runTimespan.start.toISOString()} className="list-inline-item">
          {description}
        </li>
      );
    });

    return (
      <ul className="list-inline">
        <li><strong>Will schedule runs at:</strong></li>
        {runTimespanItems}
      </ul>
    );
  }

  renderFormBody = () => (
    <div className="modal-body">
      <ConventionDaySelect
        convention={this.props.convention}
        value={this.state.day}
        onChange={this.dayInputChanged}
      />

      {this.renderTimeSelects()}
      {this.renderRunPreview()}
    </div>
  );

  render = () => (
    <div>
      <Modal visible={this.props.visible}>
        <div className="modal-header">
          <h5 className="modal-title">Schedule runs of {this.props.event.title}</h5>
        </div>
        {this.renderFormBody()}
        <div className="modal-footer">
          <div className="d-flex w-100">
            <div className="col text-right pr-0">
              <button type="button" className="btn btn-secondary mr-2" onClick={this.props.onCancel}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.scheduleRuns}
                disabled={this.getNonConflictingTimespansWithinRange().length < 1}
              >
                Schedule runs
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ScheduleMultipleRunsModal;
