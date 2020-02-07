import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { humanize, underscore } from 'inflected';
import classNames from 'classnames';

import BreadcrumbItem from '../../Breadcrumbs/BreadcrumbItem';
import EventBreadcrumbItems from '../EventPage/EventBreadcrumbItems';
import { findBucket } from './SignupUtils';
import RunHeader from './RunHeader';
import { RunSignupSummaryQuery } from './queries.gql';
import usePageTitle from '../../usePageTitle';
import useValueUnless from '../../useValueUnless';
import useQuerySuspended from '../../useQuerySuspended';
import ErrorDisplay from '../../ErrorDisplay';
import Gravatar from '../../Gravatar';

function isTeamMember(signup, teamMembers) {
  return teamMembers
    .some((teamMember) => teamMember.user_con_profile.id === signup.user_con_profile.id);
}

function sortSignups(signups, teamMembers) {
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
      return a.waitlist_position - b.waitlist_position;
    }

    return a.user_con_profile.name_inverted.localeCompare(b.user_con_profile.name_inverted, { sensitivity: 'base' });
  });
}

function RunSignupSummary({ eventId, runId, eventPath }) {
  const { data, error } = useQuerySuspended(RunSignupSummaryQuery, {
    variables: { eventId, runId },
  });

  usePageTitle(useValueUnless(() => `Signup summary - ${data.event.title}`, error));

  const sortedSignups = useMemo(
    () => (error
      ? null
      : sortSignups(data.event.run.signups_paginated.entries, data.event.team_members)),
    [data, error],
  );

  const renderSignupRow = (signup, registrationPolicy, teamMembers, teamMemberName) => {
    const bucket = findBucket(signup.bucket_key, registrationPolicy);
    const suffix = (
      signup.bucket_key && bucket && bucket.expose_attendees
        ? ` (${bucket.name})`
        : null
    );
    const waitlistPosition = (
      signup.state === 'waitlisted'
        ? ` #${signup.waitlist_position}`
        : null
    );

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
            <div className="mr-2">
              <Gravatar
                url={signup.user_con_profile.gravatar_url}
                enabled={signup.user_con_profile.gravatar_enabled}
                pixelSize={32}
              />
            </div>
            <div>
              {signup.user_con_profile.name_inverted}
              {
                isTeamMember(signup, teamMembers)
                  ? (
                    <strong>
                      {' ('}
                      {humanize(underscore(teamMemberName))}
                      {')'}
                    </strong>
                  )
                  : null
              }
            </div>
          </div>
        </td>
        <td>
          {humanize(signup.state)}
          {waitlistPosition}
          {suffix}
        </td>
      </tr>
    );
  };

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <EventBreadcrumbItems
            event={data.event}
            convention={data.convention}
            currentAbility={data.currentAbility}
            eventPath={eventPath}
          />
          <BreadcrumbItem active>
            Signup summary
          </BreadcrumbItem>
        </ol>
      </nav>

      <RunHeader eventId={eventId} runId={runId} />

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>State</th>
          </tr>
        </thead>
        <tbody>
          {sortedSignups.map((signup) => renderSignupRow(
            signup,
            data.event.registration_policy,
            data.event.team_members,
            data.event.event_category.team_member_name,
          ))}
        </tbody>
      </table>
    </>
  );
}

RunSignupSummary.propTypes = {
  eventId: PropTypes.number.isRequired,
  runId: PropTypes.number.isRequired,
  eventPath: PropTypes.string.isRequired,
};

export default RunSignupSummary;
