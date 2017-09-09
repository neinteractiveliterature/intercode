import PropTypes from 'prop-types';

const defaultConfigProp = {
  classifyEventsBy: null,
  showExtendedCounts: false,
  showSignedUp: false,
  showSignupStatusBadge: false,
};

export { defaultConfigProp };

export default PropTypes.shape({
  classifyEventsBy: PropTypes.oneOf(['category', 'fullness']),
  showExtendedCounts: PropTypes.bool,
  showSignedUp: PropTypes.bool,
  showSignupStatusBadge: PropTypes.bool,
});
