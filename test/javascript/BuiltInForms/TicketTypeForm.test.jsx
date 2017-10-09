import React from 'react';
import { shallow } from 'enzyme';
import TicketTypeForm from '../../../app/javascript/BuiltInForms/TicketTypeForm';

test('TicketTypeForm renders', () => {
  const component = shallow(
    <TicketTypeForm
      initialTicketType={{
        name: '',
        description: '',
        pricing_schedule: {
          timespans: [],
        },
      }}
      baseUrl="/ticket_types"
      timezone="US/Eastern"
    />,
  );

  expect(component).not.toBeNull();
});
