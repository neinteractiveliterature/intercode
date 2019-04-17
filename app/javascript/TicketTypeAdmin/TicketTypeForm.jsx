import React from 'react';
import PropTypes from 'prop-types';
import { pluralize } from 'inflected';

import BooleanInput from '../BuiltInFormControls/BooleanInput';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import { mutator, Transforms } from '../ComposableFormUtils';
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

  return (
    <div className="input-group">
      <InPlaceEditor
        value={formatMoney(value, false)}
        onChange={processNumberInputChangeEvent}
      >
        {formatMoney(value)}
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

    this.ticketTypeMutator = mutator({
      getState: () => this.props.ticketType,
      setState: this.props.onChange,
      transforms: {
        name: Transforms.identity,
        description: Transforms.identity,
        pricing_schedule: Transforms.identity,
        publicly_available: Transforms.identity,
        counts_towards_convention_maximum: Transforms.identity,
        allows_event_signups: Transforms.identity,
        maximum_event_provided_tickets: Transforms.integer,
      },
    });
  }

  render = () => (
    <div>
      <BootstrapFormInput
        label="Name (no spaces allowed &mdash; only letters, numbers, and underscores)"
        name="name"
        type="text"
        style={{ fontFamily: 'monospace' }}
        value={this.props.ticketType.name}
        onTextChange={this.ticketTypeMutator.name}
      />

      <BootstrapFormInput
        label="Description"
        name="description"
        type="text"
        value={this.props.ticketType.description}
        onTextChange={this.ticketTypeMutator.description}
      />

      <BooleanInput
        caption="Publicly available for purchase?"
        name="publicly_available"
        value={this.props.ticketType.publicly_available}
        onChange={this.ticketTypeMutator.publicly_available}
      />

      <BooleanInput
        caption="Allows event signups?"
        name="allows_event_signups"
        value={this.props.ticketType.allows_event_signups}
        onChange={this.ticketTypeMutator.allows_event_signups}
      />

      <BooleanInput
        caption="Counts towards convention maximum?"
        name="counts_towards_convention_maximum"
        value={this.props.ticketType.counts_towards_convention_maximum}
        onChange={this.ticketTypeMutator.counts_towards_convention_maximum}
      />

      <BootstrapFormInput
        label={`Number of event-provided ${pluralize(this.props.ticketName)} of this type (per event)`}
        name="maximum_event_provided_tickets"
        type="number"
        value={this.props.ticketType.maximum_event_provided_tickets.toString()}
        onTextChange={this.ticketTypeMutator.maximum_event_provided_tickets}
      />

      <fieldset>
        <p>Pricing schedule</p>

        <ScheduledValueEditor
          timezone={this.props.timezone}
          scheduledValue={this.props.ticketType.pricing_schedule}
          setScheduledValue={this.ticketTypeMutator.pricing_schedule}
          buildValueInput={buildScheduledMoneyValueInput}
        />
      </fieldset>
    </div>
  )
}

export default TicketTypeForm;
