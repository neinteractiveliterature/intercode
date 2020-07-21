import React, { useEffect, useState } from 'react';

export type PageLoadingIndicatorProps = {
  visible: boolean,
};

function PageLoadingIndicator({ visible }: PageLoadingIndicatorProps) {
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);

  useEffect(
    () => {
      if (!visible) {
        setShowLoadingIndicator(false);
      }
      const timeoutId = setTimeout(() => setShowLoadingIndicator(visible), 250);
      return () => clearTimeout(timeoutId);
    },
    [visible],
  );

  return (
    <div
      className="text-center mt-5 custom-loading-indicator"
      style={{
        opacity: showLoadingIndicator ? 1.0 : 0.0,
        visibility: showLoadingIndicator ? 'visible' : 'hidden',
      }}
    >
      <i className="fa fa-circle-o-notch fa-spin fa-fw" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default PageLoadingIndicator;
