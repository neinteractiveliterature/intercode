import PropTypes from 'prop-types';
import arrayToSentence from 'array-to-sentence';

const ArrayToSentenceCell = ({ value }) => arrayToSentence(value);

ArrayToSentenceCell.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string),
};

ArrayToSentenceCell.defaultProps = {
  value: [],
};

export default ArrayToSentenceCell;
