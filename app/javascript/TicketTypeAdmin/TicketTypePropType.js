import PropTypes from 'prop-types';

export default PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  counts_towards_convention_maximum: PropTypes.bool.isRequired,
  maximum_event_provided_tickets: PropTypes.number.isRequired,
});
