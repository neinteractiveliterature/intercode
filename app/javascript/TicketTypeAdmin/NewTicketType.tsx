import { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import { AdminTicketTypesQuery } from './queries';
import buildTicketTypeInput from './buildTicketTypeInput';
import TicketTypeForm, { EditingTicketType } from './TicketTypeForm';
import useAsyncFunction from '../useAsyncFunction';
import usePageTitle from '../usePageTitle';
import { useCreateTicketTypeMutation } from './mutations.generated';
import { AdminTicketTypesQueryData } from './queries.generated';

export type NewTicketTypeProps = {
  ticketName: string;
};

function NewTicketType({ ticketName }: NewTicketTypeProps): JSX.Element {
  const history = useHistory();
  usePageTitle(`New ${ticketName} type`);

  const [ticketType, setTicketType] = useState<EditingTicketType>({
    __typename: 'TicketType',
    allows_event_signups: true,
    id: 0,
    providing_products: [],
    name: '',
    description: '',
    maximum_event_provided_tickets: 0,
    counts_towards_convention_maximum: true,
  });

  const [mutate] = useCreateTicketTypeMutation({
    update: (proxy, result) => {
      const data = proxy.readQuery<AdminTicketTypesQueryData>({ query: AdminTicketTypesQuery });
      const newTicketType = result.data?.createTicketType?.ticket_type;
      if (!data || !newTicketType) {
        return;
      }

      proxy.writeQuery<AdminTicketTypesQueryData>({
        query: AdminTicketTypesQuery,
        data: {
          ...data,
          convention: {
            ...data.convention,
            ticket_types: [...data.convention.ticket_types, newTicketType],
          },
        },
      });
    },
  });

  const [saveClicked, error, inProgress] = useAsyncFunction(
    useCallback(async () => {
      await mutate({
        variables: {
          input: {
            ticket_type: buildTicketTypeInput(ticketType),
          },
        },
      });
      history.replace('/ticket_types');
    }, [mutate, ticketType, history]),
  );

  return (
    <div>
      <h1 className="mb-4">New {ticketName} type</h1>
      <TicketTypeForm ticketType={ticketType} ticketName={ticketName} onChange={setTicketType} />
      <button type="button" className="btn btn-primary" onClick={saveClicked} disabled={inProgress}>
        Save
      </button>
      <ErrorDisplay graphQLError={error as ApolloError} />
    </div>
  );
}

export default NewTicketType;
