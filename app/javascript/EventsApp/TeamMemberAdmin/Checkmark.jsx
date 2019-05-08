import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function Checkmark({ value, className }) {
  if (!value) {
    return null;
  }

  return (
    <i className={classNames('fa fa-check', className)}>
      <span className="sr-only">✓</span>
    </i>
  );
}

Checkmark.propTypes = {
  value: PropTypes.bool.isRequired,
  className: PropTypes.string,
};

Checkmark.defaultProps = {
  className: null,
};

export default Checkmark;
