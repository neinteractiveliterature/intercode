import React from 'react';
import PropTypes from 'prop-types';
import { pluralize } from 'inflected';
import BooleanInput from '../BuiltInFormControls/BooleanInput';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import DateTimeInput from '../BuiltInFormControls/DateTimeInput';
import { FIELD_TYPES, ModelStateChangeCalculator } from '../FormUtils';
import MultipleChoiceInput from '../BuiltInFormControls/MultipleChoiceInput';
import ScheduledValueEditor from '../BuiltInFormControls/ScheduledValueEditor';
import SelectWithLabel from '../BuiltInFormControls/SelectWithLabel';
import TimezoneSelect from '../BuiltInFormControls/TimezoneSelect';

const MAXIMUM_EVENT_SIGNUPS_OPTIONS = [
  ['not_yet', 'No signups yet'],
  ['1', 'Up to 1 event'],
  ['2', 'Up to 2 events'],
  ['3', 'Up to 3 events'],
  ['unlimited', 'Signups fully open'],
  ['not_now', 'Signups frozen'],
];

const buildMaximumEventSignupsInput = (value, onChange) => {
  const processChangeEvent = (event) => {
    onChange(event.target.value);
  };

  const options = MAXIMUM_EVENT_SIGNUPS_OPTIONS.map(([value, label]) => (
    <option key={value} value={value}>{label}</option>
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
      default_layout_id: PropTypes.number,
      root_page_id: PropTypes.number,
    }).isRequired,
    cmsLayouts: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired).isRequired,
    pages: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired).isRequired,
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
        show_schedule: FIELD_TYPES.CHECKBOX,
        maximum_event_signups: FIELD_TYPES.OBJECT,
        maximum_tickets: FIELD_TYPES.INTEGER,
        ticket_name: FIELD_TYPES.STRING,
        default_layout_id: FIELD_TYPES.SELECT,
        root_page_id: FIELD_TYPES.SELECT,
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
        <DateTimeInput
          value={this.state.convention[name]}
          timezoneName={this.state.convention.timezone_name}
          onChange={this.conventionMutator.valueChangeCallback(name)}
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

        <SelectWithLabel
          name="default_layout_id"
          label="Default layout for pages"
          value={this.state.convention.default_layout_id}
          options={this.props.cmsLayouts.map(layout => ({ value: layout.id, label: layout.name }))}
          onChange={this.conventionMutator.valueChangeCallback('default_layout_id')}
        />

        <SelectWithLabel
          name="root_page_id"
          label="Root page"
          value={this.state.convention.root_page_id}
          options={this.props.pages.map(page => ({ value: page.id, label: page.name }))}
          onChange={this.conventionMutator.valueChangeCallback('root_page_id')}
        />

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
          label={'Name for "ticket" at this convention'}
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
