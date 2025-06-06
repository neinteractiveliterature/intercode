import { Link, LoaderFunction, useLoaderData } from 'react-router';

import usePageTitle from '../usePageTitle';
import { ReportsMenuQueryData, ReportsMenuQueryDocument } from './queries.generated';
import { client } from '../useIntercodeApolloClient';
import { useTranslation } from 'react-i18next';

export const loader: LoaderFunction = async () => {
  const { data } = await client.query<ReportsMenuQueryData>({ query: ReportsMenuQueryDocument });
  return data;
};

function ReportsMenu() {
  const { t } = useTranslation();
  const data = useLoaderData() as ReportsMenuQueryData;
  usePageTitle(t('navigation.admin.reports'));

  return (
    <>
      <header>
        <h1>{t('navigation.admin.reports')}</h1>
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
}

export const Component = ReportsMenu;
