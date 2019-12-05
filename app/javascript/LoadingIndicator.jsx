import React from 'react';
import PropTypes from 'prop-types';

const LoadingIndicator = ({ size = 5 }) => (
  <div className={`d-inline-block display-${size}`} aria-label="Loading...">
    <i className="fa fa-circle-o-notch fa-spin" aria-hidden="true" />
  </div>
);

LoadingIndicator.propTypes = {
  size: PropTypes.number,
};

LoadingIndicator.defaultProps = {
  size: 5,
};

export default LoadingIndicator;
