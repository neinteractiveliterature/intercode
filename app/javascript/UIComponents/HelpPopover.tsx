import React, { ReactNode, useCallback, useState } from 'react';
import classNames from 'classnames';
import { useIntercodePopperWithAutoClosing } from './PopperUtils';

// https://stackoverflow.com/questions/36532307/rem-px-in-javascript
function remToPx(rem: number) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

export type HelpPopoverProps = {
  children?: ReactNode;
  className?: string;
  initialVisible?: boolean;
  visibleChanged?: (newVisible: boolean) => void;
};

function HelpPopover({ children, className, initialVisible, visibleChanged }: HelpPopoverProps) {
  const [visible, setVisibleState] = useState(initialVisible);
  const [toggleButton, setToggleButton] = useState<HTMLSpanElement | null>(null);
  const [popover, setPopover] = useState<HTMLDivElement | null>(null);
  const [arrow, setArrow] = useState<HTMLSpanElement | null>(null);

  const setVisible = useCallback(
    (newVisible: boolean) => {
      setVisibleState(newVisible);
      if (visibleChanged) {
        visibleChanged(newVisible);
      }
    },
    [visibleChanged],
  );

  const toggleVisible = (event: React.BaseSyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setVisible(!visible);
  };

  const { styles, attributes } = useIntercodePopperWithAutoClosing(
    popover,
    toggleButton,
    arrow,
    setVisible,
    {
      modifiers: [
        // offset value is pure trial and error, no idea why this works
        { name: 'offset', options: { offset: [remToPx((1.0 + 1.0 / 6.0) * -1), remToPx(0.5)] } },
        { name: 'arrow', options: { element: arrow, padding: remToPx(-0.3) } },
      ],
    },
  );

  return (
    <>
      <span
        role="button"
        tabIndex={0}
        className={classNames('d-inline-block text-center', className)}
        ref={(element) => {
          setToggleButton(element);
        }}
        onClick={toggleVisible}
        onKeyDown={(event) => {
          if (event.keyCode === 13 || event.keyCode === 32) {
            event.preventDefault();
            toggleVisible(event);
          }
        }}
        style={{ width: '1.5rem' }}
      >
        <i className="fa fa-question-circle" style={{ cursor: 'pointer' }}>
          <span className="sr-only">Help</span>
        </i>
      </span>

      <div
        className={classNames('card', 'popover', 'mt-0', 'bs-popover-bottom', {
          'd-none': !visible,
        })}
        ref={setPopover}
        style={styles.popper}
        {...attributes.popper}
      >
        <div className="card-body">{children}</div>
        <span ref={setArrow} style={styles.arrow} className="arrow" />
      </div>
    </>
  );
}

export default HelpPopover;
