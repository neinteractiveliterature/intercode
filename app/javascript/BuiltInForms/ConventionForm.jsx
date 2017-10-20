import React from 'react';
import PropTypes from 'prop-types';
import BootstrapFormCheckbox from '../BuiltInFormControls/BootstrapFormCheckbox';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import TimezoneSelect from '../BuiltInFormControls/TimezoneSelect';

class ConventionForm extends React.Component {
  static propTypes = {
    initialConvention: PropTypes.shape({
      name: PropTypes.string.isRequired,
      domain: PropTypes.string.isRequired,
      timezone_name: PropTypes.string.isRequired,
    }).isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      convention: props.initialConvention,
    };
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

  timezoneNameDidChange = (timezoneName) => {
    this.setState({
      convention: {
        ...this.state.convention,
        timezone_name: timezoneName,
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

  render = () => (
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
        )
      }

      {this.renderBooleanInput('registrations_frozen', 'Freeze event registrations')}

      <button className="btn btn-primary">Save settings</button>
    </form>
  )
}

export default ConventionForm;
