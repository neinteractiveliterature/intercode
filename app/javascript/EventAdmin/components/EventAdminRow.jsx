import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import Timespan from '../../PCSG/Timespan';

class EventAdminRow extends React.Component {
  static propTypes = {
    event: PropTypes.shape({
      id: PropTypes.number.isRequired,
      category: PropTypes.string.isRequired,
      length_seconds: PropTypes.number.isRequired,
      runs: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          starts_at: PropTypes.string.isRequired,
          title_suffix: PropTypes.string,
          schedule_note: PropTypes.string,
          rooms: PropTypes.arrayOf(
            PropTypes.shape({
              name: PropTypes.string.isRequired,
            }).isRequired,
          ).isRequired,
        }).isRequired,
      ).isRequired,
    }).isRequired,

    convention: PropTypes.shape({
      timezone_name: PropTypes.string.isRequired,
    }).isRequired,

    newRun: PropTypes.func.isRequired,
    editRun: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
    };
  }

  expand = () => {
    this.setState({ expanded: true });
  }

  renderRun = (event, run) => {
    const start = moment(run.starts_at);
    const timespan = new Timespan(start, start.clone().add(event.length_seconds, 'seconds'));

    const [titleSuffix, scheduleNote] = [['title_suffix', 'font-weight-bold'], ['schedule_note', 'font-italic']].map(([field, className]) => {
      if (run[field]) {
        return <li key={field} className={className}>{run[field]}</li>;
      }

      return null;
    });

    const runMetadata = [
      titleSuffix,
      <li key="timespan">{timespan.humanizeInTimezone(this.props.convention.timezone_name)}</li>,
      <li key="rooms">{run.rooms.map(room => room.name).sort().join(', ')}</li>,
      scheduleNote,
    ];

    return (
      <button className="btn btn-secondary m-1 p-2 text-left" key={run.id} onClick={() => this.props.editRun(event, run)}>
        <ul className="list-unstyled m-0">
          {runMetadata}
        </ul>
      </button>
    );
  }

  renderRuns = (event) => {
    if (this.state.expanded || event.runs.length <= 2) {
      const sortedRuns = [...event.runs].sort(
        (a, b) => moment(a.starts_at).diff(moment(b.starts_at)),
      );

      return (
        <div className="d-flex flex-wrap align-items-start" style={{ maxWidth: '50vw' }}>
          {sortedRuns.map(run => this.renderRun(event, run))}
          <button className="btn btn-primary btn-sm m-1" onClick={() => { this.props.newRun(event); }}>
            <i className="fa fa-plus" />
          </button>
        </div>
      );
    }

    return (
      <button className="btn btn-outline-secondary" onClick={this.expand}>
        Show {event.runs.length} runs
      </button>
    );
  }

  render = () => {
    const { event } = this.props;

    return (
      <tr>
        <td>
          <Link
            to={`/${event.id}/edit`}
            className={`rounded p-1 event-category-${event.category} text-dark`}
          >
            {event.title}
          </Link>
          {' '}
          <small>({event.category})</small>
        </td>
        <td>{moment.duration(event.length_seconds, 'seconds').humanize()}</td>
        <td>{this.renderRuns(event)}</td>
      </tr>
    );
  }
}

export default EventAdminRow;
