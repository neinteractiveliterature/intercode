import { Ref, ReactNode } from 'react';
import classNames from 'classnames';
import { usePopper } from 'react-popper';

export type TooltipProps = Pick<ReturnType<typeof usePopper>, 'styles' | 'attributes' | 'state'> & {
  popperRef: Ref<HTMLDivElement>;
  arrowRef: Ref<HTMLDivElement>;
  visible?: boolean;
  children: ReactNode;
};

function Tooltip({
  popperRef,
  arrowRef,
  styles,
  visible,
  attributes,
  state,
  children,
}: TooltipProps) {
  const placementClass = (state?.placement ?? '').split('-')[0];

  return (
    <div
      ref={popperRef}
      style={{ ...styles.popper, ...(visible ? {} : { zIndex: -9999 }) }}
      className={classNames(`tooltip bs-tooltip-${placementClass}`, {
        show: visible,
        'd-none': !visible,
      })}
      role="tooltip"
      {...attributes.popper}
    >
      <div className="tooltip-arrow" ref={arrowRef} style={styles.arrow} />
      <div className="tooltip-inner">{children}</div>
    </div>
  );
}

export default Tooltip;
