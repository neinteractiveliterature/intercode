import {
  memo,
  ReactNode,
  RefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
  useContext,
} from 'react';
import { maxBy, minBy } from 'lodash';
import {
  parseISO,
  isValid,
  add,
  getDate,
  getMonth,
  getDay,
  differenceInMonths,
  startOfMonth,
  isEqual,
} from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc, format } from 'date-fns-tz';

import AppRootContext from '../AppRootContext';
import { EditingScheduledValue } from '../BuiltInFormControls/ScheduledValueEditor';
import { notEmpty } from '../ValueUtils';
import { findTimespanAt, findValueAt } from '../ScheduledValueUtils';
import Tooltip from './Tooltip';
import { useIntercodePopper } from './PopperUtils';

function dateIfValid(value: string | undefined) {
  if (value) {
    const date = parseISO(value);
    if (isValid(date)) {
      return date;
    }
  }

  return undefined;
}

export type ScheduledValuePreviewTooltipContentProps<ValueType> = {
  date: Date;
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
  const { dateFnsLocale } = useContext(AppRootContext);
  const value = useMemo(() => findValueAt(scheduledValue, date), [scheduledValue, date]);

  const nextStart = useMemo(() => findTimespanAt(scheduledValue, date)?.finish, [
    scheduledValue,
    date,
  ]);
  const nextValue = useMemo(() => {
    const tomorrow = zonedTimeToUtc(
      add(utcToZonedTime(date, timezoneName), { days: 1 }),
      timezoneName,
    );
    return findValueAt(scheduledValue, tomorrow);
  }, [scheduledValue, date, timezoneName]);
  const localDate = useMemo(() => utcToZonedTime(date, timezoneName), [date, timezoneName]);

  return (
    <>
      <strong>{format(localDate, 'PP', { timeZone: timezoneName, locale: dateFnsLocale })}</strong>
      <br />
      {value !== nextValue && (
        <em>
          Before{' '}
          {nextStart &&
            format(utcToZonedTime(nextStart, timezoneName), 'p z', {
              timeZone: timezoneName,
              locale: dateFnsLocale,
            })}
        </em>
      )}
      <br />
      {getDescriptionForValue(value)}
      {value !== nextValue && (
        <>
          <hr className="my-2 border-white" />
          <em>
            Starting at{' '}
            {nextStart &&
              format(utcToZonedTime(nextStart, timezoneName), 'p z', {
                timeZone: timezoneName,
                locale: dateFnsLocale,
              })}
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
  focusDate: (date: Date) => void;
  blurDate: (date: Date) => void;
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
        {getDate(utcToZonedTime(date, timezoneName))}
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
  focusDate: (date: Date) => void;
  blurDate: (date: Date) => void;
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
    () => dateIfValid(minBy(timespanFinishes, (finish) => finish.valueOf())),
    [timespanFinishes],
  );

  const latestChange = useMemo(
    () => dateIfValid(maxBy(timespanFinishes, (finish) => finish.valueOf())),
    [timespanFinishes],
  );

  if (!earliestChange || !latestChange) {
    return <></>;
  }

  if (differenceInMonths(latestChange, earliestChange) > 6) {
    return <>Timespan too long to display a preview</>;
  }

  const monthPreviews: JSX.Element[] = [];
  let now = zonedTimeToUtc(
    startOfMonth(utcToZonedTime(earliestChange, timezoneName)),
    timezoneName,
  );
  while (now < latestChange) {
    let localNow = utcToZonedTime(now, timezoneName);
    const monthStart = localNow;
    const currentMonth = getMonth(localNow);
    const weekPreviews: JSX.Element[] = [];
    let currentWeek: JSX.Element[] = [];
    while (getMonth(localNow) === currentMonth) {
      if (getDate(localNow) === 1) {
        for (let wd = 0; wd < getDay(localNow); wd += 1) {
          currentWeek.push(<td key={`fill-weekday-${wd}`} className="p-1" />);
        }
      } else if (getDay(localNow) === 0) {
        weekPreviews.push(<tr key={now.toISOString()}>{currentWeek}</tr>);
        currentWeek = [];
      }
      const tomorrow = add(now, { days: 1 });
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
      localNow = utcToZonedTime(now, timezoneName);
    }
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(<td key={`fill-weekday-${currentWeek.length}`} className="p-1" />);
      }
      weekPreviews.push(<tr key={now.toISOString()}>{currentWeek}</tr>);
    }

    monthPreviews.push(
      <table key={monthStart.toISOString()} className="m-2 border border-1" role="grid">
        <thead>
          <tr className="border-bottom border-1">
            <th colSpan={7} className="text-center">
              {format(monthStart, 'MMMM yyyy')}
            </th>
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
}: ScheduledValuePreviewProps<ValueType>) {
  const [focusedDate, setFocusedDate] = useState<Date>();
  const [tooltip, setTooltip] = useState<HTMLDivElement | null>(null);
  const [arrow, setArrow] = useState<HTMLDivElement | null>(null);
  const dateElementMapRef = useRef(new Map<number, HTMLElement>());

  const focusedDateElement = focusedDate
    ? dateElementMapRef.current.get(focusedDate.valueOf()) ?? null
    : null;

  const { styles, attributes, state } = useIntercodePopper(tooltip, focusedDateElement, arrow);

  const focusDate = useCallback((value: Date) => setFocusedDate(value), []);

  const blurDate = useCallback(
    (value: Date) =>
      setFocusedDate((prevValue) => {
        // Only clear out the focused date if it hasn't already changed to some other date
        if (prevValue && isEqual(prevValue, value)) {
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
