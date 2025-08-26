import React, { useContext } from 'react';
import { BooleanInput, BootstrapFormInput, parseIntOrNull, usePropertySetters } from '@neinteractiveliterature/litform';

import { TicketTypeAdmin_TicketTypeFieldsFragment } from './queries.generated';
import AppRootContext from '../AppRootContext';
import { useTranslation } from 'react-i18next';

export type EditingTicketType = Omit<TicketTypeAdmin_TicketTypeFieldsFragment, 'maximum_event_provided_tickets'> & {
  maximum_event_provided_tickets?: number | null;
};

export type TicketTypeFormProps = {
  ticketType: EditingTicketType;
  onChange: React.Dispatch<React.SetStateAction<EditingTicketType>>;
};

function TicketTypeForm({ ticketType, onChange }: TicketTypeFormProps): React.JSX.Element {
  const { t } = useTranslation();
  const { ticketNamePlural } = useContext(AppRootContext);

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
        label={t('admin.ticketTypes.edit.nameLabel')}
        name="name"
        type="text"
        style={{ fontFamily: 'monospace' }}
        value={ticketType.name}
        onTextChange={setName}
      />

      <BootstrapFormInput
        label={t('admin.ticketTypes.edit.descriptionLabel')}
        name="description"
        type="text"
        value={ticketType.description ?? ''}
        onTextChange={setDescription}
      />

      <BooleanInput
        caption={t('admin.ticketTypes.edit.allowsEventSignupsLabel')}
        name="allows_event_signups"
        value={ticketType.allows_event_signups}
        onChange={setAllowsEventSignups}
      />

      <BooleanInput
        caption={t('admin.ticketTypes.edit.countsTowardsConventionMaximumLabel')}
        name="counts_towards_convention_maximum"
        value={ticketType.counts_towards_convention_maximum}
        onChange={setCountsTowardsConventionMaximum}
      />

      <BootstrapFormInput
        label={t('admin.ticketTypes.edit.maximumEventProvidedTicketsLabel', { ticketNamePlural })}
        name="maximum_event_provided_tickets"
        type="number"
        value={(ticketType.maximum_event_provided_tickets ?? '').toString()}
        onTextChange={(newValue) => setMaximumEventProvidedTickets(parseIntOrNull(newValue))}
      />
    </div>
  );
}

export default TicketTypeForm;
