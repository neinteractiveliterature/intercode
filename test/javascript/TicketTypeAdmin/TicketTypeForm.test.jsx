import React from 'react';

import { render } from '../testUtils';
import TicketTypeForm from '../../../app/javascript/TicketTypeAdmin/TicketTypeForm';

test('TicketTypeForm matches snapshot', () => {
  const { asFragment } = render(<TicketTypeForm
    ticketType={{
      name: '',
      description: '',
      maximum_event_provided_tickets: 0,
      counts_towards_convention_maximum: true,
    }}
    ticketName="banana"
    onChange={() => {}}
  />);

  expect(asFragment()).toMatchSnapshot();
});
