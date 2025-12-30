import { useState, useContext } from 'react';
import { ActionFunction, redirect, useFetcher, useLoaderData, RouterContextProvider } from 'react-router';

import { ErrorDisplay } from '@neinteractiveliterature/litform';

import buildTicketTypeInput from './buildTicketTypeInput';
import TicketTypeForm from './TicketTypeForm';
import usePageTitle from '../usePageTitle';
import AppRootContext from '../AppRootContext';
import { SingleTicketTypeLoaderResult } from './loaders';
import { TicketTypeInput } from '~/graphqlTypes.generated';
import { apolloClientContext } from '~/AppContexts';
import { UpdateTicketTypeDocument } from './mutations.generated';
import invariant from 'tiny-invariant';

export const clientAction: ActionFunction<RouterContextProvider> = async ({ context, request, params: { id } }) => {
  const client = context.get(apolloClientContext);
  invariant(id != null);
  try {
    const ticketType = (await request.json()) as TicketTypeInput;
    await client.mutate({
      mutation: UpdateTicketTypeDocument,
      variables: {
        input: { ticket_type: ticketType, id },
      },
    });

    return redirect('/ticket_types');
  } catch (error) {
    return error;
  }
};

function EditTicketTypeForm() {
  const initialTicketType = useLoaderData() as SingleTicketTypeLoaderResult;
  const { ticketName } = useContext(AppRootContext);
  usePageTitle(`Editing “${initialTicketType.name}”`);
  const [ticketType, setTicketType] = useState(initialTicketType);
  const fetcher = useFetcher();
  const error = fetcher.data instanceof Error ? fetcher.data : undefined;
  const inProgress = fetcher.state !== 'idle';

  const saveClicked = () => {
    fetcher.submit(buildTicketTypeInput(ticketType), { method: 'PATCH', encType: 'application/json' });
  };

  return (
    <div>
      <h1 className="mb-4">
        Editing {ticketName} type “{initialTicketType.name}”
      </h1>
      <TicketTypeForm ticketType={ticketType} onChange={setTicketType} />
      <button type="button" className="btn btn-primary" onClick={saveClicked} disabled={inProgress}>
        Save changes
      </button>
      <ErrorDisplay graphQLError={error} />
    </div>
  );
}

export const Component = EditTicketTypeForm;
