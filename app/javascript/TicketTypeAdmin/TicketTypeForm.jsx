import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { pluralize } from 'inflected';

import BooleanInput from '../BuiltInFormControls/BooleanInput';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import { Transforms, transformsReducer, useChangeDispatchers } from '../ComposableFormUtils';
import TicketTypePropType from './TicketTypePropType';

const ticketTypeTransformsReducer = transformsReducer({
  maximum_event_provided_tickets: Transforms.integer,
});

function ticketTypeReducer(state, action) {
  return ticketTypeTransformsReducer(
    state,
    action,
  );
}

function TicketTypeForm({
  ticketType, ticketName, onChange,
}) {
  const dispatch = useCallback(
    (action) => onChange(ticketTypeReducer(ticketType, action)),
    [ticketType, onChange],
  );
  const [
    changeName,
    changeDescription,
    changeCountsTowardsConventionMaximum,
    changeAllowsEventSignups,
    changeMaximumEventProvidedTickets,
  ] = useChangeDispatchers(
    dispatch,
    [
      'name',
      'description',
      'counts_towards_convention_maximum',
      'allows_event_signups',
      'maximum_event_provided_tickets',
    ],
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
    </div>
  );
}

TicketTypeForm.propTypes = {
  ticketType: TicketTypePropType.isRequired,
  ticketName: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default TicketTypeForm;
