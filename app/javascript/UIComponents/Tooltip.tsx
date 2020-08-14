import React, { Ref, CSSProperties, ReactNode } from 'react';
import classNames from 'classnames';
import { PopperProps, PopperArrowProps } from 'react-popper';

export type TooltipProps = {
  withRef: Ref<HTMLDivElement>,
  style?: CSSProperties,
  visible?: boolean,
  placement: NonNullable<PopperProps['placement']>,
  arrowProps: PopperArrowProps,
  children: ReactNode,
};

function Tooltip({
  withRef, style, visible, placement, arrowProps, children,
}: TooltipProps) {
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

export default Tooltip;
