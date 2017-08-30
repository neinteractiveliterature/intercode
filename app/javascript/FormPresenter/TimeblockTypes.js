// @flow

export type FuzzyTime = {
  hour?: number,
  minute?: number,
  second?: number,
};

export type Timeblock = {
  label: string,
  start: FuzzyTime,
  finish: FuzzyTime,
};

export type TimeblockOmission = {
  label: string,
  date: string,
};

export type TimeblockPreference = {
  start: moment,
  finish: moment,
  label: string,
  ordinality: string,
};

export type TimeblockPreferenceAPIRepresentation = {
  start: string,
  finish: string,
  label: string,
  ordinality: string,
};

export default {
  preferencesMatch(a: TimeblockPreference, b: TimeblockPreference): boolean {
    return a.start.isSame(b.start) && a.finish.isSame(b.finish);
  },
};
