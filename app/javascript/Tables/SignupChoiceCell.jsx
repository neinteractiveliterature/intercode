import PropTypes from 'prop-types';

const SignupChoiceCell = ({ value, original }) => {
  if (original.counted) {
    return value;
  }

  return 'N/C';
};

SignupChoiceCell.propTypes = {
  value: PropTypes.number,
  original: PropTypes.shape({
    counted: PropTypes.bool,
  }).isRequired,
};

SignupChoiceCell.defaultProps = {
  value: null,
};

export default SignupChoiceCell;
