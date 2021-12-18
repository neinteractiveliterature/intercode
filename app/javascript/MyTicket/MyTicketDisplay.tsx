import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { DateTime } from 'luxon';
import { LoadQueryWrapper } from '@neinteractiveliterature/litform';

import formatMoney from '../formatMoney';
import usePageTitle from '../usePageTitle';
import AppRootContext from '../AppRootContext';
import { useMyTicketDisplayQuery } from './queries.generated';
import { useAppDateTimeFormat } from '../TimeUtils';

export default LoadQueryWrapper(useMyTicketDisplayQuery, function MyTicketDisplay({ data }) {
  const format = useAppDateTimeFormat();
  const { timezoneName } = useContext(AppRootContext);

  usePageTitle(`My ${data.convention.ticket_name} receipt`);

  const { convention } = data;
  const ticket = convention.my_profile?.ticket;
  const paymentAmount = ticket?.order_entry?.price_per_item;

  if (!ticket) {
    return <Navigate to="/ticket/new" replace />;
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
            <div className="lead flex-grow-1">{convention.my_profile?.name_without_nickname}</div>
            <div className="lead fw-bold">{paymentAmount && paymentAmount.fractional > 0 ? 'Paid' : 'Comp'}</div>
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
              {format(DateTime.fromISO(ticket.created_at, { zone: timezoneName }), 'longWeekdayDateTimeWithZone')}
            </dd>
            <dt className="col-md-3">Last updated</dt>
            <dd className="col-md-9">
              {format(DateTime.fromISO(ticket.updated_at, { zone: timezoneName }), 'longWeekdayDateTimeWithZone')}
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
