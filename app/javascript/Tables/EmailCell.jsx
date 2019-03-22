import React from 'react';
import PropTypes from 'prop-types';

function EmailCell({ value }) {
  return (
    <a href={`mailto:${value}`} onClick={(event) => { event.stopPropagation(); }}>
      {value}
    </a>
  );
}

EmailCell.propTypes = {
  value: PropTypes.string,
};

EmailCell.defaultProps = {
  value: null,
};

export default EmailCell;
