import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment-timezone';
import queryString from 'query-string';
import ConventionDaySelect from '../BuiltInFormControls/ConventionDaySelect';
import GraphQLResultPropType from '../GraphQLResultPropType';
import GraphQLQueryResultWrapper from '../GraphQLQueryResultWrapper';
import TimeSelect from '../BuiltInFormControls/TimeSelect';
import Timespan from '../PCSG/Timespan';

const conventionQuery = gql`
query {
  convention {
    starts_at
    ends_at
    timezone_name
  }
}
`;

const momentToTimeObject = (momentValue) => {
  if (momentValue == null) {
    return {
      hour: null,
      minute: null,
    };
  }

  return {
    hour: momentValue.hour(),
    minute: momentValue.minute(),
  };
};

@graphql(conventionQuery)
@GraphQLQueryResultWrapper
class WhosFreeForm extends React.Component {
  static propTypes = {
    data: GraphQLResultPropType(conventionQuery, 'convention').isRequired,
    initialStart: PropTypes.string,
    initialFinish: PropTypes.string,
    baseUrl: PropTypes.string.isRequired,
  };

  static defaultProps = {
    initialStart: null,
    initialFinish: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      day: props.initialStart ? moment.tz(props.initialStart, props.data.convention.timezone_name).startOf('day') : null,
      start: props.initialStart ? moment(props.initialStart) : null,
      finish: props.initialFinish ? moment(props.initialFinish) : null,
    };
  }

  dayChanged = (day) => { this.setState({ day }); }
  timeChanged = (field, newTime) => {
    const oldTime = this.state[field] || this.state.day;

    this.setState({ [field]: oldTime.clone().set(newTime) });
  }

  search = (event) => {
    event.preventDefault();

    const params = {
      start: this.state.start.toISOString(),
      finish: this.state.finish.toISOString(),
    };
    window.location.href = `${this.props.baseUrl}?${queryString.stringify(params)}`;
  }

  renderTimeSelects = () => {
    if (this.state.day == null) {
      return null;
    }

    const startTimespan = new Timespan(this.state.day, this.state.day.clone().add(1, 'day'));
    const finishTimespan = new Timespan(this.state.start || this.state.day, startTimespan.finish);

    return (
      <div className="d-flex mb-4">
        <div className="mr-4">
          from
          <TimeSelect
            timespan={startTimespan}
            value={momentToTimeObject(this.state.start)}
            onChange={newTime => this.timeChanged('start', newTime)}
          />
        </div>
        <div>
          until
          <TimeSelect
            timespan={finishTimespan}
            value={momentToTimeObject(this.state.finish)}
            onChange={newTime => this.timeChanged('finish', newTime)}
          />
        </div>
      </div>
    );
  }

  render = () => (
    <div className="card bg-light mb-4">
      <div className="card-body">
        <h5>Timespan to search within</h5>

        <ConventionDaySelect
          convention={this.props.data.convention}
          value={this.state.day}
          onChange={this.dayChanged}
        />

        {this.renderTimeSelects()}

        <p className="mb-0">
          <button
            className="btn btn-primary"
            disabled={!(this.state.start && this.state.finish)}
            onClick={this.search}
          >
            Search
          </button>
        </p>
      </div>
    </div>
  )
}

export default WhosFreeForm;
