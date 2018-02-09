import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import Datetime from 'react-datetime';
import { pluralize } from 'inflected';
import BooleanInput from '../BuiltInFormControls/BooleanInput';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import { FIELD_TYPES, ModelStateChangeCalculator } from '../FormUtils';
import MultipleChoiceInput from '../BuiltInFormControls/MultipleChoiceInput';
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
      starts_at: PropTypes.string.isRequired,
      ends_at: PropTypes.string.isRequired,
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
      maximum_tickets: PropTypes.number,
      ticket_name: PropTypes.string.isRequired,
    }).isRequired,
    saveConvention: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      convention: props.initialConvention,
    };

    this.conventionMutator = new ModelStateChangeCalculator(
      'convention',
      {
        name: FIELD_TYPES.STRING,
        domain: FIELD_TYPES.STRING,
        timezone_name: FIELD_TYPES.SELECT,
        starts_at: FIELD_TYPES.DATETIME,
        ends_at: FIELD_TYPES.DATETIME,
        accepting_proposals: FIELD_TYPES.BOOLEAN,
        registrations_frozen: FIELD_TYPES.BOOLEAN,
        show_schedule: FIELD_TYPES.CHECKBOX,
        maximum_event_signups: FIELD_TYPES.OBJECT,
        maximum_tickets: FIELD_TYPES.INTEGER,
        ticket_name: FIELD_TYPES.STRING,
      },
      () => this.state.convention.timezone_name,
    ).getMutatorForComponent(this);
  }

  onClickSave = (event) => {
    event.preventDefault();
    this.props.saveConvention(this.state.convention);
  }

  renderBooleanInput = (name, caption) => (
    <BooleanInput
      name={name}
      caption={caption}
      value={this.state.convention[name]}
      onChange={this.conventionMutator.valueChangeCallback(name)}
    />
  )

  render = () => {
    const startEndFields = [['starts_at', 'Convention starts'], ['ends_at', 'Convention ends']].map(([name, label]) => (
      <div className="col-md-6" key={name}>
        {label}
        <Datetime
          value={moment.tz(this.state.convention[name], this.state.convention.timezone_name)}
          onChange={this.conventionMutator.valueChangeCallback(name)}
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
          onChange={this.conventionMutator.onInputChange}
        />

        <BootstrapFormInput
          name="domain"
          label="Convention domain name"
          value={this.state.convention.domain}
          onChange={this.conventionMutator.onInputChange}
        />

        <TimezoneSelect
          name="timezone_name"
          label="Time zone"
          value={this.state.convention.timezone_name}
          onChange={this.conventionMutator.valueChangeCallback('timezone_name')}
        />

        <div className="row form-group">
          {startEndFields}
        </div>

        {this.renderBooleanInput('accepting_proposals', 'Accepting event proposals')}

        <MultipleChoiceInput
          name="show_schedule"
          caption="Show event schedule"
          choices={[
            { value: 'no', label: 'No' },
            { value: 'priv', label: 'Only to users with scheduling privileges' },
            { value: 'gms', label: 'Only to event team members and users with any privileges' },
            { value: 'yes', label: 'Yes, to everyone' },
          ]}
          value={this.state.convention.show_schedule}
          onChange={this.conventionMutator.valueChangeCallback('show_schedule')}
        />

        <BootstrapFormInput
          name="ticket_name"
          label={'Name for "tickets" at this convention'}
          type="text"
          value={this.state.convention.ticket_name}
          onChange={this.conventionMutator.onInputChange}
        />

        <BootstrapFormInput
          name="maximum_tickets"
          label={`Maximum ${pluralize(this.state.convention.ticket_name)}`}
          type="number"
          value={(this.state.convention.maximum_tickets || '').toString()}
          onChange={this.conventionMutator.onInputChange}
        />

        {this.renderBooleanInput('registrations_frozen', 'Freeze event registrations')}

        <fieldset>
          <legend className="col-form-label">Event signup schedule</legend>
          <ScheduledValueEditor
            scheduledValue={this.state.convention.maximum_event_signups}
            timezone={this.state.convention.timezone_name}
            setScheduledValue={this.conventionMutator.valueChangeCallback('maximum_event_signups')}
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
