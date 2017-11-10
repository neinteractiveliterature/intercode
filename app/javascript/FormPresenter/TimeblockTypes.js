import PropTypes from 'prop-types';
import MomentPropTypes from 'react-moment-proptypes';

export const FuzzyTimePropType = PropTypes.shape({
  hour: PropTypes.number,
  minute: PropTypes.number,
  second: PropTypes.number,
});

export const TimeblockPropType = PropTypes.shape({
  label: PropTypes.string.isRequired,
  start: FuzzyTimePropType.isRequired,
  finish: FuzzyTimePropType.isRequired,
});

export const TimeblockOmissionPropType = PropTypes.shape({
  label: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
});

const timeblockPreferenceCommonProps = {
  label: PropTypes.string.isRequired,
  ordinality: PropTypes.string.isRequired,
};

export const TimeblockPreferencePropType = PropTypes.shape({
  start: MomentPropTypes.momentObj.isRequired,
  finish: MomentPropTypes.momentObj.isRequired,
  ...timeblockPreferenceCommonProps,
});

export const TimeblockPreferenceAPIRepresentationPropType = PropTypes.shape({
  start: PropTypes.string.isRequired,
  finish: PropTypes.string.isRequired,
  ...timeblockPreferenceCommonProps,
});

export default {
  preferencesMatch(a, b) {
    return a.start.isSame(b.start) && a.finish.isSame(b.finish);
  },
};
