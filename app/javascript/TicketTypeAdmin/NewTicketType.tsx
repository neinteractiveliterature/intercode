import { useContext, useState } from 'react';
import { ActionFunction, replace, useFetcher, useLoaderData } from 'react-router';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import buildTicketTypeInput from './buildTicketTypeInput';
import TicketTypeForm, { EditingTicketType } from './TicketTypeForm';
import usePageTitle from '../usePageTitle';
import { TicketTypeAdmin_TicketTypeFieldsFragmentDoc } from './queries.generated';
import AppRootContext from '../AppRootContext';
import { TicketTypeLoaderResult } from './loaders';
import { useTranslation } from 'react-i18next';
import { Convention, TicketTypeInput } from 'graphqlTypes.generated';
import { client } from 'useIntercodeApolloClient';
import { CreateTicketTypeDocument } from './mutations.generated';

type ActionInput = {
  ticketType: TicketTypeInput;
  conventionId: string;
  eventId: string | null;
};

export const action: ActionFunction = async ({ request }) => {
  try {
    const { ticketType, eventId, conventionId } = (await request.json()) as ActionInput;
    await client.mutate({
      mutation: CreateTicketTypeDocument,
      variables: {
        input: { ticket_type: ticketType, eventId },
      },
      update: (cache, result) => {
        const ticketType = result.data?.createTicketType.ticket_type;
        if (ticketType) {
          const ref = cache.writeFragment({
            fragment: TicketTypeAdmin_TicketTypeFieldsFragmentDoc,
            fragmentName: 'TicketTypeAdmin_TicketTypeFields',
            data: ticketType,
          });
          cache.modify<Convention | Event>({
            id: cache.identify(
              eventId ? { __typename: 'Event', id: eventId } : { __typename: 'Convention', id: conventionId },
            ),
            fields: {
              ticket_types: (value) => [...value, ref],
            },
          });
        }
      },
    });

    return replace('/ticket_types');
  } catch (error) {
    return error;
  }
};

function NewTicketType() {
  const { t } = useTranslation();
  const { parent } = useLoaderData() as TicketTypeLoaderResult;
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

export const Component = NewTicketType;
