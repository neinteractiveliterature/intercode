import { useMemo } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import snakeCase from 'lodash/snakeCase';

import { findBucket, formatSignupState } from './SignupUtils';
import usePageTitle from '../../usePageTitle';
import Gravatar from '../../Gravatar';
import { RunSignupSummaryQueryData, RunSignupSummaryQueryDocument } from './queries.generated';
import humanize from '../../humanize';
import * as Route from './+types.RunSignupSummary';

type EventType = RunSignupSummaryQueryData['convention']['event'];
type SignupType = EventType['run']['signups_paginated']['entries'][0];

function isTeamMember(signup: SignupType, teamMembers: EventType['team_members']) {
  return teamMembers.some((teamMember) => teamMember.user_con_profile.id === signup.user_con_profile.id);
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

    return a.user_con_profile.name_inverted.localeCompare(b.user_con_profile.name_inverted, undefined, {
      sensitivity: 'base',
    });
  });
}

export type RunSignupSummaryProps = {
  eventId: string;
  runId: string;
  eventPath: string;
};

export const loader = async ({ params: { eventId, runId }, context }: Route.LoaderArgs) => {
  const client = context!.client;
  const { data } = await client.query({
    query: RunSignupSummaryQueryDocument,
    variables: { eventId: eventId ?? '', runId: runId ?? '' },
  });
  return data;
};

function RunSignupSummary({ loaderData: data }: Route.ComponentProps): JSX.Element {
  const { t } = useTranslation();

  const signupSummaryTitle = t('events.signupSummary.title');

  usePageTitle(`${signupSummaryTitle} - ${data.convention.event.title}`);

  const sortedSignups = useMemo(
    () =>
      sortSignups(data.convention.event.run.signups_paginated.entries ?? [], data.convention.event.team_members ?? []),
    [data],
  );

  const renderSignupRow = (
    signup: SignupType,
    registrationPolicy: EventType['registration_policy'],
    teamMembers: EventType['team_members'],
    teamMemberName: string,
  ) => {
    const bucket = findBucket(signup.bucket_key, registrationPolicy ?? { buckets: [] });
    const suffix = signup.bucket_key && bucket && bucket.expose_attendees ? ` (${bucket.name})` : null;
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
                  {humanize(snakeCase(teamMemberName))})
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

  const { convention } = data;
  const event = convention.event;

  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th>{t('events.signupSummary.nameHeader')}</th>
            <th>{t('events.signupSummary.stateHeader')}</th>
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
