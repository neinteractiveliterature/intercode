import { memo, ReactNode, RefObject, useCallback, useMemo, useRef, useState } from 'react';
import minBy from 'lodash/minBy';
import maxBy from 'lodash/maxBy';
import { DateTime, WeekdayNumbers } from 'luxon';
import { notEmpty, Tooltip, useLitformPopper } from '@neinteractiveliterature/litform';

import { EditingScheduledValue } from '../BuiltInFormControls/ScheduledValueEditor';
import { findTimespanAt, findValueAt } from '../ScheduledValueUtils';
import { useAppDateTimeFormat } from '../TimeUtils';

function dateTimeIfValid(value: string | undefined, timezoneName: string) {
  if (value) {
    const dateTime = DateTime.fromISO(value, { zone: timezoneName });
    if (dateTime.isValid) {
      return dateTime;
    }
  }

  return undefined;
}

export type ScheduledValuePreviewTooltipContentProps<ValueType> = {
  date: DateTime;
  scheduledValue: EditingScheduledValue<ValueType>;
  getDescriptionForValue: (value: ValueType | undefined) => ReactNode;
  timezoneName: string;
};

function ScheduledValuePreviewTooltipContent<ValueType>({
  date,
  scheduledValue,
  timezoneName,
  getDescriptionForValue,
}: ScheduledValuePreviewTooltipContentProps<ValueType>) {
  const value = useMemo(() => findValueAt(scheduledValue, date), [scheduledValue, date]);
  const format = useAppDateTimeFormat();

  const nextValue = useMemo(() => {
    const tomorrow = date.plus({ days: 1 });
    return findValueAt(scheduledValue, tomorrow);
  }, [scheduledValue, date]);

  const nextChange = useMemo(() => {
    const timeString = findTimespanAt(scheduledValue, date)?.finish;
    return timeString ? DateTime.fromISO(timeString, { zone: timezoneName }) : undefined;
  }, [scheduledValue, date, timezoneName]);

  return (
    <>
      <strong>{format(date, 'longWeekdayDate')}</strong>
      <br />
      {value !== nextValue && nextChange && <em>Before {format(nextChange, 'shortTimeWithZone')}</em>}
      <br />
      {getDescriptionForValue(value)}
      {value !== nextValue && nextChange && (
        <>
          <hr className="my-2 border-white" />
          <em>Starting at {format(nextChange, 'shortTimeWithZone')}</em>
          <br />
          {getDescriptionForValue(nextValue)}
        </>
      )}
    </>
  );
}

type ScheduledValuePreviewDateCellProps<ValueType> = ScheduledValuePreviewTooltipContentProps<ValueType> & {
  focusDate: (date: DateTime) => void;
  blurDate: (date: DateTime) => void;
  dateElementMapRef: RefObject<Map<number, HTMLElement>>;
};

function ScheduledValuePreviewDateCell<ValueType>({
  date,
  focusDate,
  blurDate,
  dateElementMapRef,
  scheduledValue,
  timezoneName,
  getDescriptionForValue,
}: ScheduledValuePreviewDateCellProps<ValueType>) {
  return (
    <>
      <div
        ref={(element) => {
          if (dateElementMapRef.current) {
            if (element) {
              dateElementMapRef.current.set(date.valueOf(), element);
            } else {
              dateElementMapRef.current.delete(date.valueOf());
            }
          }
        }}
        className="cursor-pointer p-1"
        onFocus={() => focusDate(date)}
        onBlur={() => blurDate(date)}
        onMouseOver={() => focusDate(date)}
        onMouseOut={() => blurDate(date)}
      >
        {date.day}
        <div className="visually-hidden">
          <ScheduledValuePreviewTooltipContent
            date={date}
            scheduledValue={scheduledValue}
            timezoneName={timezoneName}
            getDescriptionForValue={getDescriptionForValue}
          />
        </div>
      </div>
    </>
  );
}

export type ScheduledValuePreviewCalendarProps<ValueType> = {
  scheduledValue: EditingScheduledValue<ValueType>;
  timezoneName: string;
  getClassNameForValue: (value: ValueType | undefined, nextValue: ValueType | undefined) => string;
  getDescriptionForValue: (value: ValueType | undefined) => ReactNode;
  focusDate: (date: DateTime) => void;
  blurDate: (date: DateTime) => void;
  dateElementMapRef: RefObject<Map<number, HTMLElement>>;
};

function ScheduledValuePreviewCalendar<ValueType>({
  scheduledValue,
  timezoneName,
  getClassNameForValue,
  getDescriptionForValue,
  focusDate,
  blurDate,
  dateElementMapRef,
}: ScheduledValuePreviewCalendarProps<ValueType>) {
  const format = useAppDateTimeFormat();

  const timespanFinishes = useMemo(
    () => scheduledValue.timespans.map((timespan) => timespan.finish).filter(notEmpty),
    [scheduledValue.timespans],
  );

  const earliestChange = useMemo(
    () =>
      dateTimeIfValid(
        minBy(timespanFinishes, (finish) => DateTime.fromISO(finish).toMillis()),
        timezoneName,
      ),
    [timespanFinishes, timezoneName],
  );

  const latestChange = useMemo(
    () =>
      dateTimeIfValid(
        maxBy(timespanFinishes, (finish) => DateTime.fromISO(finish).toMillis()),
        timezoneName,
      ),
    [timespanFinishes, timezoneName],
  );

  if (!earliestChange || !latestChange) {
    return <></>;
  }

  if (latestChange.diff(earliestChange, 'months').months > 6) {
    return <>Timespan too long to display a preview</>;
  }

  const monthPreviews: JSX.Element[] = [];
  let now = earliestChange.startOf('month');
  while (now < latestChange) {
    const startOfMonth = now;
    const currentMonth = now.month;
    const weekPreviews: JSX.Element[] = [];
    let currentWeek: JSX.Element[] = [];
    while (now.month === currentMonth) {
      if (now.day === 1) {
        for (let wd = 0; wd < now.weekday; wd += 1) {
          currentWeek.push(<td key={`fill-weekday-${wd}`} className="p-1" />);
        }
      } else if (now.weekday === 7) {
        weekPreviews.push(<tr key={now.toISO()}>{currentWeek}</tr>);
        currentWeek = [];
      }
      const tomorrow = now.plus({ days: 1 });
      const value = findValueAt(scheduledValue, now);
      const nextValue = findValueAt(scheduledValue, tomorrow);
      currentWeek.push(
        <td key={now.toISO()} className={`text-center p-0 ${getClassNameForValue(value, nextValue)}`}>
          <ScheduledValuePreviewDateCell
            date={now}
            focusDate={focusDate}
            blurDate={blurDate}
            dateElementMapRef={dateElementMapRef}
            getDescriptionForValue={getDescriptionForValue}
            scheduledValue={scheduledValue}
            timezoneName={timezoneName}
          />
        </td>,
      );
      now = tomorrow;
    }
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(<td key={`fill-weekday-${currentWeek.length}`} className="p-1" />);
      }
      weekPreviews.push(<tr key={now.toISO()}>{currentWeek}</tr>);
    }

    monthPreviews.push(
      <table key={startOfMonth.toISO()} className="m-2 border border-1" role="grid">
        <thead>
          <tr className="border-bottom border-1">
            <th colSpan={7} className="text-center">
              {format(startOfMonth, 'longMonthYear')}
            </th>
          </tr>
          <tr className="border-bottom border-1">
            {Array.from({ length: 7 }).map((_value, dayIndex) => (
              <td key={dayIndex} className="text-center">
                {format(
                  DateTime.now().set({ weekday: (((dayIndex - 1) % 7) + 1) as WeekdayNumbers }),
                  'compactWeekday',
                )}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>{weekPreviews}</tbody>
      </table>,
    );
  }

  return <>{monthPreviews}</>;
}

const MemoizedScheduledValuePreviewCalendar = memo(ScheduledValuePreviewCalendar);

export type ScheduledValuePreviewProps<ValueType> = {
  scheduledValue: EditingScheduledValue<ValueType>;
  getClassNameForValue: (value: ValueType | undefined, nextValue: ValueType | undefined) => string;
  getDescriptionForValue: (value: ValueType | undefined) => ReactNode;
  timezoneName: string;
};

function ScheduledValuePreview<ValueType>({
  scheduledValue,
  getClassNameForValue,
  getDescriptionForValue,
  timezoneName,
}: ScheduledValuePreviewProps<ValueType>): JSX.Element {
  const [focusedDate, setFocusedDate] = useState<DateTime>();
  const [tooltip, setTooltip] = useState<HTMLDivElement | null>(null);
  const [arrow, setArrow] = useState<HTMLDivElement | null>(null);
  const dateElementMapRef = useRef(new Map<number, HTMLElement>());

  const focusedDateElement = focusedDate ? dateElementMapRef.current.get(focusedDate.valueOf()) ?? null : null;

  const { styles, attributes, state } = useLitformPopper(tooltip, focusedDateElement, arrow);

  const focusDate = useCallback((value: DateTime) => setFocusedDate(value), []);

  const blurDate = useCallback(
    (value: DateTime) =>
      setFocusedDate((prevValue) => {
        // Only clear out the focused date if it hasn't already changed to some other date
        if (prevValue && prevValue.toMillis() === value.toMillis()) {
          return undefined;
        }

        return prevValue;
      }),
    [],
  );

  return (
    <section className="d-flex flex-wrap">
      <MemoizedScheduledValuePreviewCalendar
        scheduledValue={scheduledValue}
        timezoneName={timezoneName}
        getClassNameForValue={getClassNameForValue}
        getDescriptionForValue={getDescriptionForValue}
        focusDate={focusDate}
        blurDate={blurDate}
        dateElementMapRef={dateElementMapRef}
      />
      <Tooltip
        popperRef={setTooltip}
        arrowRef={setArrow}
        attributes={attributes}
        state={state}
        styles={styles}
        visible={focusedDate != null}
      >
        {focusedDate && (
          <ScheduledValuePreviewTooltipContent
            date={focusedDate}
            getDescriptionForValue={getDescriptionForValue}
            scheduledValue={scheduledValue}
            timezoneName={timezoneName}
          />
        )}
      </Tooltip>
    </section>
  );
}

export default ScheduledValuePreview;
