import React, { ReactNode, RefObject, useCallback, useMemo, useRef, useState } from 'react';
import { maxBy, minBy } from 'lodash';
import moment, { Moment } from 'moment-timezone';

import { EditingScheduledValue } from '../BuiltInFormControls/ScheduledValueEditor';
import { notEmpty } from '../ValueUtils';
import { findTimespanAt, findValueAt } from '../ScheduledValueUtils';
import Tooltip from './Tooltip';
import { useIntercodePopper } from './PopperUtils';

function momentIfValid(value: string | undefined, timezoneName: string) {
  if (value) {
    const momentValue = moment.tz(value, timezoneName);
    if (momentValue.isValid()) {
      return momentValue;
    }
  }

  return undefined;
}

export type ScheduledValuePreviewTooltipContentProps<ValueType> = {
  date: Moment;
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

  const nextValue = useMemo(() => {
    const tomorrow = date.clone().add(1, 'day');
    return findValueAt(scheduledValue, tomorrow);
  }, [scheduledValue, date]);

  return (
    <>
      <strong>{date.format('LL')}</strong>
      <br />
      {value !== nextValue && (
        <em>
          Before{' '}
          {moment.tz(findTimespanAt(scheduledValue, date)?.finish, timezoneName).format('LT z')}
        </em>
      )}
      <br />
      {getDescriptionForValue(value)}
      {value !== nextValue && (
        <>
          <hr className="my-2 border-white" />
          <em>
            Starting at{' '}
            {moment.tz(findTimespanAt(scheduledValue, date)?.finish, timezoneName).format('LT z')}
          </em>
          <br />
          {getDescriptionForValue(nextValue)}
        </>
      )}
    </>
  );
}

type ScheduledValuePreviewDateCellProps<ValueType> = ScheduledValuePreviewTooltipContentProps<
  ValueType
> & {
  focusDate: (date: Moment) => void;
  blurDate: (date: Moment) => void;
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
        {date.date()}
        <div className="sr-only">
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
  focusDate: (date: Moment) => void;
  blurDate: (date: Moment) => void;
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
  const timespanFinishes = useMemo(
    () => scheduledValue.timespans.map((timespan) => timespan.finish).filter(notEmpty),
    [scheduledValue.timespans],
  );

  const earliestChange = useMemo(
    () =>
      momentIfValid(
        minBy(timespanFinishes, (finish) => moment(finish).toDate()),
        timezoneName,
      ),
    [timespanFinishes, timezoneName],
  );

  const latestChange = useMemo(
    () =>
      momentIfValid(
        maxBy(timespanFinishes, (finish) => moment(finish).toDate()),
        timezoneName,
      ),
    [timespanFinishes, timezoneName],
  );

  if (!earliestChange || !latestChange) {
    return <></>;
  }

  if (latestChange.diff(earliestChange, 'months') > 6) {
    return <>Timespan too long to display a preview</>;
  }

  const monthPreviews: JSX.Element[] = [];
  let now = earliestChange.startOf('month');
  while (now < latestChange) {
    const startOfMonth = now;
    const currentMonth = now.month();
    const weekPreviews: JSX.Element[] = [];
    let currentWeek: JSX.Element[] = [];
    while (now.month() === currentMonth) {
      if (now.date() === 1) {
        for (let wd = 0; wd < now.weekday(); wd += 1) {
          currentWeek.push(<td key={`fill-weekday-${wd}`} className="p-1" />);
        }
      } else if (now.weekday() === 0) {
        weekPreviews.push(<tr key={now.toISOString()}>{currentWeek}</tr>);
        currentWeek = [];
      }
      const tomorrow = now.clone().add(1, 'day');
      const value = findValueAt(scheduledValue, now);
      const nextValue = findValueAt(scheduledValue, tomorrow);
      currentWeek.push(
        <td
          key={now.toISOString()}
          className={`text-center p-0 ${getClassNameForValue(value, nextValue)}`}
        >
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
      weekPreviews.push(<tr key={now.toISOString()}>{currentWeek}</tr>);
    }

    monthPreviews.push(
      <table key={startOfMonth.toISOString()} className="m-2 border border-1" role="grid">
        <thead>
          <tr className="border-bottom border-1">
            <th colSpan={7} className="text-center">
              {startOfMonth.format('MMMM YYYY')}
            </th>
          </tr>
        </thead>
        <tbody>{weekPreviews}</tbody>
      </table>,
    );
  }

  return <>{monthPreviews}</>;
}

const MemoizedScheduledValuePreviewCalendar = React.memo(ScheduledValuePreviewCalendar);

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
}: ScheduledValuePreviewProps<ValueType>) {
  const [focusedDate, setFocusedDate] = useState<Moment>();
  const [tooltip, setTooltip] = useState<HTMLDivElement | null>(null);
  const [arrow, setArrow] = useState<HTMLDivElement | null>(null);
  const dateElementMapRef = useRef(new Map<number, HTMLElement>());

  const focusedDateElement = focusedDate
    ? dateElementMapRef.current.get(focusedDate.valueOf()) ?? null
    : null;

  const { styles, attributes, state } = useIntercodePopper(tooltip, focusedDateElement, arrow);

  const focusDate = useCallback((value: Moment) => setFocusedDate(value), []);

  const blurDate = useCallback(
    (value: Moment) =>
      setFocusedDate((prevValue) => {
        // Only clear out the focused date if it hasn't already changed to some other date
        if (prevValue && prevValue.isSame(value)) {
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
