import PropTypes from 'prop-types';
import { ScheduledValuePropType } from '../ScheduledValuePropTypes';

export default PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  pricing_schedule: ScheduledValuePropType.isRequired,
  publicly_available: PropTypes.bool.isRequired,
  counts_towards_convention_maximum: PropTypes.bool.isRequired,
  maximum_event_provided_tickets: PropTypes.number.isRequired,
});
