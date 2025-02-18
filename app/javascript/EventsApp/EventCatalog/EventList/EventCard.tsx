import { Fragment, useMemo, useContext, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { SortingState } from '@tanstack/react-table';
import { DateTime } from 'luxon';
import { notEmpty } from '@neinteractiveliterature/litform';

import getSortedRuns from './getSortedRuns';
import buildEventUrl from '../../buildEventUrl';
import teamMembersForDisplay from '../../teamMembersForDisplay';
import AppRootContext from '../../../AppRootContext';
import RateEventControl from '../../../EventRatings/RateEventControl';
import useRateEvent from '../../../EventRatings/useRateEvent';
import Gravatar from '../../../Gravatar';
import { arrayToSentenceReact, joinReact } from '../../../RenderingUtils';
import { EventListEventsQueryData } from './queries.generated';
import { useAppDateTimeFormat } from '../../../TimeUtils';
import { useFormatRunTime } from '../../runTimeFormatting';
import { useTranslation } from 'react-i18next';
import upperFirst from 'lodash/upperFirst';
import { FormItemExposeIn } from '../../../graphqlTypes.generated';
import FormItemDisplay from '../../../FormPresenter/ItemDisplays/FormItemDisplay';
import { parseTypedFormItemArray } from '../../../FormAdmin/FormItemUtils';
import { CommonConventionDataFragment } from '../../queries.generated';
import styles from 'styles/event_list.module.scss';

type ConventionType = NonNullable<EventListEventsQueryData['convention']>;
type EventType = ConventionType['events_paginated']['entries'][0] & {
  event_category: CommonConventionDataFragment['event_categories'][number];
};

function renderFirstRunTime(
  event: EventType,
  timezoneName: string,
  formatRunTime: ReturnType<typeof useFormatRunTime>,
) {
  if (event.runs.length > 0) {
    const sortedRuns = getSortedRuns(event);
    if (sortedRuns.length > 4) {
      const firstRunStart = DateTime.fromISO(sortedRuns[0].starts_at, { zone: timezoneName });
      return `${sortedRuns.length} runs starting ${formatRunTime(firstRunStart, {
        formatType: 'long',
        includeDate: true,
      })}`;
    }

    let previousWeekday: number;

    return arrayToSentenceReact([
      ...sortedRuns.map((run) => {
        const runStart = DateTime.fromISO(run.starts_at, { zone: timezoneName });
        const { weekday } = runStart;
        if (previousWeekday === weekday) {
          return formatRunTime(runStart, { formatType: 'short', includeDate: false });
        }

        previousWeekday = weekday;
        return (
          <Fragment key={runStart.toISO()}>
            <span className="d-lg-none text-nowrap">
              {formatRunTime(runStart, { formatType: 'short', includeDate: true })}
            </span>
            <span className="d-none d-lg-inline text-nowrap">
              {formatRunTime(runStart, { formatType: 'long', includeDate: true })}
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
  convention: ConventionType;
  event: EventType;
  sortBy?: SortingState;
  canReadSchedule?: boolean;
};

function EventCard({ convention, event, sortBy, canReadSchedule }: EventCardProps): JSX.Element {
  const { timezoneName } = useContext(AppRootContext);
  const format = useAppDateTimeFormat();
  const formatRunTime = useFormatRunTime();
  const { myProfile } = useContext(AppRootContext);
  const formResponse = useMemo(
    () =>
      event.form_response_attrs_json_with_rendered_markdown
        ? JSON.parse(event.form_response_attrs_json_with_rendered_markdown)
        : {},
    [event.form_response_attrs_json_with_rendered_markdown],
  );
  const metadataItems: { key: string; content: ReactNode }[] = [];
  const rateEvent = useRateEvent();
  const { t } = useTranslation();
  const exposedFormItems = useMemo(
    () =>
      event.event_category.event_form.form_sections.flatMap((section) =>
        parseTypedFormItemArray(
          section.form_items.filter((item) => item.expose_in?.includes(FormItemExposeIn.EventCatalog)),
        ),
      ),
    [event.event_category.event_form],
  );

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
    const teamMemberDescription =
      displayTeamMembers.length === 1
        ? upperFirst(event.event_category.team_member_name)
        : upperFirst(event.event_category.teamMemberNamePlural);

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
    const authorDescription: string = t('events.catalog.author', {
      count: formResponse.author.split(/(,|;| and )/).length,
    });
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
          <strong>
            <>{t('events.catalog.organization')}:</>
          </strong>{' '}
          {formResponse.organization}
        </>
      ),
    });
  }

  exposedFormItems.forEach((item) => {
    const value = formResponse[item.identifier ?? ''];
    if (value) {
      metadataItems.push({
        key: `item${item.id}`,
        content: (
          <>
            <strong>{item.public_description}:</strong>{' '}
            <FormItemDisplay convention={convention} displayMode="public" formItem={item} value={value} />
          </>
        ),
      });
    }
  });

  return (
    <>
      <div className="card mb-4" key={event.id}>
        <div className="card-header">
          {/* Currently we don't have any special styles for this; if we do add some, add styles.eventCardHeader here */}
          <div className="event-card-header">
            <div className="float-end text-end ms-1">
              <div className="lead">
                {canReadSchedule ? renderFirstRunTime(event, timezoneName, formatRunTime) : null}
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
              <h4 className={`m-0 d-inline event-card-event-title ${styles.eventCardEventTitle}`}>
                <Link to={buildEventUrl(event)}>{event.title}</Link>
              </h4>{' '}
              <span className="lead text-muted">{event.event_category.name}</span>
              <div className="d-flex flex-wrap mt-1">
                {metadataItems.map((metadataItem) => (
                  <div className="flex-shrink-1 me-4" key={metadataItem.key}>
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
                    {format(DateTime.fromISO(event.created_at, { zone: timezoneName }), 'longWeekdayDateTimeWithZone')}
                  </strong>
                </p>
              )
            : null}
        </div>

        <div className="card-body" dangerouslySetInnerHTML={{ __html: event.short_blurb_html ?? '' }} />
      </div>
    </>
  );
}

export default EventCard;
