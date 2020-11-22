import { parseISO, isDate, isEqual } from 'date-fns';

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
  start: Date;
  finish: Date;
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
    start: parseISO(unparsedPreference.start),
    finish: parseISO(unparsedPreference.finish),
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

function coerceToDate(dateLike: string | Date): Date {
  if (isDate(dateLike)) {
    return dateLike as Date;
  }

  return parseISO(dateLike as string);
}

export function preferencesMatch(
  a: TimeblockPreferenceForComparison,
  b: TimeblockPreferenceForComparison,
) {
  return (
    isEqual(coerceToDate(a.start), coerceToDate(b.start)) &&
    isEqual(coerceToDate(a.finish), coerceToDate(b.finish))
  );
}
