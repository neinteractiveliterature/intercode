import React, { useMemo, useContext } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import arrayToSentence from 'array-to-sentence';
import { capitalize } from 'inflected';
import { Link } from 'react-router-dom';

import getSortedRuns from './getSortedRuns';
import pluralizeWithCount from '../../pluralizeWithCount';
import buildEventUrl from '../buildEventUrl';
import teamMembersForDisplay from '../teamMembersForDisplay';
import AppRootContext from '../../AppRootContext';
import RateEventControl from '../../EventRatings/RateEventControl';

function renderFirstRunTime(event, timezoneName) {
  if (event.runs.length > 0) {
    const sortedRuns = getSortedRuns(event);
    if (sortedRuns.length > 4) {
      const firstRunStart = moment.tz(sortedRuns[0].starts_at, timezoneName);
      return `${sortedRuns.length} runs starting ${firstRunStart.format('dddd h:mma')}`;
    }

    let previousDayName = null;

    return arrayToSentence([
      ...sortedRuns.map((run) => {
        const runStart = moment.tz(run.starts_at, timezoneName);
        const dayName = runStart.format('dddd');
        if (previousDayName === dayName) {
          return runStart.format('h:mma');
        }

        previousDayName = dayName;
        return `${dayName} ${runStart.format('h:mma')}`;
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

  const displayTeamMembers = useMemo(
    () => teamMembersForDisplay(event),
    [event],
  );
  const teamMemberNames = displayTeamMembers
    .map((teamMember) => teamMember.user_con_profile.name_without_nickname).join(', ');

  if (teamMemberNames) {
    const teamMemberDescription = pluralizeWithCount(
      capitalize(event.event_category.team_member_name),
      event.team_members.length,
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
          {teamMemberNames}
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
        <div className="d-flex flex-wrap mb-3">
          <div className="d-flex flex-grow-1">
            <h4 className="m-0">
              <Link to={buildEventUrl(event)}>{event.title}</Link>
            </h4>
            <div className="lead ml-2 text-muted">
              {event.event_category.name}
            </div>
          </div>
          <div className="lead">
            {canReadSchedule ? renderFirstRunTime(event, timezoneName) : null}
          </div>
        </div>
        <div className="d-flex align-items-start">
          <ul className="list-inline my-1 flex-grow-1">
            {metadataItems.map((metadataItem) => (
              <li className="list-inline-item mr-4" key={metadataItem.key}>
                {metadataItem.content}
              </li>
            ))}
          </ul>
          {myProfile && (
            <RateEventControl rating={event.my_rating} />
          )}
        </div>
        <p className="m-0">
          {
            sorted.some((sort) => sort.id === 'created_at')
              ? (
                <strong>
                  Added
                  {' '}
                  {moment.tz(event.created_at, timezoneName).format('dddd, MMMM D, YYYY [at] h:mma')}
                </strong>
              )
              : null
          }
        </p>
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
