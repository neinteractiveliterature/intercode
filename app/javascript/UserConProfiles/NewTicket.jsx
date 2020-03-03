import React, { useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/react-hooks';

import { CreateTicket } from './mutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import TicketForm from './TicketForm';
import { UserConProfileAdminQuery } from './queries.gql';
import usePageTitle from '../usePageTitle';
import useValueUnless from '../useValueUnless';
import PageLoadingIndicator from '../PageLoadingIndicator';

function NewTicket() {
  const userConProfileId = Number.parseInt(useParams().id, 10);
  const history = useHistory();
  const { data, loading, error } = useQuery(UserConProfileAdminQuery, {
    variables: { id: userConProfileId },
  });
  const [createTicket] = useMutation(CreateTicket, {
    update: (cache, { data: { createTicket: { ticket } } }) => {
      const cacheData = cache.readQuery({
        query: UserConProfileAdminQuery,
        variables: { id: userConProfileId },
      });
      cache.writeQuery({
        query: UserConProfileAdminQuery,
        variables: { id: userConProfileId },
        data: {
          ...cacheData,
          userConProfile: {
            ...cacheData.userConProfile,
            ticket,
          },
        },
      });
    },
  });

  const onSubmit = useCallback(
    async (ticketInput) => {
      await createTicket({
        variables: {
          userConProfileId,
          ticket: ticketInput,
        },
      });
      history.push(`/user_con_profiles/${userConProfileId}`);
    },
    [createTicket, history, userConProfileId],
  );

  usePageTitle(useValueUnless(
    () => `New ${data.convention.ticket_name} for ${data.userConProfile.name}`,
    loading || error,
  ));

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const { convention, userConProfile } = data;

  return (
    <>
      <h1 className="mb-4">
        {'Create '}
        {convention.name}
        {' '}
        {convention.ticket_name}
        {' for '}
        {userConProfile.name}
      </h1>

      <TicketForm
        convention={convention}
        initialTicket={{
          ticket_type: null,
          payment_amount: {
            fractional: 0,
            currency_code: 'USD',
          },
          payment_note: '',
          provided_by_event: null,
        }}
        onSubmit={onSubmit}
        submitCaption={`Create ${convention.ticket_name}`}
      />
    </>
  );
}

export default NewTicket;
