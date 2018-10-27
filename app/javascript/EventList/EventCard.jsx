import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import arrayToSentence from 'array-to-sentence';

import EventCategory from '../EventAdmin/EventCategory';
import getSortedRuns from './getSortedRuns';

function renderFirstRunTime(event, timezoneName) {
  if (event.runs.length > 0) {
    const firstRunsSorted = getSortedRuns(event).slice(0, 4);

    return arrayToSentence([
      ...firstRunsSorted.map(run => (
        moment.tz(run.starts_at, timezoneName).format('dddd h:mma')
      )),
      ...(
        event.runs.length > firstRunsSorted.length
          ? [`${event.runs.length - firstRunsSorted.length} more`]
          : []
      ),
    ]);
  }

  return 'Unscheduled';
}

const EventCard = ({ event, timezoneName, sorted }) => {
  const formResponse = JSON.parse(event.form_response_attrs_json);
  const authorOrOrg = formResponse.author || formResponse.organization;

  return (
    <div className="card my-4" key={event.id}>
      <div className="card-header">
        <h4 className="m-0">
          <a href={`/events/${event.id}`}>{event.title}</a>
          {
            event.category !== 'filler'
              ? (
                <small className="text-muted">
                  {' '}
                  &mdash;
                  {' '}
                  {EventCategory.get(event.category).name}
                </small>
              )
              : null
          }
        </h4>
        {
          authorOrOrg
            ? (
              <p className="m-0">
                <em>
                  by
                  {' '}
                  {authorOrOrg}
                </em>
              </p>
            )
            : null
        }
        <p className="m-0">
          {
            sorted.some(sort => sort.id === 'created_at')
              ? (
                <strong>
                  Added
                  {' '}
                  {moment.tz(event.created_at, timezoneName).format('dddd, MMMM D, YYYY [at] h:mma')}
                </strong>
              )
              : null
          }
          {
            sorted.some(sort => sort.id === 'first_scheduled_run_start')
              ? (
                <strong>
                  {renderFirstRunTime(event, timezoneName)}
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
    category: PropTypes.string.isRequired,
    title: PropTypes.string,
    form_response_attrs_json: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
  timezoneName: PropTypes.string.isRequired,
  sorted: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    desc: PropTypes.bool.isRequired,
  })),
};

EventCard.defaultProps = {
  sorted: null,
};

export default EventCard;
