import React from 'react';
import PropTypes from 'prop-types';
import sumBy from 'lodash/sumBy';
import { useTranslation } from 'react-i18next';

import { pluralize, humanize } from 'inflected';
import MultipleChoiceInput from '../../BuiltInFormControls/MultipleChoiceInput';

import {
  getProvidableTicketTypes,
  getRemainingTicketCountByType,
} from './ProvideTicketUtils';

function ProvidableTicketTypeSelection({
  convention, event, value, onChange, disabled,
}) {
  const { t } = useTranslation();
  const providableTicketTypes = getProvidableTicketTypes(convention);
  const remainingCountByType = getRemainingTicketCountByType(convention, event);

  const totalRemaining = sumBy(Object.entries(remainingCountByType), ([, remaining]) => remaining);
  const providabilityDescription = t(
    'events.teamMemberAdmin.ticketProvidability',
    '{{ eventTitle }} has {{ count }} {{ ticketName }} remaining to provide.',
    {
      eventTitle: event.title,
      count: totalRemaining,
      ticketName: totalRemaining === 1 ? convention.ticket_name : pluralize(convention.ticket_name),
    },
  );

  const choices = providableTicketTypes.map((ticketType) => {
    const remaining = remainingCountByType[ticketType.id];

    return {
      label: t(
        'events.teamMemberAdmin.provideTicketChoice',
        'Provide {{ ticketType }} {{ ticketName }} ({{ count }} remaining)',
        {
          ticketType: humanize(ticketType.name).toLowerCase(),
          ticketName: convention.ticket_name,
          count: remaining,
        },
      ),
      value: ticketType.id.toString(),
      disabled: remaining < 1,
    };
  });

  return (
    <>
      <div>
        {providabilityDescription}
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
