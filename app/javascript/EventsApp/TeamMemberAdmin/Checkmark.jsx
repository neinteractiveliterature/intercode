import React from 'react';
import PropTypes from 'prop-types';

function Checkmark({ value }) {
  if (!value) {
    return null;
  }

  return (
    <i className="fa fa-check">
      <span className="sr-only">✓</span>
    </i>
  );
}

Checkmark.propTypes = {
  value: PropTypes.bool.isRequired,
};

export default Checkmark;
