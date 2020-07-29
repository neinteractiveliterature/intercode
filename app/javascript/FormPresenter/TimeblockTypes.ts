import PropTypes from 'prop-types';
import MomentPropTypes from 'react-moment-proptypes';
import moment, { Moment } from 'moment-timezone';

export type FuzzyTime = {
  hour?: number,
  minute?: number,
  second?: number,
};

export const FuzzyTimePropType = PropTypes.shape({
  hour: PropTypes.number,
  minute: PropTypes.number,
  second: PropTypes.number,
});

export type TimeblockDefinition = {
  label: string,
  start: FuzzyTime,
  finish: FuzzyTime,
};

export const TimeblockPropType = PropTypes.shape({
  label: PropTypes.string.isRequired,
  start: FuzzyTimePropType.isRequired,
  finish: FuzzyTimePropType.isRequired,
});

export type TimeblockOmission = {
  label: string,
  date: string,
};

export const TimeblockOmissionPropType = PropTypes.shape({
  label: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
});

export type TimeblockPreferenceOrdinality = '1' | '2' | '3' | 'X';

type TimeblockPreferenceCommon = {
  label: string,
  ordinality: TimeblockPreferenceOrdinality,
};

const timeblockPreferenceCommonProps = {
  label: PropTypes.string.isRequired,
  ordinality: PropTypes.string.isRequired,
};

export type ParsedTimeblockPreference = TimeblockPreferenceCommon & {
  start: Moment,
  finish: Moment,
};

export const TimeblockPreferencePropType = PropTypes.shape({
  start: MomentPropTypes.momentObj.isRequired,
  finish: MomentPropTypes.momentObj.isRequired,
  ...timeblockPreferenceCommonProps,
});

export type UnparsedTimeblockPreference = TimeblockPreferenceCommon & {
  start: string,
  finish: string,
};

export const TimeblockPreferenceAPIRepresentationPropType = PropTypes.shape({
  start: PropTypes.string.isRequired,
  finish: PropTypes.string.isRequired,
  ...timeblockPreferenceCommonProps,
});

type TimeblockPreferenceForComparison = (
  Pick<ParsedTimeblockPreference | UnparsedTimeblockPreference, 'start' | 'finish'>
);

export function preferencesMatch(
  a: TimeblockPreferenceForComparison,
  b: TimeblockPreferenceForComparison,
) {
  return moment(a.start).isSame(moment(b.start)) && moment(a.finish).isSame(moment(b.finish));
}
