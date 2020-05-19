import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/react-hooks';

import { AdminTicketTypesQuery } from './queries.gql';
import buildTicketTypeInput from './buildTicketTypeInput';
import ErrorDisplay from '../ErrorDisplay';
import TicketTypeForm from './TicketTypeForm';
import TicketTypePropType from './TicketTypePropType';
import { UpdateTicketType } from './mutations.gql';
import useAsyncFunction from '../useAsyncFunction';
import usePageTitle from '../usePageTitle';
import PageLoadingIndicator from '../PageLoadingIndicator';

function EditTicketTypeForm({ initialTicketType, ticketName }) {
  const history = useHistory();
  usePageTitle(`Editing “${initialTicketType.name}”`);
  const [ticketType, setTicketType] = useState(initialTicketType);
  const [mutate] = useMutation(UpdateTicketType);
  const [saveClicked, error, inProgress] = useAsyncFunction(useCallback(
    async () => {
      await mutate({
        variables: {
          input: {
            id: ticketType.id,
            ticket_type: buildTicketTypeInput(ticketType),
          },
        },
      });
      history.push('/ticket_types');
    },
    [mutate, history, ticketType],
  ));

  return (
    <div>
      <h1 className="mb-4">
        Editing
        {' '}
        {ticketName}
        {' '}
        type &ldquo;
        {ticketType.name}
        &rdquo;
      </h1>
      <TicketTypeForm
        ticketType={ticketType}
        ticketName={ticketName}
        onChange={setTicketType}
      />
      <button type="button" className="btn btn-primary" onClick={saveClicked} disabled={inProgress}>
        Save changes
      </button>
      <ErrorDisplay graphQLError={error} />
    </div>
  );
}

EditTicketTypeForm.propTypes = {
  initialTicketType: TicketTypePropType.isRequired,
  ticketName: PropTypes.string.isRequired,
};

function EditTicketType() {
  const { id } = useParams();
  const { data, loading, error } = useQuery(AdminTicketTypesQuery);

  const convention = useMemo(
    () => (loading || error ? null : data.convention),
    [data, error, loading],
  );

  const initialTicketType = useMemo(
    () => (convention ? convention.ticket_types.find((tt) => tt.id.toString(10) === id) : null),
    [convention, id],
  );

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <EditTicketTypeForm
      initialTicketType={initialTicketType}
      ticketName={convention.ticket_name}
    />
  );
}

export default EditTicketType;
