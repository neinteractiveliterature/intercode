import moment, { Moment } from 'moment-timezone';

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
  start: Moment;
  finish: Moment;
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
    start: moment(unparsedPreference.start),
    finish: moment(unparsedPreference.finish),
    label: unparsedPreference.label,
    ordinality: unparsedPreference.ordinality,
  };
}

export function serializeTimeblockPreference(
  preference: ParsedTimeblockPreference,
): UnparsedTimeblockPreference {
  return {
    start: preference.start.toISOString(),
    finish: preference.finish.toISOString(),
    label: preference.label,
    ordinality: preference.ordinality,
  };
}

export function preferencesMatch(
  a: TimeblockPreferenceForComparison,
  b: TimeblockPreferenceForComparison,
) {
  return moment(a.start).isSame(moment(b.start)) && moment(a.finish).isSame(moment(b.finish));
}
