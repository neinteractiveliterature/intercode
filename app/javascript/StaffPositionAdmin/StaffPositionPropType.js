import PropTypes from 'prop-types';

export default PropTypes.shape({
  name: PropTypes.string.isRequired,
  email: PropTypes.string,
  visible: PropTypes.bool.isRequired,
  user_con_profiles: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name_without_nickname: PropTypes.string.isRequired,
  })).isRequired,
});
