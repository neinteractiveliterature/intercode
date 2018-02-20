import PropTypes from 'prop-types';

export default PropTypes.shape({
  id: PropTypes.number,
  privileges: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  formResponseAttrs: PropTypes.shape({}).isRequired,
});
