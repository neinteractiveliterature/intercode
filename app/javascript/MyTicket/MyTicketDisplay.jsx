import React from 'react';
import { Redirect } from 'react-router-dom';
import moment from 'moment-timezone';
import { useQuery } from 'react-apollo-hooks';

import { MyTicketDisplayQuery } from './queries.gql';
import ErrorDisplay from '../ErrorDisplay';
import formatMoney from '../formatMoney';
import useValueUnless from '../useValueUnless';
import usePageTitle from '../usePageTitle';
import LoadingIndicator from '../LoadingIndicator';

const dateFormat = 'dddd, MMMM D, YYYY [at] h:mma z';

function MyTicketDisplay() {
  const { data, loading, error } = useQuery(MyTicketDisplayQuery);

  usePageTitle(useValueUnless(() => `My ${data.convention.ticket_name} receipt`, error || loading));

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  if (!(data.myProfile && data.myProfile.ticket)) {
    return <Redirect to="/new" />;
  }

  const { convention, myProfile } = data;
  const { ticket } = myProfile;

  return (
    <>
      <h1 className="mb-4">
        My
        {' '}
        {convention.ticket_name}
        {' receipt for '}
        {convention.name}
      </h1>

      <div className="card">
        <div className="card-header">
          <div className="d-flex">
            <div className="lead flex-grow-1">{myProfile.name_without_nickname}</div>
            <div className="lead font-weight-bold">
              {ticket.payment_amount && ticket.payment_amount.fractional > 0 ? 'Paid' : 'Comp'}
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
            <dd className="col-md-9">{formatMoney(ticket.payment_amount) || '0'}</dd>
            {ticket.charge_id && (
              <>
                <dt className="col-md-3">Transaction ID</dt>
                <dd className="col-md-9">{ticket.charge_id}</dd>
              </>
            )}
            <dt className="col-md-3">Created</dt>
            <dd className="col-md-9">
              {moment.tz(ticket.created_at, convention.timezone_name).format(dateFormat)}
            </dd>
            <dt className="col-md-3">Last updated</dt>
            <dd className="col-md-9">
              {moment.tz(ticket.updated_at, convention.timezone_name).format(dateFormat)}
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
}

// .strftime('%B %e, %Y %l:%M %p %Z')

export default MyTicketDisplay;
