import React from 'react';

import { describeTicketType } from './ProvideTicketUtils';

function TicketingStatusDescription({ userConProfile, convention }) {
  const statusDescription = [];
  statusDescription.push(userConProfile.name_without_nickname);
  const { ticket_name: ticketName } = convention;

  if (userConProfile.ticket) {
    statusDescription.push((
      ` has a ${describeTicketType(userConProfile.ticket.ticket_type, ticketName)}`
    ));
    if (userConProfile.ticket.provided_by_event) {
      statusDescription.push(` provided by ${userConProfile.ticket.provided_by_event.title}`);
    }
  } else {
    statusDescription.push((
      <span key="unticketed-warning">
        <span className="text-danger">
          {' '}
          has no
          {' '}
          {ticketName}
          {' '}
          for
          {' '}
          {convention.name}
          .
        </span>
        {' '}
        Without a
        {' '}
        {ticketName}
        , users cannot sign up for events at the convention
      </span>
    ));
  }

  statusDescription.push('.');

  return statusDescription;
}

export default TicketingStatusDescription;
