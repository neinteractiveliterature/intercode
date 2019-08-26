import React from 'react';
import PropTypes from 'prop-types';
import arrayToSentence from 'array-to-sentence';

import MultipleChoiceInput from '../../BuiltInFormControls/MultipleChoiceInput';

import {
  describeTicketType,
  describeTicketTypeProvidability,
  getProvidableTicketTypes,
  getProvidedTicketCountByType,
} from './ProvideTicketUtils';

function ProvidableTicketTypeSelection({
  convention, event, value, onChange, disabled,
}) {
  const providableTicketTypes = getProvidableTicketTypes(convention);
  const providedTicketCountByType = getProvidedTicketCountByType(convention, event);

  const providableTicketTypeDescriptions = providableTicketTypes
    .map((ticketType) => describeTicketTypeProvidability(
      ticketType,
      providedTicketCountByType[ticketType.id],
      convention.ticket_name,
    ));

  const providabilityDescription = [
    `${event.title} has`,
    (
      providableTicketTypeDescriptions.length > 0
        ? arrayToSentence(providableTicketTypeDescriptions)
        : 'no tickets'
    ),
    'remaining to provide',
  ].join(' ');

  const choices = providableTicketTypes.map((ticketType) => {
    const remaining = (
      ticketType.maximum_event_provided_tickets - providedTicketCountByType[ticketType.id]
    );

    return {
      label: `Provide ${describeTicketType(ticketType, convention.ticket_name)} (${remaining} remaining)`,
      value: ticketType.id.toString(),
      disabled: remaining < 1,
    };
  });

  return (
    <>
      <div>
        {providabilityDescription}
        .
      </div>

      <MultipleChoiceInput
        name="ticketTypeId"
        caption=""
        choices={choices}
        value={value == null ? '' : value.toString()}
        onChange={(newValue) => { onChange(Number.parseInt(newValue, 10)); }}
        disabled={disabled}
      />
    </>
  );
}

ProvidableTicketTypeSelection.propTypes = {
  convention: PropTypes.shape({
    ticket_name: PropTypes.string.isRequired,
  }).isRequired,
  event: PropTypes.shape({}).isRequired,
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

ProvidableTicketTypeSelection.defaultProps = {
  value: null,
  disabled: null,
};

export default ProvidableTicketTypeSelection;
