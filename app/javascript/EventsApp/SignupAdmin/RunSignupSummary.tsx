import { useMemo } from 'react';
import { humanize, underscore } from 'inflected';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { ErrorDisplay, PageLoadingIndicator } from '@neinteractiveliterature/litform';

import BreadcrumbItem from '../../Breadcrumbs/BreadcrumbItem';
import EventBreadcrumbItems from '../EventPage/EventBreadcrumbItems';
import { findBucket, formatSignupState } from './SignupUtils';
import RunHeader from './RunHeader';
import usePageTitle from '../../usePageTitle';
import useValueUnless from '../../useValueUnless';
import Gravatar from '../../Gravatar';
import { RunSignupSummaryQueryData, useRunSignupSummaryQuery } from './queries.generated';

type EventType = RunSignupSummaryQueryData['event'];
type SignupType = EventType['run']['signups_paginated']['entries'][0];

function isTeamMember(signup: SignupType, teamMembers: EventType['team_members']) {
  return teamMembers.some(
    (teamMember) => teamMember.user_con_profile.id === signup.user_con_profile.id,
  );
}

function sortSignups(signups: SignupType[], teamMembers: EventType['team_members']) {
  return [...signups].sort((a, b) => {
    if (a.state === 'waitlisted' && b.state !== 'waitlisted') {
      return 1;
    }

    if (b.state === 'waitlisted' && a.state !== 'waitlisted') {
      return -1;
    }

    if (isTeamMember(a, teamMembers) && !isTeamMember(b, teamMembers)) {
      return -1;
    }

    if (isTeamMember(b, teamMembers) && !isTeamMember(a, teamMembers)) {
      return 1;
    }

    if (a.state === 'waitlisted') {
      return (a.waitlist_position ?? 0) - (b.waitlist_position ?? 0);
    }

    return a.user_con_profile.name_inverted.localeCompare(
      b.user_con_profile.name_inverted,
      undefined,
      { sensitivity: 'base' },
    );
  });
}

export type RunSignupSummaryProps = {
  eventId: number;
  runId: number;
  eventPath: string;
};

function RunSignupSummary({ eventId, runId, eventPath }: RunSignupSummaryProps) {
  const { t } = useTranslation();
  const { data, loading, error } = useRunSignupSummaryQuery({
    variables: { eventId, runId },
  });

  const signupSummaryTitle = t('events.signupSummary.title', 'Signup summary');

  usePageTitle(
    useValueUnless(() => `${signupSummaryTitle} - ${data?.event.title}`, error || loading),
  );

  const sortedSignups = useMemo(
    () =>
      error || loading
        ? []
        : sortSignups(
            data?.event.run.signups_paginated.entries ?? [],
            data?.event.team_members ?? [],
          ),
    [data, error, loading],
  );

  const renderSignupRow = (
    signup: SignupType,
    registrationPolicy: EventType['registration_policy'],
    teamMembers: EventType['team_members'],
    teamMemberName: string,
  ) => {
    const bucket = findBucket(signup.bucket_key, registrationPolicy ?? { buckets: [] });
    const suffix =
      signup.bucket_key && bucket && bucket.expose_attendees ? ` (${bucket.name})` : null;
    const waitlistPosition = signup.state === 'waitlisted' ? ` #${signup.waitlist_position}` : null;

    return (
      <tr
        key={signup.id}
        className={classNames({
          'table-warning': signup.state === 'waitlisted',
          'table-secondary': isTeamMember(signup, teamMembers),
        })}
      >
        <td>
          <div className="d-flex align-items-center">
            <div className="me-2">
              <Gravatar
                url={signup.user_con_profile.gravatar_url}
                enabled={signup.user_con_profile.gravatar_enabled}
                pixelSize={32}
              />
            </div>
            <div>
              {signup.user_con_profile.name_inverted}
              {isTeamMember(signup, teamMembers) ? (
                <strong>
                  {' ('}
                  {humanize(underscore(teamMemberName))})
                </strong>
              ) : null}
            </div>
          </div>
        </td>
        <td>
          {formatSignupState(signup.state, t)}
          {waitlistPosition}
          {suffix}
        </td>
      </tr>
    );
  };

  if (loading) {
    return <PageLoadingIndicator visible iconSet="bootstrap-icons" />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const { event, convention, currentAbility } = data!;

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <EventBreadcrumbItems
            event={event}
            convention={convention!}
            currentAbility={currentAbility}
            eventPath={eventPath}
          />
          <BreadcrumbItem active to={`${eventPath}/runs/${runId}/signup_summary`}>
            {signupSummaryTitle}
          </BreadcrumbItem>
        </ol>
      </nav>

      <RunHeader eventId={eventId} runId={runId} />

      <table className="table">
        <thead>
          <tr>
            <th>{t('events.signupSummary.nameHeader', 'Name')}</th>
            <th>{t('events.signupSummary.stateHeader', 'State')}</th>
          </tr>
        </thead>
        <tbody>
          {sortedSignups.map((signup) =>
            renderSignupRow(
              signup,
              event.registration_policy,
              event.team_members,
              event.event_category.team_member_name,
            ),
          )}
        </tbody>
      </table>
    </>
  );
}

export default RunSignupSummary;
