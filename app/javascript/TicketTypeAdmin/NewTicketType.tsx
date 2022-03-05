import { useCallback, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import {
  ErrorDisplay,
  LoadQueryWrapper,
  useCreateMutationWithReferenceArrayUpdater,
} from '@neinteractiveliterature/litform';

import buildTicketTypeInput from './buildTicketTypeInput';
import TicketTypeForm, { EditingTicketType } from './TicketTypeForm';
import useAsyncFunction from '../useAsyncFunction';
import usePageTitle from '../usePageTitle';
import { useCreateTicketTypeMutation } from './mutations.generated';
import { TicketTypeAdmin_TicketTypeFieldsFragmentDoc } from './queries.generated';
import AppRootContext from '../AppRootContext';
import { useTicketTypesQueryFromRoute } from './useTicketTypesQueryFromRoute';

export default LoadQueryWrapper(useTicketTypesQueryFromRoute, function NewTicketType({ data }) {
  const { ticketName } = useContext(AppRootContext);

  const navigate = useNavigate();
  usePageTitle(`New ${ticketName} type`);

  const [ticketType, setTicketType] = useState<EditingTicketType>({
    __typename: 'TicketType',
    allows_event_signups: true,
    id: '',
    providing_products: [],
    name: '',
    description: '',
    maximum_event_provided_tickets: 0,
    counts_towards_convention_maximum: true,
  });

  const [mutate] = useCreateMutationWithReferenceArrayUpdater(
    useCreateTicketTypeMutation,
    'event' in data.convention ? data.convention.event : data.convention,
    'ticket_types',
    (data) => data.createTicketType.ticket_type,
    TicketTypeAdmin_TicketTypeFieldsFragmentDoc,
    'TicketTypeAdmin_TicketTypeFields',
  );

  const [saveClicked, error, inProgress] = useAsyncFunction(
    useCallback(async () => {
      await mutate({
        variables: {
          input: {
            ticket_type: buildTicketTypeInput(ticketType),
            eventId: 'event' in data.convention ? data.convention.event.id : undefined,
          },
        },
      });
      navigate('..', { replace: true });
    }, [mutate, ticketType, navigate, data.convention]),
  );

  return (
    <div>
      <h1 className="mb-4">New {ticketName} type</h1>
      <TicketTypeForm ticketType={ticketType} onChange={setTicketType} />
      <button type="button" className="btn btn-primary" onClick={saveClicked} disabled={inProgress}>
        Save
      </button>
      <ErrorDisplay graphQLError={error as ApolloError} />
    </div>
  );
});
