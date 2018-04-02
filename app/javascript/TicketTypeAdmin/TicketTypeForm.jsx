import React from 'react';
import PropTypes from 'prop-types';
import { pluralize } from 'inflected';
import BooleanInput from '../BuiltInFormControls/BooleanInput';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import { FIELD_TYPES, ModelStateChangeCalculator } from '../FormUtils';
import InPlaceEditor from '../BuiltInFormControls/InPlaceEditor';
import ScheduledValueEditor from '../BuiltInFormControls/ScheduledValueEditor';
import TicketTypePropType from './TicketTypePropType';
import formatMoney from '../formatMoney';

const buildScheduledMoneyValueInput = (value, onChange) => {
  const processNumberInputChangeEvent = (newValue) => {
    const floatValue = parseFloat(newValue);

    const moneyValue = {
      ...(value || {}),
      fractional: Number.isNaN(floatValue) ? null : floatValue * 100.0,
    };

    onChange(moneyValue);
  };

  let dollarValue = null;

  if (value && value.fractional !== null) {
    dollarValue = formatMoney(value);
  }

  return (
    <div className="input-group">
      <InPlaceEditor
        value={dollarValue}
        onChange={processNumberInputChangeEvent}
      >
        {dollarValue}
      </InPlaceEditor>
    </div>
  );
};

class TicketTypeForm extends React.Component {
  static propTypes = {
    ticketType: TicketTypePropType.isRequired,
    ticketName: PropTypes.string.isRequired,
    timezone: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.ticketTypeMutator = new ModelStateChangeCalculator(
      'ticketType',
      {
        name: FIELD_TYPES.STRING,
        description: FIELD_TYPES.STRING,
        pricing_schedule: FIELD_TYPES.OBJECT,
        publicly_available: FIELD_TYPES.BOOLEAN,
        counts_towards_convention_maximum: FIELD_TYPES.BOOLEAN,
        allows_event_signups: FIELD_TYPES.BOOLEAN,
        maximum_event_provided_tickets: FIELD_TYPES.INTEGER,
      },
    ).getMutatorForStatelessComponent(this, props.onChange);
  }

  render = () => {
    const disableSubmit = !ScheduledValueEditor.isValid(this.props.ticketType.pricing_schedule);

    return (
      <div>
        <BootstrapFormInput
          label="Name (no spaces allowed &mdash; only letters, numbers, and underscores)"
          name="name"
          type="text"
          style={{ fontFamily: 'monospace' }}
          value={this.props.ticketType.name}
          onChange={this.ticketTypeMutator.onInputChange}
        />

        <BootstrapFormInput
          label="Description"
          name="description"
          type="text"
          value={this.props.ticketType.description}
          onChange={this.ticketTypeMutator.onInputChange}
        />

        <BooleanInput
          caption="Publicly available for purchase?"
          name="publicly_available"
          value={this.props.ticketType.publicly_available}
          onChange={this.ticketTypeMutator.valueChangeCallback('publicly_available')}
        />

        <BooleanInput
          caption="Allows event signups?"
          name="allows_event_signups"
          value={this.props.ticketType.allows_event_signups}
          onChange={this.ticketTypeMutator.valueChangeCallback('allows_event_signups')}
        />

        <BooleanInput
          caption="Counts towards convention maximum?"
          name="counts_towards_convention_maximum"
          value={this.props.ticketType.counts_towards_convention_maximum}
          onChange={this.ticketTypeMutator.valueChangeCallback('publicly_available')}
        />

        <BootstrapFormInput
          label={`Number of event-provided ${pluralize(this.props.ticketName)} of this type (per event)`}
          name="maximum_event_provided_tickets"
          type="number"
          value={this.props.ticketType.maximum_event_provided_tickets.toString()}
          onChange={this.ticketTypeMutator.onInputChange}
        />

        <fieldset>
          <p>Pricing schedule</p>

          <ScheduledValueEditor
            timezone={this.props.timezone}
            scheduledValue={this.props.ticketType.pricing_schedule}
            setScheduledValue={this.ticketTypeMutator.valueChangeCallback('pricing_schedule')}
            buildValueInput={buildScheduledMoneyValueInput}
          />
        </fieldset>
      </div>
    );
  }
}

export default TicketTypeForm;
