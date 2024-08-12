import { useState, useCallback, useContext } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import buildTicketTypeInput from './buildTicketTypeInput';
import TicketTypeForm from './TicketTypeForm';
import useAsyncFunction from '../useAsyncFunction';
import usePageTitle from '../usePageTitle';
import { useUpdateTicketTypeMutation } from './mutations.generated';
import AppRootContext from '../AppRootContext';
import { SingleTicketTypeLoaderResult } from './loaders';

function EditTicketTypeForm() {
  const initialTicketType = useLoaderData() as SingleTicketTypeLoaderResult;
  const { ticketName } = useContext(AppRootContext);
  const navigate = useNavigate();
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
      navigate('..');
    }, [mutate, navigate, ticketType]),
  );

  return (
    <div>
      <h1 className="mb-4">
        Editing {ticketName} type “{initialTicketType.name}”
      </h1>
      <TicketTypeForm ticketType={ticketType} onChange={setTicketType} />
      <button type="button" className="btn btn-primary" onClick={saveClicked} disabled={inProgress}>
        Save changes
      </button>
      <ErrorDisplay graphQLError={error as ApolloError} />
    </div>
  );
}

export const Component = EditTicketTypeForm;
