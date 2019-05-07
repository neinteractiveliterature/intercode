import React from 'react';
import {
  BrowserRouter, Switch, Route, Link,
} from 'react-router-dom';
import { pluralize } from 'inflected';

import AttendanceByPaymentAmount from './AttendanceByPaymentAmount';
import { ReportsMenuQuery } from './queries.gql';
import useQuerySuspended from '../useQuerySuspended';
import ErrorDisplay from '../ErrorDisplay';
import SignupSpy from './SignupSpy';
import EventProvidedTickets from './EventProvidedTickets';

function ReportsMenu() {
  const { data, error } = useQuerySuspended(ReportsMenuQuery);

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <>
      <header>
        <h1>Reports</h1>
      </header>

      <div className="card mt-4">
        <div className="card-header">Regular reports</div>
        <div className="card-body">
          <ul className="mb-0">
            {data.convention.ticket_mode !== 'disabled' && (
              <>
                <li><Link to="/attendance_by_payment_amount">Attendance by payment amount</Link></li>
                <li>
                  <Link to="/event_provided_tickets">
                    Event-provided
                    {' '}
                    {pluralize(data.convention.ticket_name)}
                  </Link>
                </li>
              </>
            )}
            <li><Link to="/events_by_choice">Events by choice</Link></li>
            <li><Link to="/signup_spy">Signup spy</Link></li>
          </ul>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header">Printable reports</div>
        <div className="card-body">
          <ul className="mb-0">
            <li>
              <a href="/reports/events_by_time" target="_blank" rel="noopener noreferrer">
                Events by time
              </a>
            </li>
            <li>
              <a href="/reports/per_event" target="_blank" rel="noopener noreferrer">
                Per event report
              </a>
            </li>
            <li>
              <a href="/reports/per_room" target="_blank" rel="noopener noreferrer">
                Per room report
              </a>
            </li>
            <li>
              <a href="/reports/per_user" target="_blank" rel="noopener noreferrer">
                Per user report
              </a>
            </li>
            <li>
              <a href="/reports/volunteer_events" target="_blank" rel="noopener noreferrer">
                Volunteer event signups
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

function Reports() {
  return (
    <BrowserRouter basename="/reports">
      <Switch>
        <Route path="/attendance_by_payment_amount" component={AttendanceByPaymentAmount} />
        <Route path="/event_provided_tickets" component={EventProvidedTickets} />
        <Route path="/signup_spy" component={SignupSpy} />
        <Route path="/" component={ReportsMenu} />
      </Switch>
    </BrowserRouter>
  );
}

export default Reports;
