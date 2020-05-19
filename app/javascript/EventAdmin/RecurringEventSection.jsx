import React, { useState, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';

import ScheduleMultipleRunsModal from './ScheduleMultipleRunsModal';
import { timespanFromConvention, getConventionDayTimespans } from '../TimespanUtils';
import useModal from '../ModalDialogs/useModal';
import buildEventCategoryUrl from './buildEventCategoryUrl';
import DisclosureTriangle from '../BuiltInFormControls/DisclosureTriangle';
import AppRootContext from '../AppRootContext';

function RecurringEventSectionBody({ event, convention, startSchedulingRuns }) {
  const { timezoneName } = useContext(AppRootContext);
  const conventionDays = getConventionDayTimespans(
    timespanFromConvention(convention),
    timezoneName,
  );

  const runLists = conventionDays.map((conventionDay) => {
    const dayRuns = event.runs.filter((run) => (
      conventionDay.includesTime(moment(run.starts_at))
    ));

    dayRuns.sort((a, b) => moment(a.starts_at).diff(moment(b.starts_at)));

    const runItems = dayRuns.map((run) => {
      const runStart = moment(run.starts_at).tz(timezoneName);
      let format = 'h:mma';
      if (runStart.day() !== conventionDay.start.day()) {
        format = 'ddd h:mma';
      }
      const eventCategory = convention.event_categories.find((c) => c.id === event.event_category.id);

      return (
        <li key={run.id} className="my-2">
          <Link className="btn btn-secondary" to={`${buildEventCategoryUrl(eventCategory)}/${event.id}/runs/${run.id}/edit`}>
            {runStart.format(format)}
          </Link>
        </li>
      );
    });

    return (
      <div className="col" key={conventionDay.start.toISOString()}>
        <div className="card">
          <div className="card-header">{conventionDay.start.format('dddd, MMMM DD')}</div>
          <div className="card-body py-3">
            <ul className="list-unstyled m-0">
              {runItems}
            </ul>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div>
      <div className="card bg-light my-4">
        <div
          className="card-body small"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: event.description_html }}
        />
      </div>

      <div className="mb-4">
        <button type="button" className="btn btn-primary" onClick={startSchedulingRuns}>
          Schedule additional runs
        </button>
      </div>

      <div className="d-flex mb-4">
        {runLists}
      </div>
    </div>
  );
}

RecurringEventSectionBody.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
    description_html: PropTypes.string.isRequired,
    runs: PropTypes.arrayOf(PropTypes.shape({
      starts_at: PropTypes.string.isRequired,
    })).isRequired,
    length_seconds: PropTypes.number,
  }).isRequired,
  convention: PropTypes.shape({
    starts_at: PropTypes.string.isRequired,
    ends_at: PropTypes.string.isRequired,
    timezone_name: PropTypes.string.isRequired,
  }).isRequired,
  startSchedulingRuns: PropTypes.func.isRequired,
};

function RecurringEventSection({ event, convention }) {
  const [expanded, setExpanded] = useState(false);
  const scheduleRunsModal = useModal();

  const toggleExpanded = useCallback(() => setExpanded((prevExpanded) => !prevExpanded), []);

  return (
    <section className="my-4">
      <div className="d-flex">
        <div className="flex-grow-1">
          <button
            type="button"
            onClick={toggleExpanded}
            className="hidden-button"
            aria-expanded={expanded}
          >
            <h4>
              <DisclosureTriangle expanded={expanded} />
              {' '}
              {event.title}
              {' '}
              <small>
                (
                {event.runs.length}
                {' '}
                runs;
                {' '}
                {moment.duration(event.length_seconds, 'seconds').humanize()}
                {' '}
                per run)
              </small>
            </h4>
          </button>
        </div>

        <div>
          <Link className="btn btn-outline-primary" to={`/admin_events/${event.id}/edit`}>
            Edit
          </Link>
        </div>
      </div>

      {expanded && (
        <RecurringEventSectionBody
          event={event}
          convention={convention}
          startSchedulingRuns={scheduleRunsModal.open}
        />
      )}

      <ScheduleMultipleRunsModal
        visible={scheduleRunsModal.visible}
        convention={convention}
        event={event}
        onCancel={scheduleRunsModal.close}
        onFinish={scheduleRunsModal.close}
      />

      <hr />
    </section>
  );
}

RecurringEventSection.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    runs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    length_seconds: PropTypes.number,
  }).isRequired,
  convention: PropTypes.shape({}).isRequired,
};

export default RecurringEventSection;
