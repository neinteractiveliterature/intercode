import PropTypes from 'prop-types';

const TimespanPropType = PropTypes.shape({
  start: PropTypes.string,
  finish: PropTypes.string,
});

const ScheduledValuePropType = PropTypes.shape({
  timespans: PropTypes.arrayOf(TimespanPropType.isRequired)
});

export {
  TimespanPropType,
  ScheduledValuePropType
};