import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useMutation } from 'react-apollo-hooks';

import buildTicketTypeInput from './buildTicketTypeInput';
import ErrorDisplay from '../ErrorDisplay';
import TicketTypeForm from './TicketTypeForm';
import TicketTypePropType from './TicketTypePropType';
import { UpdateTicketType } from './mutations.gql';
import useAsyncFunction from '../useAsyncFunction';
import usePageTitle from '../usePageTitle';

function EditTicketType({
  initialTicketType, ticketName, timezoneName, history,
}) {
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
        timezone={timezoneName}
        onChange={setTicketType}
      />
      <button type="button" className="btn btn-primary" onClick={saveClicked} disabled={inProgress}>
        Save changes
      </button>
      <ErrorDisplay graphQLError={error} />
    </div>
  );
}

EditTicketType.propTypes = {
  initialTicketType: TicketTypePropType.isRequired,
  ticketName: PropTypes.string.isRequired,
  timezoneName: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(EditTicketType);
