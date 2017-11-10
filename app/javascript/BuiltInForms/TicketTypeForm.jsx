import React from 'react';
import PropTypes from 'prop-types';
import NumberInput from 'react-number-input';
import BooleanInput from '../BuiltInFormControls/BooleanInput';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import { FIELD_TYPES, ModelStateChangeCalculator } from '../FormUtils';
import ResourceForm from './ResourceForm';
import ScheduledValueEditor from '../BuiltInFormControls/ScheduledValueEditor';
import { ScheduledValuePropType } from '../ScheduledValuePropTypes';

const buildScheduledMoneyValueInput = (value, onChange) => {
  const processNumberInputChangeEvent = (event, newValue) => {
    const moneyValue = {
      ...(value || {}),
      fractional: newValue * 100.0,
    };

    onChange(moneyValue);
  };

  let dollarValue = null;

  if (value && value.fractional !== null) {
    dollarValue = (value.fractional / 100.0).toFixed(2);
  }

  return (
    <div className="input-group">
      <span className="input-group-addon">$</span>
      <NumberInput
        className="form-control"
        value={dollarValue}
        onChange={processNumberInputChangeEvent}
        format="0,0.00"
      />
    </div>
  );
};

class TicketTypeForm extends React.Component {
  static propTypes = {
    initialTicketType: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      pricing_schedule: ScheduledValuePropType.isRequired,
      publicly_available: PropTypes.bool.isRequired,
      maximum_event_provided_tickets: PropTypes.number.isRequired,
    }).isRequired,
    baseUrl: PropTypes.string.isRequired,
    timezone: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      ticketType: this.props.initialTicketType,
    };

    this.ticketTypeMutator = new ModelStateChangeCalculator(
      'ticketType',
      {
        name: FIELD_TYPES.STRING,
        description: FIELD_TYPES.STRING,
        pricing_schedule: FIELD_TYPES.OBJECT,
        publicly_available: FIELD_TYPES.BOOLEAN,
        maximum_event_provided_tickets: FIELD_TYPES.INTEGER,
      },
    ).getMutatorForComponent(this);
  }

  getSubmitRequestBody = () => ({
    ticket_type: this.state.ticketType,
  })

  render = () => {
    const disableSubmit = !ScheduledValueEditor.isValid(this.state.ticketType.pricing_schedule);

    return (
      <ResourceForm
        baseUrl={this.props.baseUrl}
        resourceId={this.state.ticketType.id}
        getSubmitRequestBody={this.getSubmitRequestBody}
        submitText="Save ticket type configuration"
        submitDisabled={disableSubmit}
      >
        <BootstrapFormInput
          label="Name (no spaces allowed &mdash; only letters, numbers, and underscores)"
          name="name"
          type="text"
          style={{ fontFamily: 'monospace' }}
          value={this.state.ticketType.name}
          onChange={this.ticketTypeMutator.onInputChange}
        />

        <BootstrapFormInput
          label="Description"
          name="description"
          type="text"
          value={this.state.ticketType.description}
          onChange={this.ticketTypeMutator.onInputChange}
        />

        <BooleanInput
          caption="Publicly available for purchase?"
          name="publicly_available"
          value={this.state.ticketType.publicly_available}
          onChange={this.ticketTypeMutator.valueChangeCallback('publicly_available')}
        />

        <BootstrapFormInput
          label="Number of event-provided tickets of this type (per event)"
          name="maximum_event_provided_tickets"
          type="number"
          value={this.state.ticketType.maximum_event_provided_tickets.toString()}
          onChange={this.ticketTypeMutator.onInputChange}
        />

        <fieldset>
          <p>Pricing schedule</p>

          <ScheduledValueEditor
            timezone={this.props.timezone}
            scheduledValue={this.state.ticketType.pricing_schedule}
            setScheduledValue={this.ticketTypeMutator.valueChangeCallback('pricing_schedule')}
            buildValueInput={buildScheduledMoneyValueInput}
          />
        </fieldset>
      </ResourceForm>
    );
  }
}

export default TicketTypeForm;
