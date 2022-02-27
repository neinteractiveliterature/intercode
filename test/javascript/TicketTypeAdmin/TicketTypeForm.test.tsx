import { render } from '../testUtils';
import TicketTypeForm from '../../../app/javascript/TicketTypeAdmin/TicketTypeForm';

test('TicketTypeForm matches snapshot', async () => {
  const { asFragment } = await render(
    <TicketTypeForm
      ticketType={{
        __typename: 'TicketType',
        allows_event_signups: true,
        id: '0',
        providing_products: [],
        name: '',
        description: '',
        maximum_event_provided_tickets: 0,
        counts_towards_convention_maximum: true,
      }}
      onChange={() => {}}
    />,
    {
      appRootContextValue: { ticketName: 'banana', ticketNamePlural: 'bananas' },
    },
  );

  expect(asFragment()).toMatchSnapshot();
});
