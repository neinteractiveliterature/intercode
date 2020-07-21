import React from 'react';

export type LoadingIndicatorProps = { size?: number };

const LoadingIndicator = ({ size = 5 }: LoadingIndicatorProps) => (
  <div className={`d-inline-block display-${size ?? 5}`} aria-label="Loading...">
    <i className="fa fa-circle-o-notch fa-spin" aria-hidden="true" />
  </div>
);

export default LoadingIndicator;
