import PropTypes from 'prop-types';
import formatMoney from '../formatMoney';

const MoneyCell = ({ value }) => formatMoney(value);

MoneyCell.propTypes = {
  value: PropTypes.shape({}),
};

MoneyCell.defaultProps = {
  value: null,
};

export default MoneyCell;
