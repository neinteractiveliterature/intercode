import React from 'react';
import { shallow } from 'enzyme';
import TicketTypeForm from '../../../app/javascript/TicketTypeAdmin/TicketTypeForm';

test('TicketTypeForm renders', () => {
  const component = shallow(<TicketTypeForm
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

  expect(component).not.toBeNull();
});
