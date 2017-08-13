// @flow

import React from 'react';

const LoadingIndicator = ({ size = 5 }: { size: number }) => (
  <div className={`d-inline-block display-${size}`}>
    <i className="fa fa-circle-o-notch fa-spin" aria-hidden="true" />
  </div>
);

export default LoadingIndicator;
