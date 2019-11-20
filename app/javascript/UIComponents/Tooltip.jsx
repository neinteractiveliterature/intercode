import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function Tooltip({
  withRef, style, visible, placement, arrowProps, children,
}) {
  const placementClass = (placement || '').split('-')[0];

  return (
    <div
      ref={withRef}
      style={{ ...style, ...(visible ? {} : { zIndex: -9999 }) }}
      className={classNames(
        `tooltip bs-tooltip-${placementClass}`,
        { show: visible, 'd-none': !visible },
      )}
      role="tooltip"
    >
      <div className="arrow" ref={arrowProps.ref} style={arrowProps.style} />
      <div className="tooltip-inner">{children}</div>
    </div>
  );
}

Tooltip.propTypes = {
  withRef: PropTypes.func.isRequired,
  style: PropTypes.shape({}).isRequired,
  visible: PropTypes.bool.isRequired,
  placement: PropTypes.string.isRequired,
  arrowProps: PropTypes.shape({
    ref: PropTypes.shape({}).isRequired,
    style: PropTypes.shape({}),
  }).isRequired,
  children: PropTypes.node.isRequired,
};

export default Tooltip;
