import React, { useMemo, useState, useEffect, useContext } from 'react';
import moment from 'moment-timezone';
import { useTranslation } from 'react-i18next';

import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import ConventionDaySelect from '../BuiltInFormControls/ConventionDaySelect';
import TimeSelect from '../BuiltInFormControls/TimeSelect';
import { timespanFromConvention, getConventionDayTimespans } from '../TimespanUtils';
import ErrorDisplay from '../ErrorDisplay';
import ProspectiveRunSchedule from '../EventAdmin/ProspectiveRunSchedule';
import LoadingIndicator from '../LoadingIndicator';
import FormGroupWithLabel from '../BuiltInFormControls/FormGroupWithLabel';
import RoomSelect, { RoomForSelect } from '../BuiltInFormControls/RoomSelect';
import AppRootContext from '../AppRootContext';
import {
  useEventAdminEventsQueryQuery,
  EventAdminEventsQueryQuery,
} from '../EventAdmin/queries.generated';
import { Run } from '../graphqlTypes.generated';

type RunForRunFormFields = Pick<Run, 'id' | 'starts_at' | 'title_suffix' | 'schedule_note'> & {
  rooms: RoomForSelect[];
};

export type RunFormFieldsProps<RunType extends RunForRunFormFields> = {
  run: RunType;
  event: EventAdminEventsQueryQuery['events'][0];
  onChange: React.Dispatch<React.SetStateAction<RunType>>;
};

function RunFormFields<RunType extends RunForRunFormFields>({
  run,
  event,
  onChange,
}: RunFormFieldsProps<RunType>) {
  const { t } = useTranslation();
  const { timezoneName } = useContext(AppRootContext);
  const { data, loading, error } = useEventAdminEventsQueryQuery();

  const startsAt = useMemo(
    () =>
      !error && !loading && run && run.starts_at ? moment(run.starts_at).tz(timezoneName) : null,
    [timezoneName, error, loading, run],
  );
  const conventionTimespan = useMemo(
    () => (error || loading ? null : timespanFromConvention(data!.convention!)),
    [error, loading, data],
  );
  const conventionDayTimespans = useMemo(
    () =>
      conventionTimespan?.isFinite()
        ? getConventionDayTimespans(conventionTimespan, timezoneName)
        : null,
    [conventionTimespan, timezoneName],
  );
  const [day, setDay] = useState(
    startsAt && conventionDayTimespans
      ? conventionDayTimespans.find((timespan) => timespan.includesTime(startsAt))?.start
      : null,
  );
  const [hour, setHour] = useState(
    startsAt && day ? startsAt.diff(day.clone().startOf('day'), 'hours') : null,
  );
  const [minute, setMinute] = useState(
    startsAt && hour != null && day != null
      ? startsAt.diff(day.clone().startOf('day').add(hour, 'hours'), 'minutes')
      : null,
  );
  const startTime = useMemo(() => {
    if (day == null || hour == null || minute == null) {
      return null;
    }

    return day.clone().set({
      hour,
      minute,
    });
  }, [day, hour, minute]);

  useEffect(() => {
    onChange((prevRun) => ({ ...prevRun, starts_at: startTime ? startTime.toISOString() : null }));
  }, [onChange, startTime]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const timeInputChanged = ({ hour: newHour, minute: newMinute }) => {
    setHour(newHour);
    setMinute(newMinute);
  };

  const renderTimeSelect = () => {
    if (!day) {
      return null;
    }

    const timespan = conventionDayTimespans!.find((cdt) => cdt.includesTime(day))!;

    return (
      <fieldset className="form-group">
        <legend className="col-form-label">{t('events.edit.timeLabel', 'Time')}</legend>
        <TimeSelect value={{ hour, minute }} onChange={timeInputChanged} timespan={timespan}>
          {startTime &&
            `- ${startTime.clone().add(event.length_seconds, 'seconds').format('H:mm')}`}
        </TimeSelect>
      </fieldset>
    );
  };

  return (
    <div>
      <ConventionDaySelect convention={data!.convention!} value={day} onChange={setDay} />
      {renderTimeSelect()}

      <FormGroupWithLabel label={t('events.edit.roomsLabel', 'Room(s)')}>
        {(id) => (
          <RoomSelect
            id={id}
            label={t('events.edit.roomsLabel', 'Room(s)')}
            name="room_ids"
            rooms={data!.convention!.rooms}
            isMulti
            value={run.rooms}
            onChange={(rooms: RoomForSelect[]) => onChange((prevRun) => ({ ...prevRun, rooms }))}
          />
        )}
      </FormGroupWithLabel>

      <ProspectiveRunSchedule
        day={day ?? undefined}
        runs={[run]}
        event={{
          ...event,
          id: event.id || -1,
          runs: event.runs || [],
        }}
      />

      <BootstrapFormInput
        name="title_suffix"
        label={t('events.edit.titleSuffixLabel', 'Title suffix')}
        value={run.title_suffix || ''}
        onTextChange={(titleSuffix) =>
          onChange((prevRun) => ({
            ...prevRun,
            title_suffix: titleSuffix,
          }))
        }
      />
      <BootstrapFormInput
        name="schedule_note"
        label={t('events.edit.scheduleNoteLabel', 'Schedule note')}
        value={run.schedule_note || ''}
        onTextChange={(scheduleNote) =>
          onChange((prevRun) => ({
            ...prevRun,
            schedule_note: scheduleNote,
          }))
        }
      />
    </div>
  );
}

export default RunFormFields;
