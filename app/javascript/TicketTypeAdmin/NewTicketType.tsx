import { useContext, useState } from 'react';
import { ActionFunction, replace, useFetcher } from 'react-router';
import { ApolloClient, ApolloError } from '@apollo/client';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import buildTicketTypeInput from './buildTicketTypeInput';
import TicketTypeForm, { EditingTicketType } from './TicketTypeForm';
import usePageTitle from '../usePageTitle';
import AppRootContext from '../AppRootContext';
import { TicketTypeLoaderResult } from './loaders';
import { useTranslation } from 'react-i18next';
import { Convention, TicketTypeInput } from 'graphqlTypes.generated';
import { CreateTicketTypeDocument } from './mutations.generated';
import updateCacheAfterCreateTicketType from './updateCacheAfterCreateTicketType';

type ActionInput = {
  ticketType: TicketTypeInput;
  conventionId: string;
  eventId: string | null;
};

export async function action({ request }) {
  try {
    const { ticketType, eventId, conventionId } = (await request.json()) as ActionInput;
    const client = new ApolloClient();
    await client.mutate({
      mutation: CreateTicketTypeDocument,
      variables: {
        input: { ticket_type: ticketType, eventId },
      },
      update: updateCacheAfterCreateTicketType(eventId, conventionId, (cache, ref) => {
        cache.modify<Convention>({
          id: cache.identify({ __typename: 'Convention', id: conventionId }),
          fields: {
            ticket_types: (value) => [...value, ref],
          },
        });
      }),
    });

    return replace('/ticket_types');
  } catch (error) {
    return error;
  }
}

function NewTicketType({ parent }: TicketTypeLoaderResult) {
  const { t } = useTranslation();
  const { convention, ticketName } = useContext(AppRootContext);
  const fetcher = useFetcher();
  const error = fetcher.data instanceof Error ? fetcher.data : undefined;
  const inProgress = fetcher.state !== 'idle';

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

  const saveClicked = () => {
    fetcher.submit(
      {
        ticketType: buildTicketTypeInput(ticketType),
        conventionId: convention?.id ?? '',
        eventId: parent.__typename === 'Event' ? parent.id : null,
      } satisfies ActionInput,
      { method: 'POST', encType: 'application/json' },
    );
  };

  return (
    <div>
      <h1 className="mb-4">New {ticketName} type</h1>
      <TicketTypeForm ticketType={ticketType} onChange={setTicketType} />
      <button type="button" className="btn btn-primary" onClick={saveClicked} disabled={inProgress}>
        {t('buttons.save')}
      </button>
      <ErrorDisplay graphQLError={error as ApolloError} />
    </div>
  );
}

export default NewTicketType;
