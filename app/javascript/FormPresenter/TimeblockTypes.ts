import { DateTime } from 'luxon';

import { FiniteTimespan } from '../Timespan';

export type FuzzyTime = {
  hour?: number,
  minute?: number,
  second?: number,
};

export type TimeblockDefinition = {
  label: string,
  start: FuzzyTime,
  finish: FuzzyTime,
};

export type ConcreteTimeblock = {
  dayStart: DateTime,
  timeblock: TimeblockDefinition,
  label: string,
  timespan: FiniteTimespan,
};

export type TimeblockOmission = {
  label: string,
  date: string,
};

export type TimeblockPreferenceOrdinality = '1' | '2' | '3' | 'X';

type TimeblockPreferenceCommonProps = {
  label: string,
  ordinality: TimeblockPreferenceOrdinality,
};

export type TimeblockPreference = TimeblockPreferenceCommonProps & {
  start: DateTime,
  finish: DateTime,
};

export type TimeblockPreferenceAPIRepresentation = TimeblockPreferenceCommonProps & {
  start: string,
  finish: string,
};

export type TimeblockPreferenceOrAPIRepresentation = (
  TimeblockPreference | TimeblockPreferenceAPIRepresentation
);

export function isAPIRepresentation(
  timeblockPreference: TimeblockPreferenceOrAPIRepresentation,
): timeblockPreference is TimeblockPreferenceAPIRepresentation {
  return (
    (typeof timeblockPreference.start === 'string')
    || (typeof timeblockPreference.finish === 'string')
  );
}

export function ensureTimeblockPreferenceParsed(
  timeblockPreference: TimeblockPreferenceOrAPIRepresentation,
): TimeblockPreference {
  if (isAPIRepresentation(timeblockPreference)) {
    return {
      ...timeblockPreference,
      start: DateTime.fromISO(timeblockPreference.start),
      finish: DateTime.fromISO(timeblockPreference.finish),
    };
  }

  return timeblockPreference;
}

export function preferencesMatch(
  a: TimeblockPreferenceOrAPIRepresentation,
  b: TimeblockPreferenceOrAPIRepresentation,
) {
  const parsedA = ensureTimeblockPreferenceParsed(a);
  const parsedB = ensureTimeblockPreferenceParsed(b);
  return (+parsedA.start === +parsedB.start) && (+parsedA.finish === +parsedB.finish);
}
