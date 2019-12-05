import React from 'react';

import { render } from '../testUtils';
import TicketTypeForm from '../../../app/javascript/TicketTypeAdmin/TicketTypeForm';

test('TicketTypeForm matches snapshot', () => {
  const { asFragment } = render(<TicketTypeForm
    ticketType={{
      name: '',
      description: '',
      pricing_schedule: {
        timespans: [],
      },
      publicly_available: true,
      maximum_event_provided_tickets: 0,
      counts_towards_convention_maximum: true,
    }}
    ticketName="banana"
    timezone="UTC"
    onChange={() => {}}
  />);

  expect(asFragment()).toMatchSnapshot();
});
