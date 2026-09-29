import { Link, LoaderFunction, useLoaderData, RouterContextProvider } from 'react-router';

import PrintableReportLink from './PrintableReportLink';
import usePageTitle from '../usePageTitle';
import { ReportsMenuQueryData, ReportsMenuQueryDocument } from './queries.generated';
import { apolloClientContext } from 'AppContexts';
import { useTranslation } from 'react-i18next';

export const loader: LoaderFunction<RouterContextProvider> = async ({ context }) => {
  const client = context.get(apolloClientContext);
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
        <div className="card-header">{t('admin.reports.menu.regularReportsHeader')}</div>
        <div className="card-body">
          <ul className="mb-0">
            {data.convention.ticket_mode !== 'disabled' && (
              <li>
                <Link to="/reports/attendance_by_payment_amount">
                  {t('admin.reports.menu.attendanceByPaymentAmount')}
                </Link>
              </li>
            )}
            <li>
              <Link to="/reports/new_and_returning_attendees">{t('admin.reports.menu.newAndReturningAttendees')}</Link>
            </li>
            {data.convention.ticket_mode !== 'disabled' && (
              <li>
                <Link to="/reports/event_provided_tickets">
                  {t('admin.reports.menu.eventProvidedTickets', {
                    ticketNamePlural: data.convention.ticketNamePlural,
                  })}
                </Link>
              </li>
            )}
            <li>
              <Link to="/reports/events_by_choice">{t('admin.reports.menu.eventsByChoice')}</Link>
            </li>
            <li>
              <Link to="/reports/signup_spy">{t('admin.reports.menu.signupSpy')}</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header">{t('admin.reports.menu.printableReportsHeader')}</div>
        <div className="card-body">
          <ul className="mb-0">
            <li>
              <PrintableReportLink path="/reports/events_by_time">
                {t('admin.reports.menu.eventsByTime')}
              </PrintableReportLink>
            </li>
            <li>
              <PrintableReportLink path="/reports/per_event">
                {t('admin.reports.menu.perEventReport')}
              </PrintableReportLink>
            </li>
            <li>
              <PrintableReportLink path="/reports/per_room">
                {t('admin.reports.menu.perRoomReport')}
              </PrintableReportLink>
            </li>
            <li>
              <PrintableReportLink path="/reports/per_user">
                {t('admin.reports.menu.perUserReport')}
              </PrintableReportLink>
            </li>
            <li>
              <PrintableReportLink path="/reports/volunteer_events">
                {t('admin.reports.menu.volunteerEventSignups')}
              </PrintableReportLink>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export const Component = ReportsMenu;
