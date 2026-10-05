import { MockLink } from '@apollo/client/testing';
import { vi } from 'vitest';

import { render, userEvent, waitFor, within } from '../testUtils';
import ConvertToEventProvidedTicketModal from '../../../app/javascript/UserConProfiles/ConvertToEventProvidedTicketModal';
import {
  ConvertToEventProvidedTicketQueryData,
  ConvertToEventProvidedTicketQueryDocument,
} from '../../../app/javascript/UserConProfiles/queries.generated';
import {
  ConvertTicketToEventProvidedDocument,
  ConvertTicketToEventProvidedMutationData,
  ConvertTicketToEventProvidedMutationVariables,
} from '../../../app/javascript/UserConProfiles/mutations.generated';

// The event picker is an async react-select (which has its own tests); here it's a stand-in that picks an event.
vi.mock('../../../app/javascript/BuiltInFormControls/EventSelect', () => ({
  default: ({
    onChange,
    isDisabled,
  }: {
    onChange: (event: { __typename: 'Event'; id: string; title: string }) => void;
    isDisabled?: boolean;
  }) => (
    <button
      type="button"
      disabled={isDisabled}
      onClick={() => onChange({ __typename: 'Event', id: '10', title: 'Big Game' })}
    >
      Choose Big Game
    </button>
  ),
}));

const convention = { name: 'Test Con', ticket_name: 'badge' };
const userConProfile = {
  id: '7',
  name_without_nickname: 'Alice Attendee',
  ticket: { ticket_type: { name: 'weekend_pass' } },
};

const queryData: ConvertToEventProvidedTicketQueryData = {
  __typename: 'Query',
  convention: {
    __typename: 'Convention',
    id: '1',
    ticket_name: 'badge',
    ticketNamePlural: 'badges',
    event: {
      __typename: 'Event',
      id: '10',
      title: 'Big Game',
      event_category: { __typename: 'EventCategory', id: '1', can_provide_tickets: true },
      provided_tickets: [
        { __typename: 'Ticket', id: '50', ticket_type: { __typename: 'TicketType', id: '3', name: 'gm_comp' } },
      ],
    },
    ticket_types: [
      { __typename: 'TicketType', id: '3', maximum_event_provided_tickets: 3, description: 'GM', name: 'gm_comp' },
      {
        __typename: 'TicketType',
        id: '4',
        maximum_event_provided_tickets: 0,
        description: 'Full',
        name: 'weekend_pass',
      },
    ],
  },
};

// The event's ticket types load through a suspense query once an event is chosen, which can take longer than the
// default one second on a busy CI runner
const SLOW = { timeout: 5000 };

describe('ConvertToEventProvidedTicketModal', () => {
  let user: ReturnType<typeof userEvent.setup>;
  const onClose = vi.fn();
  const converted = vi.fn<(variables: ConvertTicketToEventProvidedMutationVariables) => void>();

  beforeEach(() => {
    user = userEvent.setup();
    onClose.mockReset();
    converted.mockReset();
  });

  const queryMock: MockLink.MockedResponse<ConvertToEventProvidedTicketQueryData> = {
    request: { query: ConvertToEventProvidedTicketQueryDocument, variables: { eventId: '10' } },
    result: { data: queryData },
  };

  const convertMock = (
    options: Partial<
      MockLink.MockedResponse<ConvertTicketToEventProvidedMutationData, ConvertTicketToEventProvidedMutationVariables>
    > = {},
  ): MockLink.MockedResponse<
    ConvertTicketToEventProvidedMutationData,
    ConvertTicketToEventProvidedMutationVariables
  > => ({
    request: {
      query: ConvertTicketToEventProvidedDocument,
      variables: (variables) => {
        converted(variables);
        return true;
      },
    },
    result: {
      data: {
        __typename: 'Mutation',
        convertTicketToEventProvided: {
          __typename: 'ConvertTicketToEventProvidedPayload',
          ticket: {
            __typename: 'Ticket',
            id: '60',
            created_at: '2026-06-05T16:00:00Z',
            updated_at: '2026-06-05T16:00:00Z',
            order_entry: null,
            ticket_type: { __typename: 'TicketType', id: '3', description: 'GM', name: 'gm_comp' },
            provided_by_event: { __typename: 'Event', id: '10', title: 'Big Game' },
          },
        },
      },
    },
    ...options,
  });

  const renderModal = (apolloMocks: MockLink.MockedResponse[]) =>
    render(
      <ConvertToEventProvidedTicketModal
        convention={convention}
        userConProfile={userConProfile}
        visible
        onClose={onClose}
      />,
      { apolloMocks },
    );

  // (the test wrapper's confirm dialog has buttons of its own, so look within this modal's footer)
  const footerButton = (result: Awaited<ReturnType<typeof renderModal>>, name: string | RegExp) =>
    within(
      result.getByRole('button', { name: 'Convert badge', hidden: true }).closest('.modal-footer') as HTMLElement,
    ).getByRole('button', { name, hidden: true });

  const chooseEventAndTicketType = async (result: Awaited<ReturnType<typeof renderModal>>) => {
    await user.click(result.getByRole('button', { name: 'Choose Big Game', hidden: true }));
    await user.click(await result.findByRole('radio', { name: /Provide gm comp badge/, hidden: true }, SLOW));
  };

  it('says whose badge is being converted, and what will happen to it', async () => {
    const result = await renderModal([]);

    expect(result.getByText('Convert Alice Attendee’s badge to event-provided')).toBeTruthy();
    expect(result.getByText(/This will delete Alice Attendee’s existing badge/)).toBeTruthy();
  });

  it('needs both an event and a ticket type before it can convert', async () => {
    const result = await renderModal([queryMock]);
    expect(footerButton(result, 'Convert badge')).toBeDisabled();

    await user.click(result.getByRole('button', { name: 'Choose Big Game', hidden: true }));
    await result.findByText(/Big Game has 2 badges remaining to provide/, {}, SLOW);
    expect(footerButton(result, 'Convert badge')).toBeDisabled();
  });

  it('offers the ticket types the event can still provide, with how many remain', async () => {
    const result = await renderModal([queryMock]);

    await user.click(result.getByRole('button', { name: 'Choose Big Game', hidden: true }));

    expect(
      await result.findByRole('radio', { name: 'Provide gm comp badge (2 remaining)', hidden: true }, SLOW),
    ).toBeEnabled();
    // the ticket type that events can't provide isn't offered
    expect(result.queryByRole('radio', { name: /weekend pass/, hidden: true })).toBeNull();
  });

  it('converts the ticket for the chosen event and ticket type, then closes', async () => {
    const result = await renderModal([queryMock, convertMock()]);

    await chooseEventAndTicketType(result);
    await user.click(footerButton(result, 'Convert badge'));

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    expect(converted).toHaveBeenCalledWith({ eventId: '10', ticketTypeId: '3', userConProfileId: '7' });
  });

  it('shows the error and stays open if the conversion fails', async () => {
    const result = await renderModal([
      queryMock,
      convertMock({ result: { errors: [{ message: 'No more tickets available from this event' }] } }),
    ]);

    await chooseEventAndTicketType(result);
    await user.click(footerButton(result, 'Convert badge'));

    expect(await result.findByText(/No more tickets available from this event/)).toBeTruthy();
    expect(onClose).not.toHaveBeenCalled();
    expect(footerButton(result, 'Convert badge')).toBeEnabled();
  });

  it('disables everything while the conversion is in progress', async () => {
    const result = await renderModal([queryMock, convertMock({ delay: 100 })]);

    await chooseEventAndTicketType(result);
    await user.click(footerButton(result, 'Convert badge'));

    await waitFor(() => expect(footerButton(result, 'Convert badge')).toBeDisabled());
    expect(footerButton(result, 'Cancel')).toBeDisabled();
    expect(result.getByRole('button', { name: 'Choose Big Game', hidden: true })).toBeDisabled();
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('closes without converting anything when cancelled', async () => {
    const result = await renderModal([]);

    await user.click(footerButton(result, 'Cancel'));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(converted).not.toHaveBeenCalled();
  });
});
