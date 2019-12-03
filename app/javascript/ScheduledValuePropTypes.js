import PropTypes from 'prop-types';
import MomentPropTypes from 'react-moment-proptypes';

const TimespanPropType = PropTypes.shape({
  start: PropTypes.oneOfType([PropTypes.string, MomentPropTypes.momentObj]),
  finish: PropTypes.oneOfType([PropTypes.string, MomentPropTypes.momentObj]),
});

const ScheduledValuePropType = PropTypes.shape({
  timespans: PropTypes.arrayOf(TimespanPropType.isRequired),
});

export {
  TimespanPropType,
  ScheduledValuePropType,
};
