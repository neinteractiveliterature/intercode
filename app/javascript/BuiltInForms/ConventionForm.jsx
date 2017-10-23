import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import Datetime from 'react-datetime';
import BootstrapFormCheckbox from '../BuiltInFormControls/BootstrapFormCheckbox';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import ScheduledValueEditor from '../BuiltInFormControls/ScheduledValueEditor';
import TimezoneSelect from '../BuiltInFormControls/TimezoneSelect';

const buildMaximumEventSignupsInput = (value, onChange) => {
  const processChangeEvent = (event) => {
    onChange(event.target.value);
  };

  const options = ['not_yet', '1', '2', '3', 'unlimited', 'not_now'].map(choice => (
    <option key={choice} value={choice}>{choice}</option>
  ));

  return (
    <select className="form-control" value={value} onChange={processChangeEvent}>
      <option />
      {options}
    </select>
  );
};

class ConventionForm extends React.Component {
  static propTypes = {
    initialConvention: PropTypes.shape({
      name: PropTypes.string.isRequired,
      domain: PropTypes.string.isRequired,
      timezone_name: PropTypes.string.isRequired,
      accepting_proposals: PropTypes.bool.isRequired,
      registrations_frozen: PropTypes.bool.isRequired,
      show_schedule: PropTypes.oneOf(['no', 'priv', 'gms', 'yes']).isRequired,
      maximum_event_signups: PropTypes.shape({
        timespans: PropTypes.arrayOf(PropTypes.shape({
          start: PropTypes.string,
          finish: PropTypes.string,
          value: PropTypes.string.isRequired,
        }).isRequired).isRequired,
      }).isRequired,
    }).isRequired,
    saveConvention: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      convention: props.initialConvention,
    };
  }

  onClickSave = (event) => {
    event.preventDefault();
    this.props.saveConvention(this.state.convention);
  }

  formInputDidChange = (event) => {
    this.setState({
      convention: {
        ...this.state.convention,
        [event.target.name]: event.target.value,
      },
    });
  }

  booleanInputDidChange = (event) => {
    this.setState({
      convention: {
        ...this.state.convention,
        [event.target.name]: event.target.value === 'true',
      },
    });
  }

  datetimeValueDidChange = (fieldName, newValue) => {
    const newValueInTimezone = moment.tz(newValue.toObject(), this.state.convention.timezone_name);

    this.setState({
      convention: {
        ...this.state.convention,
        [fieldName]: newValueInTimezone.toISOString(),
      },
    });
  }

  maximumEventSignupsDidChange = (newMaximumEventSignups) => {
    this.setState({
      convention: {
        ...this.state.convention,
        maximum_event_signups: newMaximumEventSignups,
      },
    });
  }

  timezoneNameDidChange = (option) => {
    this.setState({
      convention: {
        ...this.state.convention,
        timezone_name: option.value,
      },
    });
  }

  renderMultipleChoiceInput = (name, caption, choices, className, onChange) => {
    const options = choices.map(({ label, value }) => (
      <BootstrapFormCheckbox
        key={`${name}_${value}`}
        name={name}
        type="radio"
        className={className}
        label={label}
        value={value.toString()}
        checked={this.state.convention[name] === value}
        onChange={onChange}
      />
    ));

    return (
      <fieldset className="form-group">
        <legend className="col-form-legend">{caption}</legend>
        {options}
      </fieldset>
    );
  }

  renderBooleanInput = (name, caption) => (
    this.renderMultipleChoiceInput(
      name,
      caption,
      [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
      'form-check-inline',
      this.booleanInputDidChange,
    )
  )

  render = () => {
    const startEndFields = [['starts_at', 'Convention starts'], ['ends_at', 'Convention ends']].map(([name, label]) => (
      <div className="col-md-6" key={name}>
        {label}
        <Datetime
          value={moment(this.state.convention[name]).tz(this.state.convention.timezone_name)}
          onChange={(newValue) => { this.datetimeValueDidChange(name, newValue); }}
          dateFormat="dddd, MMMM DD, YYYY"
          timeFormat="[at] h:mma"
        />
      </div>
    ));

    return (
      <form>
        <BootstrapFormInput
          name="name"
          label="Name"
          value={this.state.convention.name}
          onChange={this.formInputDidChange}
        />

        <BootstrapFormInput
          name="domain"
          label="Convention domain name"
          value={this.state.convention.domain}
          onChange={this.formInputDidChange}
        />

        <TimezoneSelect
          name="timezone_name"
          label="Time zone"
          value={this.state.convention.timezone_name}
          onChange={this.timezoneNameDidChange}
        />

        <div className="row form-group">
          {startEndFields}
        </div>

        {this.renderBooleanInput('accepting_proposals', 'Accepting event proposals')}
        {
          this.renderMultipleChoiceInput(
            'show_schedule',
            'Show event schedule',
            [
              { value: 'no', label: 'No' },
              { value: 'priv', label: 'Only to users with scheduling privileges' },
              { value: 'gms', label: 'Only to event team members and users with any privileges' },
              { value: 'yes', label: 'Yes, to everyone' },
            ],
            undefined,
            this.formInputDidChange,
          )
        }

        {this.renderBooleanInput('registrations_frozen', 'Freeze event registrations')}

        <fieldset>
          <legend className="col-form-legend">Event signup schedule</legend>
          <ScheduledValueEditor
            scheduledValue={this.state.convention.maximum_event_signups}
            timezone={this.state.convention.timezone_name}
            setScheduledValue={this.maximumEventSignupsDidChange}
            buildValueInput={buildMaximumEventSignupsInput}
          />
        </fieldset>

        <button className="btn btn-primary" onClick={this.onClickSave}>
          Save settings
        </button>
      </form>
    );
  }
}

export default ConventionForm;
