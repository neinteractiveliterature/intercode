import PropTypes from 'prop-types';

const BooleanCell = ({ value }) => (value ? 'yes' : 'no');

BooleanCell.propTypes = {
  value: PropTypes.bool,
};

BooleanCell.defaultProps = {
  value: false,
};

export default BooleanCell;
