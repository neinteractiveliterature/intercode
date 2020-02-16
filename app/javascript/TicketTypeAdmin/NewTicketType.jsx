import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';

import { AdminTicketTypesQuery } from './queries.gql';
import buildTicketTypeInput from './buildTicketTypeInput';
import { CreateTicketType } from './mutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import TicketTypeForm from './TicketTypeForm';
import useAsyncFunction from '../useAsyncFunction';
import usePageTitle from '../usePageTitle';

function NewTicketType({ ticketName, timezoneName, history }) {
  usePageTitle(`New ${ticketName} type`);

  const [ticketType, setTicketType] = useState({
    name: '',
    description: '',
    publicly_available: false,
    maximum_event_provided_tickets: 0,
    counts_towards_convention_maximum: true,
    pricing_schedule: {
      timespans: [],
    },
  });

  const [mutate] = useMutation(CreateTicketType, {
    update: (proxy, { data: { createTicketType: { ticket_type: newTicketType } } }) => {
      const data = proxy.readQuery({ query: AdminTicketTypesQuery });
      data.convention.ticket_types.push(newTicketType);
      proxy.writeQuery({ query: AdminTicketTypesQuery, data });
    },
  });

  const [saveClicked, error, inProgress] = useAsyncFunction(useCallback(
    async () => {
      await mutate({
        variables: {
          input: {
            ticket_type: buildTicketTypeInput(ticketType),
          },
        },
      });
      history.replace('/ticket_types');
    },
    [mutate, ticketType, history],
  ));

  return (
    <div>
      <h1 className="mb-4">
        New
        {' '}
        {ticketName}
        {' '}
        type
      </h1>
      <TicketTypeForm
        ticketType={ticketType}
        ticketName={ticketName}
        timezone={timezoneName}
        onChange={setTicketType}
      />
      <button type="button" className="btn btn-primary" onClick={saveClicked} disabled={inProgress}>Save</button>
      <ErrorDisplay graphQLError={error} />
    </div>
  );
}

NewTicketType.propTypes = {
  ticketName: PropTypes.string.isRequired,
  timezoneName: PropTypes.string.isRequired,
  history: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(NewTicketType);
