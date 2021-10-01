import { DateTime } from 'luxon';

export type FuzzyTime = {
  hour?: number;
  minute?: number;
  second?: number;
};

export type TimeblockDefinition = {
  label: string;
  start: FuzzyTime;
  finish: FuzzyTime;
};

export type TimeblockOmission = {
  label: string;
  date: string;
};

export type TimeblockPreferenceOrdinality = '1' | '2' | '3' | 'X';

type TimeblockPreferenceCommon = {
  label: string;
  ordinality: TimeblockPreferenceOrdinality;
};

export type ParsedTimeblockPreference = TimeblockPreferenceCommon & {
  start: DateTime;
  finish: DateTime;
};

export type UnparsedTimeblockPreference = TimeblockPreferenceCommon & {
  start: string;
  finish: string;
};

export type TimeblockPreferenceForComparison = Pick<
  ParsedTimeblockPreference | UnparsedTimeblockPreference,
  'start' | 'finish'
>;

export function parseTimeblockPreference(
  unparsedPreference: UnparsedTimeblockPreference,
): ParsedTimeblockPreference {
  return {
    start: DateTime.fromISO(unparsedPreference.start),
    finish: DateTime.fromISO(unparsedPreference.finish),
    label: unparsedPreference.label,
    ordinality: unparsedPreference.ordinality,
  };
}

export function serializeTimeblockPreference(
  preference: ParsedTimeblockPreference,
): UnparsedTimeblockPreference {
  return {
    start: preference.start.toISO(),
    finish: preference.finish.toISO(),
    label: preference.label,
    ordinality: preference.ordinality,
  };
}

function coerceDateLike(dateLike: string | DateTime): DateTime {
  if (typeof dateLike === 'string') {
    return DateTime.fromISO(dateLike);
  }

  return dateLike;
}

export function preferencesMatch(
  a: TimeblockPreferenceForComparison,
  b: TimeblockPreferenceForComparison,
): boolean {
  return (
    coerceDateLike(a.start).toMillis() === coerceDateLike(b.start).toMillis() &&
    coerceDateLike(a.finish).toMillis() === coerceDateLike(b.finish).toMillis()
  );
}
