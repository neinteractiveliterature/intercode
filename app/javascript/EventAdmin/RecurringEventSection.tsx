import { useState, useCallback, useContext, useMemo } from 'react';
import { Link } from 'react-router';
import sortBy from 'lodash/sortBy';
import { DateTime, Duration } from 'luxon';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { useModal, DisclosureTriangle } from '@neinteractiveliterature/litform';

import ScheduleMultipleRunsModal from './ScheduleMultipleRunsModal';
import { timespanFromConvention, getConventionDayTimespans } from '../TimespanUtils';
import AppRootContext from '../AppRootContext';
import { EventFieldsFragment } from './queries.generated';
import { getDateTimeFormat, useAppDateTimeFormat } from '../TimeUtils';
import { DateTimeFormatKey } from '../DateTimeFormats';
import { Convention, Room } from 'graphqlTypes.generated';

function humanizeEventLength(event: Pick<EventFieldsFragment, 'length_seconds'>, t: TFunction) {
  const duration = Duration.fromObject({ seconds: event.length_seconds });
  return duration.toFormat(getDateTimeFormat('durationHoursMinutes', t));
}

type RecurringEventSectionBodyProps = {
  event: EventFieldsFragment;
  convention: Pick<Convention, 'timezone_mode' | 'timezone_name' | 'starts_at' | 'ends_at'>;
  startSchedulingRuns: () => void;
};

function RecurringEventSectionBody({ event, convention, startSchedulingRuns }: RecurringEventSectionBodyProps) {
  const format = useAppDateTimeFormat();
  const { timezoneName } = useContext(AppRootContext);
  const conventionDays = useMemo(() => {
    const conventionTimespan = timespanFromConvention(convention);
    return conventionTimespan.isFinite() ? getConventionDayTimespans(conventionTimespan, timezoneName) : [];
  }, [convention, timezoneName]);

  const runLists = conventionDays.map((conventionDay) => {
    const dayRuns = sortBy(
      event.runs.filter((run) => conventionDay.includesTime(DateTime.fromISO(run.starts_at, { zone: timezoneName }))),
      (run) => DateTime.fromISO(run.starts_at).toMillis(),
    );

    const runItems = dayRuns.map((run) => {
      const runStart = DateTime.fromISO(run.starts_at, { zone: timezoneName });
      let formatKey: DateTimeFormatKey = 'shortTime';
      if (runStart.weekday !== conventionDay.start.weekday) {
        formatKey = 'shortWeekdayTime';
      }

      return (
        <li key={run.id} className="my-2">
          <Link className="btn btn-secondary" to={`./events/${event.id}/runs/${run.id}/edit`}>
            {format(runStart, formatKey)}
          </Link>
        </li>
      );
    });

    return (
      <div className="col" key={conventionDay.start.toISO()}>
        <div className="card">
          <div className="card-header">{format(conventionDay.start, 'longWeekday')}</div>
          <div className="card-body py-3">
            <ul className="list-unstyled m-0">{runItems}</ul>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div>
      <div className="card bg-light my-4">
        <div className="card-body small" dangerouslySetInnerHTML={{ __html: event.description_html ?? '' }} />
      </div>

      <div className="mb-4">
        <button type="button" className="btn btn-primary" onClick={startSchedulingRuns}>
          Schedule additional runs
        </button>
      </div>

      <div className="d-flex mb-4">{runLists}</div>
    </div>
  );
}

export type RecurringEventSectionProps = {
  event: EventFieldsFragment;
  convention: Pick<Convention, 'id' | 'timezone_mode' | 'timezone_name' | 'starts_at' | 'ends_at'> & {
    rooms: Pick<Room, '__typename' | 'id' | 'name'>[];
  };
};

function RecurringEventSection({ event, convention }: RecurringEventSectionProps): JSX.Element {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const scheduleRunsModal = useModal();

  const toggleExpanded = useCallback(() => setExpanded((prevExpanded) => !prevExpanded), []);

  return (
    <section className="my-4">
      <div className="d-flex">
        <div className="flex-grow-1">
          <button type="button" onClick={toggleExpanded} className="hidden-button" aria-expanded={expanded}>
            <h4>
              <DisclosureTriangle expanded={expanded} /> {event.title}{' '}
              <small>
                ({event.runs.length} runs; {humanizeEventLength(event, t)} per run)
              </small>
            </h4>
          </button>
        </div>

        <div>
          <Link className="btn btn-outline-primary" to={`./events/${event.id}/edit`}>
            {t('buttons.edit')}
          </Link>
        </div>
      </div>

      {expanded && (
        <RecurringEventSectionBody event={event} convention={convention} startSchedulingRuns={scheduleRunsModal.open} />
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

export default RecurringEventSection;
