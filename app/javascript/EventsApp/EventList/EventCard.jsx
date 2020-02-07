import React, { useMemo, useContext } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import flatMap from 'lodash-es/flatMap';
import { capitalize } from 'inflected';
import { Link } from 'react-router-dom';

import getSortedRuns from './getSortedRuns';
import pluralizeWithCount from '../../pluralizeWithCount';
import buildEventUrl from '../buildEventUrl';
import teamMembersForDisplay from '../teamMembersForDisplay';
import AppRootContext from '../../AppRootContext';
import RateEventControl from '../../EventRatings/RateEventControl';
import useRateEvent from '../../EventRatings/useRateEvent';
import Gravatar from '../../Gravatar';

function arrayToSentenceReact(array) {
  if (array.length < 2) {
    return array;
  }

  const head = array.slice(0, -1);
  const tail = array[array.length - 1];

  return [...flatMap(head, (item) => [item, ', ']), ' and ', tail];
}

function renderFirstRunTime(event, timezoneName) {
  if (event.runs.length > 0) {
    const sortedRuns = getSortedRuns(event);
    if (sortedRuns.length > 4) {
      const firstRunStart = moment.tz(sortedRuns[0].starts_at, timezoneName);
      return `${sortedRuns.length} runs starting ${firstRunStart.format('dddd h:mma')}`;
    }

    let previousDayName = null;

    return arrayToSentenceReact([
      ...sortedRuns.map((run) => {
        const runStart = moment.tz(run.starts_at, timezoneName);
        const dayName = runStart.format('dddd');
        if (previousDayName === dayName) {
          return runStart.format('h:mma');
        }

        previousDayName = dayName;
        return (
          <React.Fragment key={runStart.toISOString()}>
            <span className="d-lg-none text-nowrap">
              {runStart.format('ddd h:mma')}
            </span>
            <span className="d-none d-lg-inline text-nowrap">
              {runStart.format('dddd h:mma')}
            </span>
          </React.Fragment>
        );
      }),
    ]);
  }

  return 'Unscheduled';
}

function teamIsAllAuthors(author, teamMembers) {
  if (!author || !teamMembers) {
    return false;
  }

  const teamMemberNames = teamMembers
    .map((teamMember) => teamMember.user_con_profile.name_without_nickname);

  if (!teamMemberNames.every((teamMemberName) => author.includes(teamMemberName))) {
    return false;
  }

  if (author.length > teamMemberNames.join(' and ').length) {
    return false;
  }

  return true;
}

const EventCard = ({
  event, timezoneName, sorted, canReadSchedule,
}) => {
  const { myProfile } = useContext(AppRootContext);
  const formResponse = JSON.parse(event.form_response_attrs_json);
  const metadataItems = [];
  const rateEvent = useRateEvent();

  const displayTeamMembers = useMemo(
    () => teamMembersForDisplay(event),
    [event],
  );
  const teamMemberNames = displayTeamMembers
    .map((teamMember) => (
      <>
        { teamMember.user_con_profile.gravatar_enabled && (
          <>
            <Gravatar
              url={teamMember.user_con_profile.gravatar_url}
              enabled={teamMember.user_con_profile.gravatar_enabled}
              pixelSize={16}
              imgClassName="align-baseline"
            />
            {' '}
          </>
        )}
        {teamMember.user_con_profile.name_without_nickname}
      </>
    ));
  const teamMemberList = teamMemberNames.length > 1
    ? teamMemberNames.reduce((prev, curr) => [prev, ', ', curr])
    : teamMemberNames;

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
          <strong>
            {teamMemberDescription}
            {':'}
          </strong>
          {' '}
          {teamMemberList}
        </>
      ),
    });
  }

  if (formResponse.author && !teamIsAllAuthors(formResponse.author, event.team_members)) {
    const authorDescription = pluralizeWithCount('Author', formResponse.author.split(/(,|;| and )/).length, true);
    metadataItems.push({
      key: 'author',
      content: (
        <>
          <strong>
            {authorDescription}
            {':'}
          </strong>
          {' '}
          {formResponse.author}
        </>
      ),
    });
  }

  if (formResponse.organization) {
    metadataItems.push({
      key: 'organization',
      content: (
        <>
          <strong>Organization:</strong>
          {' '}
          {formResponse.organization}
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
            </h4>
            {' '}
            <span className="lead text-muted">
              {event.event_category.name}
            </span>
            <div className="d-flex flex-wrap mt-1">
              {metadataItems.map((metadataItem) => (
                <div className="flex-shrink-1 mr-4" key={metadataItem.key}>
                  {metadataItem.content}
                </div>
              ))}
            </div>
          </div>
        </div>

        {
          sorted.some((sort) => sort.id === 'created_at')
            ? (
              <p className="m-0">
                <strong>
                  Added
                  {' '}
                  {moment.tz(event.created_at, timezoneName).format('dddd, MMMM D, YYYY [at] h:mma')}
                </strong>
              </p>
            )
            : null
        }
      </div>

      <div
        className="card-body"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: event.short_blurb_html }}
      />
    </div>
  );
};

EventCard.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
    event_category: PropTypes.shape({
      name: PropTypes.string.isRequired,
      team_member_name: PropTypes.string.isRequired,
    }).isRequired,
    title: PropTypes.string,
    my_rating: PropTypes.number,
    form_response_attrs_json: PropTypes.string.isRequired,
    short_blurb_html: PropTypes.string.isRequired,
    team_members: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
  timezoneName: PropTypes.string.isRequired,
  sorted: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    desc: PropTypes.bool.isRequired,
  })),
  canReadSchedule: PropTypes.bool,
};

EventCard.defaultProps = {
  sorted: null,
  canReadSchedule: false,
};

export default EventCard;
