import * as React from 'react';
import { pluralize } from 'inflected';
import {
  BooleanInput,
  BootstrapFormInput,
  parseIntOrNull,
  usePropertySetters,
} from '@neinteractiveliterature/litform';

import { TicketTypeAdmin_TicketTypeFieldsFragment } from './queries.generated';

export type EditingTicketType = Omit<
  TicketTypeAdmin_TicketTypeFieldsFragment,
  'maximum_event_provided_tickets'
> & {
  maximum_event_provided_tickets?: number | null;
};

export type TicketTypeFormProps = {
  ticketType: EditingTicketType;
  onChange: React.Dispatch<React.SetStateAction<EditingTicketType>>;
  ticketName: string;
};

function TicketTypeForm({ ticketType, ticketName, onChange }: TicketTypeFormProps) {
  const [
    setName,
    setDescription,
    setCountsTowardsConventionMaximum,
    setAllowsEventSignups,
    setMaximumEventProvidedTickets,
  ] = usePropertySetters(
    onChange,
    'name',
    'description',
    'counts_towards_convention_maximum',
    'allows_event_signups',
    'maximum_event_provided_tickets',
  );

  return (
    <div>
      <BootstrapFormInput
        label="Name (no spaces allowed &mdash; only letters, numbers, and underscores)"
        name="name"
        type="text"
        style={{ fontFamily: 'monospace' }}
        value={ticketType.name}
        onTextChange={setName}
      />

      <BootstrapFormInput
        label="Description"
        name="description"
        type="text"
        value={ticketType.description ?? ''}
        onTextChange={setDescription}
      />

      <BooleanInput
        caption="Allows event signups?"
        name="allows_event_signups"
        value={ticketType.allows_event_signups}
        onChange={setAllowsEventSignups}
      />

      <BooleanInput
        caption="Counts towards convention maximum?"
        name="counts_towards_convention_maximum"
        value={ticketType.counts_towards_convention_maximum}
        onChange={setCountsTowardsConventionMaximum}
      />

      <BootstrapFormInput
        label={`Number of event-provided ${pluralize(ticketName)} of this type (per event)`}
        name="maximum_event_provided_tickets"
        type="number"
        value={(ticketType.maximum_event_provided_tickets ?? '').toString()}
        onTextChange={(newValue) => setMaximumEventProvidedTickets(parseIntOrNull(newValue))}
      />
    </div>
  );
}

export default TicketTypeForm;
