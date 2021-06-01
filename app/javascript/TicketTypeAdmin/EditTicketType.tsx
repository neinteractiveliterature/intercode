import { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import buildTicketTypeInput from './buildTicketTypeInput';
import TicketTypeForm from './TicketTypeForm';
import useAsyncFunction from '../useAsyncFunction';
import usePageTitle from '../usePageTitle';
import { useAdminTicketTypesQuery } from './queries.generated';
import { useUpdateTicketTypeMutation } from './mutations.generated';
import { LoadSingleValueFromCollectionWrapper } from '../GraphqlLoadingWrappers';

export default LoadSingleValueFromCollectionWrapper(
  useAdminTicketTypesQuery,
  (data, id) => data.convention.ticket_types.find((tt) => tt.id.toString() === id),
  function EditTicketTypeForm({
    value: initialTicketType,
    data: {
      convention: { ticket_name: ticketName },
    },
  }) {
    const history = useHistory();
    usePageTitle(`Editing “${initialTicketType.name}”`);
    const [ticketType, setTicketType] = useState(initialTicketType);
    const [mutate] = useUpdateTicketTypeMutation();
    const [saveClicked, error, inProgress] = useAsyncFunction(
      useCallback(async () => {
        await mutate({
          variables: {
            input: {
              id: ticketType.id,
              ticket_type: buildTicketTypeInput(ticketType),
            },
          },
        });
        history.push('/ticket_types');
      }, [mutate, history, ticketType]),
    );

    return (
      <div>
        <h1 className="mb-4">
          Editing {ticketName} type &ldquo;
          {ticketType.name}
          &rdquo;
        </h1>
        <TicketTypeForm ticketType={ticketType} ticketName={ticketName} onChange={setTicketType} />
        <button
          type="button"
          className="btn btn-primary"
          onClick={saveClicked}
          disabled={inProgress}
        >
          Save changes
        </button>
        <ErrorDisplay graphQLError={error as ApolloError} />
      </div>
    );
  },
);
