import { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { DateTime } from 'luxon';

import formatMoney from '../formatMoney';
import usePageTitle from '../usePageTitle';
import AppRootContext from '../AppRootContext';
import { useMyTicketDisplayQueryQuery } from './queries.generated';
import { LoadQueryWrapper } from '../GraphqlLoadingWrappers';
import { formatLCM } from '../TimeUtils';

const dateFormat = "cccc, MMMM d, yyyy 'at' h:mmaaa ZZZ";

export default LoadQueryWrapper(useMyTicketDisplayQueryQuery, function MyTicketDisplay({ data }) {
  const { timezoneName } = useContext(AppRootContext);

  usePageTitle(`My ${data.convention.ticket_name} receipt`);

  const { convention, myProfile } = data;
  const ticket = myProfile?.ticket;
  const paymentAmount = ticket?.order_entry?.price_per_item;

  if (!myProfile || !ticket) {
    return <Redirect to="/new" />;
  }

  return (
    <>
      <h1 className="mb-4">
        My {convention.ticket_name}
        {' receipt for '}
        {convention.name}
      </h1>

      <div className="card">
        <div className="card-header">
          <div className="d-flex">
            <div className="lead flex-grow-1">{myProfile.name_without_nickname}</div>
            <div className="lead font-weight-bold">
              {paymentAmount && paymentAmount.fractional > 0 ? 'Paid' : 'Comp'}
            </div>
          </div>
        </div>
        <div className="card-body">
          <dl className="row mb-0">
            {ticket.provided_by_event && (
              <>
                <dt className="col-md-3">Provided by event</dt>
                <dd className="col-md-9">{ticket.provided_by_event.title}</dd>
              </>
            )}
            <dt className="col-md-3">Paid</dt>
            <dd className="col-md-9">{formatMoney(paymentAmount) || '0'}</dd>
            {ticket.order_entry?.order?.charge_id && (
              <>
                <dt className="col-md-3">Transaction ID</dt>
                <dd className="col-md-9">{ticket.order_entry?.order?.charge_id}</dd>
              </>
            )}
            <dt className="col-md-3">Created</dt>
            <dd className="col-md-9">
              {formatLCM(DateTime.fromISO(ticket.created_at, { zone: timezoneName }), dateFormat)}
            </dd>
            <dt className="col-md-3">Last updated</dt>
            <dd className="col-md-9">
              {formatLCM(DateTime.fromISO(ticket.updated_at, { zone: timezoneName }), dateFormat)}
            </dd>
          </dl>
        </div>
        <div className="card-footer">
          <div className="d-flex">
            <div className="flex-grow-1">{ticket.ticket_type.description}</div>
            <div>{ticket.id}</div>
          </div>
        </div>
      </div>
    </>
  );
});
