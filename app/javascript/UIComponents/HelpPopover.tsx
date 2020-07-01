import React, { useState, ReactNode } from 'react';
import classNames from 'classnames';

import PopperDropdown from './PopperDropdown';

export type HelpPopoverProps = {
  children: ReactNode,
  className?: string,
  initialVisible?: boolean,
  visibleChanged?: (visible: boolean) => void,
};

function HelpPopover({
  children, className, initialVisible, visibleChanged,
}: HelpPopoverProps) {
  const [visible, setVisible] = useState(initialVisible);

  const toggleVisible = (prevVisible: boolean, event: React.BaseSyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const newVisible = !visible;
    setVisible(newVisible);
    if (visibleChanged) {
      visibleChanged(newVisible);
    }
  };

  return (
    <PopperDropdown
      placement="bottom"
      visible={visible}
      onToggle={toggleVisible}
      renderReference={({ ref, toggle }) => (
        <span
          role="button"
          tabIndex={0}
          className={classNames('d-inline', className)}
          ref={ref}
          onClick={toggle}
          onKeyDown={(event) => {
            if (event.keyCode === 13 || event.keyCode === 32) {
              event.preventDefault();
              toggle(event);
            }
          }}
        >
          <i className="fa fa-question-circle" style={{ cursor: 'pointer' }}>
            <span className="sr-only">
              Help
            </span>
          </i>
        </span>
      )}
    >
      {({
        placement,
        arrowProps,
        ref,
        style,
      }) => (
        <div
          className={classNames(
            'card',
            'popover',
            `bs-popover-${placement}`,
            { 'd-none': !visible },
          )}
          ref={ref}
          style={style}
          data-placement={placement}
        >
          <div className="card-body">
            {children}
          </div>
          <span ref={arrowProps.ref} style={arrowProps.style} className="arrow" />
        </div>
      )}
    </PopperDropdown>
  );
}

export default HelpPopover;
