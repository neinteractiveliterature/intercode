import { Switch, Route, Link } from 'react-router-dom';
import { LoadQueryWrapper } from '@neinteractiveliterature/litform';

import AttendanceByPaymentAmount from './AttendanceByPaymentAmount';
import SignupSpy from './SignupSpy';
import EventProvidedTickets from './EventProvidedTickets';
import EventsByChoice from './EventsByChoice';
import usePageTitle from '../usePageTitle';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import { useReportsMenuQuery } from './queries.generated';

const ReportsMenu = LoadQueryWrapper(useReportsMenuQuery, function ReportsMenu({ data }) {
  usePageTitle('Reports');

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
                <li>
                  <Link to="/reports/attendance_by_payment_amount">Attendance by payment amount</Link>
                </li>
                <li>
                  <Link to="/reports/event_provided_tickets">Event-provided {data.convention.ticketNamePlural}</Link>
                </li>
              </>
            )}
            <li>
              <Link to="/reports/events_by_choice">Events by choice</Link>
            </li>
            <li>
              <Link to="/reports/signup_spy">Signup spy</Link>
            </li>
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
});

function Reports(): JSX.Element {
  const authorizationWarning = useAuthorizationRequired('can_read_reports');
  if (authorizationWarning) return authorizationWarning;

  return (
    <Switch>
      <Route path="/reports/attendance_by_payment_amount">
        <AttendanceByPaymentAmount />
      </Route>
      <Route path="/reports/event_provided_tickets">
        <EventProvidedTickets />
      </Route>
      <Route path="/reports/events_by_choice">
        <EventsByChoice />
      </Route>
      <Route path="/reports/signup_spy">
        <SignupSpy />
      </Route>
      <Route path="/reports">
        <ReportsMenu />
      </Route>
    </Switch>
  );
}

export default Reports;
