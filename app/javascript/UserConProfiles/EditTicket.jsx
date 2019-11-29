import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useMutation } from 'react-apollo-hooks';

import ErrorDisplay from '../ErrorDisplay';
import TicketForm from './TicketForm';
import { UpdateTicket } from './mutations.gql';
import { UserConProfileAdminQuery } from './queries.gql';
import useQuerySuspended from '../useQuerySuspended';
import usePageTitle from '../usePageTitle';
import useValueUnless from '../useValueUnless';

function EditTicket({ userConProfileId, history }) {
  const { data, error } = useQuerySuspended(UserConProfileAdminQuery, {
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

  usePageTitle(useValueUnless(() => `Editing ${data.convention.ticket_name} for ${data.userConProfile.name}`, error));

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

EditTicket.propTypes = {
  userConProfileId: PropTypes.number.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(EditTicket);
