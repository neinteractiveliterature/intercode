import React, { useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/react-hooks';

import ErrorDisplay from '../ErrorDisplay';
import TicketForm from './TicketForm';
import { UpdateTicket } from './mutations.gql';
import { UserConProfileAdminQuery } from './queries.gql';
import usePageTitle from '../usePageTitle';
import useValueUnless from '../useValueUnless';
import PageLoadingIndicator from '../PageLoadingIndicator';

function EditTicket() {
  const userConProfileId = Number.parseInt(useParams().id, 10);
  const history = useHistory();
  const { data, loading, error } = useQuery(UserConProfileAdminQuery, {
    variables: { id: userConProfileId },
  });
  const [updateTicket] = useMutation(UpdateTicket);

  const onSubmit = useCallback(
    async (ticketInput) => {
      await updateTicket({
        variables: {
          id: data.userConProfile.ticket.id,
          ticket: ticketInput,
        },
      });
      history.push(`/user_con_profiles/${userConProfileId}`);
    },
    [updateTicket, history, userConProfileId, data],
  );

  usePageTitle(useValueUnless(
    () => `Editing ${data.convention.ticket_name} for ${data.userConProfile.name}`,
    error || loading,
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
        {'Edit '}
        {convention.name}
        {' '}
        {convention.ticket_name}
        {' for '}
        {userConProfile.name}
      </h1>

      <TicketForm
        convention={convention}
        initialTicket={userConProfile.ticket}
        onSubmit={onSubmit}
        submitCaption={`Save ${convention.ticket_name}`}
      />
    </>
  );
}

export default EditTicket;
