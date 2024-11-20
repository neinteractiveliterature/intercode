import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { timespanFromRun } from '../../TimespanUtils';
import AppRootContext from '../../AppRootContext';
import { RunHeaderRunInfoQueryDocument } from './queries.generated';
import { useFormatRunTimespan } from '../runTimeFormatting';
import { Outlet } from 'react-router';
import NamedRouteBreadcrumbItem from '../../Breadcrumbs/NamedRouteBreadcrumbItem';
import { Route } from './+types/RunHeader';

export const loader = async ({ context, params: { eventId, runId } }: Route.LoaderArgs) => {
  const client = context!.client;
  const { data } = await client.query({
    query: RunHeaderRunInfoQueryDocument,
    variables: { eventId: eventId ?? '', runId: runId ?? '' },
  });
  return data;
};

function RunHeader({ loaderData: data }: Route.ComponentProps): JSX.Element {
  const { t } = useTranslation();
  const { timezoneName } = useContext(AppRootContext);
  const formatRunTimespan = useFormatRunTimespan();

  const event = data.convention.event;

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <NamedRouteBreadcrumbItem routeId={['Event', 'EventPage']}>
            {data.convention.event.title}
          </NamedRouteBreadcrumbItem>

          <NamedRouteBreadcrumbItem routeId="RunSignupSummary">
            {t('events.signupSummary.title')}
          </NamedRouteBreadcrumbItem>

          <NamedRouteBreadcrumbItem
            routeId={['SignupAdmin', 'RunSignupsTable', 'RunSignupChangesTable', 'RunEmailList']}
          >
            {t('events.signupAdmin.title')}
          </NamedRouteBreadcrumbItem>
          <NamedRouteBreadcrumbItem routeId="EditSignup">{t('events.signupAdmin.editTitle')}</NamedRouteBreadcrumbItem>
        </ol>
      </nav>

      <header>
        <h1 className="mb-0">
          {event.title}
          {event.run.title_suffix && event.run.title_suffix.trim() !== '' ? `- ${event.run.title_suffix}` : ''}
        </h1>
        <h3 className="mt-0">
          {formatRunTimespan(timespanFromRun(timezoneName, event, event.run), {
            formatType: 'short',
          })}
        </h3>
        <ul className="list-inline">
          {event.registration_policy?.slots_limited && (
            <li className="list-inline-item">
              {t('events.runHeader.maxSignups', {
                count: event.registration_policy.total_slots ?? undefined,
              })}
            </li>
          )}

          {(event.registration_policy?.buckets.length ?? 0) > 1 ? (
            <li className="list-inline-item">
              ({event.registration_policy?.buckets.map((bucket) => `${bucket.name}: ${bucket.total_slots}`).join(', ')})
            </li>
          ) : null}
        </ul>
      </header>

      <Outlet />
    </>
  );
}

export default RunHeader;
