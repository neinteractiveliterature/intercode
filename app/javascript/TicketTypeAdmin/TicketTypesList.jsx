import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import { capitalize } from 'inflected';
import { useMutation } from '@apollo/react-hooks';

import { AdminTicketTypesQuery } from './queries.gql';
import { DeleteTicketType } from './mutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import TicketTypePropType from './TicketTypePropType';
import Timespan from '../Timespan';
import formatMoney from '../formatMoney';
import pluralizeWithCount from '../pluralizeWithCount';
import { useConfirm } from '../ModalDialogs/Confirm';
import sortTicketTypes from './sortTicketTypes';
import usePageTitle from '../usePageTitle';

function cardClassForTicketType(ticketType) {
  if (ticketType.publicly_available) {
    return '';
  }

  if (ticketType.maximum_event_provided_tickets > 0) {
    return 'bg-success text-white';
  }

  return 'bg-dark text-white';
}

function describeTicketTypeOptions(ticketType, ticketName) {
  let eventProvidedDescription;
  if (ticketType.maximum_event_provided_tickets > 0) {
    eventProvidedDescription = `events can provide up to ${pluralizeWithCount(ticketName, ticketType.maximum_event_provided_tickets)}`;
  }

  if (ticketType.publicly_available) {
    if (eventProvidedDescription != null) {
      return `Available for purchase by the general public and ${eventProvidedDescription}`;
    }

    return 'Available for purchase by the general public';
  }

  if (eventProvidedDescription != null) {
    return capitalize(eventProvidedDescription);
  }

  return 'Private ticket type (cannot be purchased through the web)';
}

function renderPricingSchedule(ticketType, timezoneName) {
  const timespanItems = ticketType.pricing_schedule.timespans.map((timespan, i) => {
    const dollarValue = formatMoney(timespan.value);
    const timespanDescription = Timespan.fromStrings(timespan.start, timespan.finish)
      .humanizeInTimezone(timezoneName, 'MMMM D, YYYY');

    return (
      // eslint-disable-next-line react/no-array-index-key
      <li key={i}>
        {dollarValue}
        {' '}
        {timespanDescription}
      </li>
    );
  });

  return <ul className="mb-0">{timespanItems}</ul>;
}

function TicketTypesList({ ticketTypes, ticketName, timezoneName }) {
  const history = useHistory();
  usePageTitle(`${capitalize(ticketName)} types`);

  const confirm = useConfirm();
  const [deleteMutate] = useMutation(DeleteTicketType);
  const deleteTicketType = useCallback(
    async (id) => {
      await deleteMutate({
        variables: { input: { id } },
        update: (proxy) => {
          const data = proxy.readQuery({ query: AdminTicketTypesQuery });
          data.convention.ticket_types = data.convention.ticket_types.filter((
            (ticketType) => ticketType.id !== id
          ));
          proxy.writeQuery({ query: AdminTicketTypesQuery, data });
        },
      });
      history.replace('/');
    },
    [deleteMutate, history],
  );

  const renderTicketTypeDisplay = (ticketType) => (
    <div className={`card my-4 ${cardClassForTicketType(ticketType)}`} key={ticketType.id}>
      <div className="card-header">
        <div className="row">
          <div className="col-md-8">
            <strong>{ticketType.description}</strong>
            <tt>
              {' '}
              (
              {ticketType.name}
              )
            </tt>
          </div>
          <div className="col-md-4 text-right">
            <button
              type="button"
              className="btn btn-danger btn-sm mx-1"
              onClick={() => confirm({
                prompt: `Are you sure you want to delete the ticket type “${ticketType.description}”?`,
                action: () => deleteTicketType(ticketType.id),
                renderError: (error) => <ErrorDisplay graphQLError={error} />,
              })}
            >
              <i className="fa fa-trash-o mr-1" />
              Delete
            </button>
            <Link to={`/ticket_types/${ticketType.id}/edit`} className="btn btn-secondary btn-sm mx-1">
              <i className="fa fa-pencil-square-o mr-1" />
              Edit
            </Link>
          </div>
        </div>

        <p className="mb-0">
          <small>
            <em>
              {describeTicketTypeOptions(ticketType, ticketName)}
              {
                ticketType.counts_towards_convention_maximum
                  ? null
                  : [<br key="line-break" />, 'Does not count towards convention maximum']
              }
              {
                ticketType.allows_event_signups
                  ? null
                  : [<br key="line-break" />, 'Does not allow event signups']
              }
            </em>
          </small>
        </p>
      </div>

      <div className="card-body">
        {renderPricingSchedule(ticketType, timezoneName)}
      </div>
    </div>
  );

  const sortedTicketTypes = useMemo(
    () => sortTicketTypes(ticketTypes),
    [ticketTypes],
  );

  return (
    <div>
      <h1 className="mb-4">
        {capitalize(ticketName)}
        {' '}
        types
      </h1>

      {sortedTicketTypes.map(renderTicketTypeDisplay)}

      <Link to="/ticket_types/new" className="btn btn-primary">
        New
        {' '}
        {ticketName}
        {' '}
        type
      </Link>
    </div>
  );
}

TicketTypesList.propTypes = {
  ticketTypes: PropTypes.arrayOf(TicketTypePropType).isRequired,
  ticketName: PropTypes.string.isRequired,
  timezoneName: PropTypes.string.isRequired,
};

export default TicketTypesList;
