import { Fragment, useMemo, useContext, ReactNode } from 'react';
// @ts-ignore
import { capitalize } from 'inflected';
import { Link } from 'react-router-dom';
import { SortingRule } from 'react-table';
import { DateTime } from 'luxon';

import getSortedRuns from './getSortedRuns';
import pluralizeWithCount from '../../pluralizeWithCount';
import buildEventUrl from '../buildEventUrl';
import teamMembersForDisplay from '../teamMembersForDisplay';
import AppRootContext from '../../AppRootContext';
import RateEventControl from '../../EventRatings/RateEventControl';
import useRateEvent from '../../EventRatings/useRateEvent';
import Gravatar from '../../Gravatar';
import { arrayToSentenceReact, joinReact } from '../../RenderingUtils';
import { EventListEventsQueryQuery } from './queries.generated';
import { notEmpty } from '../../ValueUtils';
import { formatLCM } from '../../TimeUtils';

type ConventionType = NonNullable<EventListEventsQueryQuery['convention']>;
type EventType = ConventionType['events_paginated']['entries'][0];

function renderFirstRunTime(event: EventType, timezoneName: string) {
  if (event.runs.length > 0) {
    const sortedRuns = getSortedRuns(event);
    if (sortedRuns.length > 4) {
      const firstRunStart = DateTime.fromISO(sortedRuns[0].starts_at, { zone: timezoneName });
      return `${sortedRuns.length} runs starting ${formatLCM(firstRunStart, 'cccc h:mmaaa')}`;
    }

    let previousDayName: string;

    return arrayToSentenceReact([
      ...sortedRuns.map((run) => {
        const runStart = DateTime.fromISO(run.starts_at, { zone: timezoneName });
        const dayName = runStart.toFormat('cccc');
        if (previousDayName === dayName) {
          return formatLCM(runStart, 'h:mmaaa');
        }

        previousDayName = dayName;
        return (
          <Fragment key={runStart.toISO()}>
            <span className="d-lg-none text-nowrap">{formatLCM(runStart, 'ccc h:mmaaa')}</span>
            <span className="d-none d-lg-inline text-nowrap">
              {formatLCM(runStart, 'cccc h:mmaaa')}
            </span>
          </Fragment>
        );
      }),
    ]);
  }

  return 'Unscheduled';
}

function teamIsAllAuthors(author?: string, teamMembers?: EventType['team_members']) {
  if (!author || !teamMembers) {
    return false;
  }

  const teamMemberNames = teamMembers
    .map((teamMember) => teamMember.user_con_profile.name_without_nickname)
    .filter(notEmpty);

  if (!teamMemberNames.every((teamMemberName) => author.includes(teamMemberName))) {
    return false;
  }

  if (author.length > teamMemberNames.join(' and ').length) {
    return false;
  }

  return true;
}

export type EventCardProps = {
  event: EventType;
  sortBy?: SortingRule<
    NonNullable<EventListEventsQueryQuery['convention']>['events_paginated']['entries'][number]
  >[];
  canReadSchedule?: boolean;
};

const EventCard = ({ event, sortBy, canReadSchedule }: EventCardProps) => {
  const { timezoneName } = useContext(AppRootContext);
  const { myProfile } = useContext(AppRootContext);
  const formResponse = JSON.parse(event.form_response_attrs_json);
  const metadataItems: { key: string; content: ReactNode }[] = [];
  const rateEvent = useRateEvent();

  const displayTeamMembers = useMemo(() => teamMembersForDisplay(event), [event]);
  const teamMemberNames = displayTeamMembers.map((teamMember) => (
    <Fragment key={teamMember.id}>
      {teamMember.user_con_profile.gravatar_enabled && (
        <>
          <Gravatar
            url={teamMember.user_con_profile.gravatar_url}
            enabled={teamMember.user_con_profile.gravatar_enabled}
            pixelSize={16}
            imgClassName="align-baseline"
          />{' '}
        </>
      )}
      {teamMember.user_con_profile.name_without_nickname}
    </Fragment>
  ));
  const teamMemberList = joinReact(teamMemberNames, ', ');

  if (teamMemberList.length > 0) {
    const teamMemberDescription = pluralizeWithCount(
      capitalize(event.event_category.team_member_name),
      displayTeamMembers.length,
      true,
    );

    metadataItems.push({
      key: 'team_members',
      content: (
        <>
          <strong>{teamMemberDescription}:</strong> {teamMemberList}
        </>
      ),
    });
  }

  if (formResponse.author && !teamIsAllAuthors(formResponse.author, event.team_members)) {
    const authorDescription = pluralizeWithCount(
      'Author',
      formResponse.author.split(/(,|;| and )/).length,
      true,
    );
    metadataItems.push({
      key: 'author',
      content: (
        <>
          <strong>{authorDescription}:</strong> {formResponse.author}
        </>
      ),
    });
  }

  if (formResponse.organization) {
    metadataItems.push({
      key: 'organization',
      content: (
        <>
          <strong>Organization:</strong> {formResponse.organization}
        </>
      ),
    });
  }

  return (
    <div className="card mb-4" key={event.id}>
      <div className="card-header">
        <div className="event-card-header">
          <div className="float-right text-right ml-1">
            <div className="lead">
              {canReadSchedule ? renderFirstRunTime(event, timezoneName) : null}
            </div>
            <div className="mt-1 d-flex align-items-end justify-content-end">
              {myProfile && (
                <RateEventControl
                  value={event.my_rating}
                  onChange={(rating) => rateEvent(event.id, rating)}
                  size={1.2}
                />
              )}
            </div>
          </div>

          <div>
            <h4 className="m-0 d-inline event-card-event-title">
              <Link to={buildEventUrl(event)}>{event.title}</Link>
            </h4>{' '}
            <span className="lead text-muted">{event.event_category.name}</span>
            <div className="d-flex flex-wrap mt-1">
              {metadataItems.map((metadataItem) => (
                <div className="flex-shrink-1 mr-4" key={metadataItem.key}>
                  {metadataItem.content}
                </div>
              ))}
            </div>
          </div>
        </div>

        {sortBy?.some((sort) => sort.id === 'created_at')
          ? event.created_at && (
              <p className="m-0">
                <strong>
                  Added{' '}
                  {formatLCM(
                    DateTime.fromISO(event.created_at, { zone: timezoneName }),
                    "cccc, MMMM d, yyyy 'at' h:mmaaa",
                  )}
                </strong>
              </p>
            )
          : null}
      </div>

      <div
        className="card-body"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: event.short_blurb_html ?? '' }}
      />
    </div>
  );
};

export default EventCard;
