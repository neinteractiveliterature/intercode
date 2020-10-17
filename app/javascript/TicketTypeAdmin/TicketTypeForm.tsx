import React from 'react';
import { pluralize } from 'inflected';

import BooleanInput from '../BuiltInFormControls/BooleanInput';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import { parseIntOrNull } from '../ComposableFormUtils';
import { usePartialState, usePartialStateFactoryWithValueSetter } from '../usePartialState';
import { TicketTypeAdmin_TicketTypeFieldsFragment } from './queries.generated';

export type EditingTicketType = Omit<
  TicketTypeAdmin_TicketTypeFieldsFragment,
  'maximum_event_provided_tickets'
> & {
  maximum_event_provided_tickets?: number | null;
};

export type TicketTypeForm = {
  ticketType: EditingTicketType;
  onChange: React.Dispatch<EditingTicketType>;
  ticketName: string;
};

function TicketTypeForm({ ticketType, ticketName, onChange }: TicketTypeForm) {
  const factory = usePartialStateFactoryWithValueSetter(ticketType, onChange);
  const [name, setName] = usePartialState(factory, 'name');
  const [description, setDescription] = usePartialState(factory, 'description');
  const [countsTowardsConventionMaximum, setCountsTowardsConventionMaximum] = usePartialState(
    factory,
    'counts_towards_convention_maximum',
  );
  const [allowsEventSignups, setAllowsEventSignups] = usePartialState(
    factory,
    'allows_event_signups',
  );
  const [maximumEventProvidedTickets, setMaximumEventProvidedTickets] = usePartialState(
    factory,
    'maximum_event_provided_tickets',
  );

  return (
    <div>
      <BootstrapFormInput
        label="Name (no spaces allowed &mdash; only letters, numbers, and underscores)"
        name="name"
        type="text"
        style={{ fontFamily: 'monospace' }}
        value={name}
        onTextChange={setName}
      />

      <BootstrapFormInput
        label="Description"
        name="description"
        type="text"
        value={description ?? ''}
        onTextChange={setDescription}
      />

      <BooleanInput
        caption="Allows event signups?"
        name="allows_event_signups"
        value={allowsEventSignups}
        onChange={setAllowsEventSignups}
      />

      <BooleanInput
        caption="Counts towards convention maximum?"
        name="counts_towards_convention_maximum"
        value={countsTowardsConventionMaximum}
        onChange={setCountsTowardsConventionMaximum}
      />

      <BootstrapFormInput
        label={`Number of event-provided ${pluralize(ticketName)} of this type (per event)`}
        name="maximum_event_provided_tickets"
        type="number"
        value={(maximumEventProvidedTickets ?? '').toString()}
        onTextChange={(newValue) => setMaximumEventProvidedTickets(parseIntOrNull(newValue))}
      />
    </div>
  );
}

export default TicketTypeForm;
