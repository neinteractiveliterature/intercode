import { useMemo, useState, useEffect, useContext } from 'react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import { BootstrapFormInput, FormGroupWithLabel } from '@neinteractiveliterature/litform';

import ConventionDaySelect from '../BuiltInFormControls/ConventionDaySelect';
import TimeSelect from '../BuiltInFormControls/TimeSelect';
import { timespanFromConvention, getConventionDayTimespans } from '../TimespanUtils';
import ProspectiveRunSchedule from '../EventAdmin/ProspectiveRunSchedule';
import RoomSelect, { RoomForSelect } from '../BuiltInFormControls/RoomSelect';
import AppRootContext from '../AppRootContext';
import { EventAdminEventsQueryData } from '../EventAdmin/queries.generated';
import { Run } from '../graphqlTypes.generated';
import { useAppDateTimeFormat } from '../TimeUtils';
import Timespan from '../Timespan';

export type RunForRunFormFields = Pick<Run, '__typename' | 'title_suffix' | 'schedule_note'> & {
  id: string;
  rooms: RoomForSelect[];
  starts_at?: Run['starts_at'];
};

type WithStartsAt<RunType extends RunForRunFormFields> = Omit<RunType, 'starts_at'> & {
  starts_at: Run['starts_at'];
};

export type RunFormFieldsProps<RunType extends RunForRunFormFields> = {
  run: RunType;
  convention: EventAdminEventsQueryData['convention'];
  event: EventAdminEventsQueryData['convention']['events'][0];
  onChange: React.Dispatch<React.SetStateAction<RunType>>;
};

function RunFormFields<RunType extends RunForRunFormFields>({
  run,
  event,
  convention,
  onChange,
}: RunFormFieldsProps<RunType>): JSX.Element {
  const { t } = useTranslation();
  const { timezoneName } = useContext(AppRootContext);
  const format = useAppDateTimeFormat();

  const startsAt = useMemo(
    () => (run && run.starts_at ? DateTime.fromISO(run.starts_at, { zone: timezoneName }) : null),
    [timezoneName, run],
  );
  const conventionTimespan = useMemo(() => timespanFromConvention(convention), [convention]);
  const conventionDayTimespans = useMemo(
    () => (conventionTimespan?.isFinite() ? getConventionDayTimespans(conventionTimespan, timezoneName) : null),
    [conventionTimespan, timezoneName],
  );
  const [day, setDay] = useState<DateTime | undefined>(() =>
    startsAt && conventionDayTimespans
      ? conventionDayTimespans.find((timespan) => timespan.includesTime(startsAt))?.start
      : startsAt?.startOf('day'),
  );
  const [hour, setHour] = useState<number | undefined>(() =>
    startsAt && day ? Math.floor(startsAt.diff(day.startOf('day'), 'hours').hours) : undefined,
  );
  const [minute, setMinute] = useState<number | undefined>(() =>
    startsAt && hour != null && day != null
      ? Math.floor(startsAt.diff(day.startOf('day').plus({ hours: hour }), 'minutes').minutes)
      : undefined,
  );
  const startTime = useMemo(() => {
    if (day == null || hour == null || minute == null) {
      return null;
    }

    return day.set({
      hour,
      minute,
    });
  }, [day, hour, minute]);

  useEffect(() => {
    onChange((prevRun) => ({ ...prevRun, starts_at: startTime ? startTime.toISO() : null }));
  }, [onChange, startTime]);

  const runsForProspectiveRunSchedule = useMemo(() => (run.starts_at ? [run as WithStartsAt<RunType>] : []), [run]);

  const eventForProspectiveRunSchedule = useMemo(
    () => ({
      ...event,
      id: event.id || 'prospectiveEvent',
      runs: event.runs || [],
    }),
    [event],
  );

  const timeInputChanged = ({ hour: newHour, minute: newMinute }: { hour?: number; minute?: number }) => {
    setHour(newHour);
    setMinute(newMinute);
  };

  const renderTimeSelect = () => {
    if (!day) {
      return null;
    }

    const timespan =
      conventionDayTimespans?.find((cdt) => cdt.includesTime(day)) ??
      Timespan.finiteFromDateTimes(
        day.startOf('day').set({ hour: 6 }),
        day.plus({ days: 1 }).startOf('day').set({ hour: 6 }),
      );

    return (
      <fieldset className="mb-3">
        <legend className="col-form-label">{t('events.edit.timeLabel')}</legend>
        <TimeSelect value={{ hour, minute }} onChange={timeInputChanged} timespan={timespan}>
          {startTime && `- ${format(startTime.plus({ seconds: event.length_seconds }), 'shortTime')}`}
        </TimeSelect>
        <input type="hidden" name="starts_at" value={startTime?.toISO() ?? ''} />
      </fieldset>
    );
  };

  return (
    <div>
      {<ConventionDaySelect convention={convention} value={day} onChange={setDay} />}
      {renderTimeSelect()}
      <FormGroupWithLabel label={t('events.edit.roomsLabel')}>
        {(id) => (
          <RoomSelect
            id={id}
            name="room_ids"
            rooms={convention.rooms ?? []}
            isMulti
            value={run.rooms}
            onChange={(rooms: RoomForSelect[]) => onChange((prevRun) => ({ ...prevRun, rooms }))}
          />
        )}
      </FormGroupWithLabel>
      <ProspectiveRunSchedule
        day={day ?? undefined}
        runs={runsForProspectiveRunSchedule}
        event={eventForProspectiveRunSchedule}
      />
      <BootstrapFormInput
        name="title_suffix"
        label={t('events.edit.titleSuffixLabel')}
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
        label={t('events.edit.scheduleNoteLabel')}
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
