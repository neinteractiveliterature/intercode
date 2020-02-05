import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { pluralize } from 'inflected';

import BooleanInput from '../BuiltInFormControls/BooleanInput';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import { Transforms, transformsReducer, useChangeDispatchers } from '../ComposableFormUtils';
import InPlaceEditor from '../BuiltInFormControls/InPlaceEditor';
import ScheduledValueEditor, { scheduledValueReducer } from '../BuiltInFormControls/ScheduledValueEditor';
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

const ticketTypeTransformsReducer = transformsReducer({
  maximum_event_provided_tickets: Transforms.integer,
});

function ticketTypePricingScheduleReducer(state, action) {
  switch (action.type) {
    case 'dispatchPricingSchedule':
      return {
        ...state,
        pricing_schedule: scheduledValueReducer(state.pricing_schedule, action.action),
      };
    default:
      return state;
  }
}

function ticketTypeReducer(state, action) {
  return ticketTypeTransformsReducer(
    ticketTypePricingScheduleReducer(state, action),
    action,
  );
}

function TicketTypeForm({
  ticketType, ticketName, timezone, onChange,
}) {
  const dispatch = useCallback(
    (action) => onChange(ticketTypeReducer(ticketType, action)),
    [ticketType, onChange],
  );
  const [
    changeName,
    changeDescription,
    changePubliclyAvailable,
    changeCountsTowardsConventionMaximum,
    changeAllowsEventSignups,
    changeMaximumEventProvidedTickets,
  ] = useChangeDispatchers(
    dispatch,
    ['name', 'description', 'publicly_available', 'counts_towards_convention_maximum', 'allows_event_signups', 'maximum_event_provided_tickets'],
  );

  const dispatchPricingSchedule = useCallback(
    (action) => dispatch({ type: 'dispatchPricingSchedule', action }),
    [dispatch],
  );

  return (
    <div>
      <BootstrapFormInput
        label="Name (no spaces allowed &mdash; only letters, numbers, and underscores)"
        name="name"
        type="text"
        style={{ fontFamily: 'monospace' }}
        value={ticketType.name}
        onTextChange={changeName}
      />

      <BootstrapFormInput
        label="Description"
        name="description"
        type="text"
        value={ticketType.description}
        onTextChange={changeDescription}
      />

      <BooleanInput
        caption="Publicly available for purchase?"
        name="publicly_available"
        value={ticketType.publicly_available}
        onChange={changePubliclyAvailable}
      />

      <BooleanInput
        caption="Allows event signups?"
        name="allows_event_signups"
        value={ticketType.allows_event_signups}
        onChange={changeAllowsEventSignups}
      />

      <BooleanInput
        caption="Counts towards convention maximum?"
        name="counts_towards_convention_maximum"
        value={ticketType.counts_towards_convention_maximum}
        onChange={changeCountsTowardsConventionMaximum}
      />

      <BootstrapFormInput
        label={`Number of event-provided ${pluralize(ticketName)} of this type (per event)`}
        name="maximum_event_provided_tickets"
        type="number"
        value={(ticketType.maximum_event_provided_tickets || '').toString()}
        onTextChange={changeMaximumEventProvidedTickets}
      />

      <fieldset>
        <p>Pricing schedule</p>

        <ScheduledValueEditor
          timezone={timezone}
          scheduledValue={ticketType.pricing_schedule}
          dispatch={dispatchPricingSchedule}
          buildValueInput={buildScheduledMoneyValueInput}
        />
      </fieldset>
    </div>
  );
}

TicketTypeForm.propTypes = {
  ticketType: TicketTypePropType.isRequired,
  ticketName: PropTypes.string.isRequired,
  timezone: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default TicketTypeForm;
